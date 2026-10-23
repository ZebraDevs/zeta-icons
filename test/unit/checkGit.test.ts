import { assert } from "chai";
import { execSync } from "child_process";
import { mkdirSync, rmSync, writeFileSync } from "fs";
import {
  checkForIconChanges,
  getAllChangedFiles,
  GitChangeType,
  parseFilesChanged,
  stageAllFiles,
} from "../../scripts/utils/checkGit.js";
import { captureConsole, makeTmpDir, withCwd } from "./helpers.js";

const git = (cmd: string) => execSync(`git ${cmd}`, { stdio: "pipe" }).toString();
const write = (path: string, content = "x") => {
  mkdirSync(path.split("/").slice(0, -1).join("/") || ".", { recursive: true });
  writeFileSync(path, content);
};

describe("checkGit (real temporary repo)", () => {
  let tmp: ReturnType<typeof makeTmpDir>;

  beforeEach(async () => {
    tmp = makeTmpDir();
    await withCwd(tmp.dir, () => {
      git("init -q");
      git("config user.email test@example.com");
      git("config user.name test");
      git("config commit.gpgsign false");
      write("outputs/icons/action/keep_round.svg", "keep");
      write("outputs/icons/action/edit_round.svg", "old");
      write("outputs/icons/action/remove_round.svg", "bye");
      write("outputs/other.txt", "other");
      git("add -A");
      git('commit -q -m init');
    });
  });
  afterEach(() => tmp.cleanup());

  it("getAllChangedFiles reports staged add / modify / delete under outputs/icons only", () =>
    withCwd(tmp.dir, () => {
      write("outputs/icons/action/new_round.svg", "new");
      write("outputs/icons/action/edit_round.svg", "changed");
      rmSync("outputs/icons/action/remove_round.svg");
      write("outputs/other.txt", "changed too"); // outside outputs/icons: ignored
      git("add -A");

      const changes = getAllChangedFiles();

      const byPath = Object.fromEntries(changes.map((c) => [c.path, c.type]));
      assert.deepEqual(byPath, {
        "outputs/icons/action/new_round.svg": "A" as GitChangeType,
        "outputs/icons/action/edit_round.svg": "M" as GitChangeType,
        "outputs/icons/action/remove_round.svg": "D" as GitChangeType,
      });
    }));

  it("getAllChangedFiles returns [] when nothing changed and ignores untracked files", () =>
    withCwd(tmp.dir, () => {
      assert.deepEqual(getAllChangedFiles(), []);
      write("outputs/icons/action/untracked_round.svg");
      assert.deepEqual(getAllChangedFiles(true), []);
    }));

  it("getAllChangedFiles does not report renames (status 'R100' does not match the pattern)", () =>
    withCwd(tmp.dir, () => {
      git("mv outputs/icons/action/keep_round.svg outputs/icons/action/kept_round.svg");
      assert.deepEqual(getAllChangedFiles(), []);
    }));

  it("stageAllFiles stages untracked and modified files", () =>
    withCwd(tmp.dir, () => {
      write("outputs/icons/action/new_round.svg");
      write("outputs/other.txt", "changed");
      const output = captureConsole();
      try {
        stageAllFiles(true);
      } finally {
        output.restore();
      }
      const status = git("status --porcelain");
      assert.include(status, "A  outputs/icons/action/new_round.svg");
      assert.include(status, "M  outputs/other.txt");
    }));

  it("stageAllFiles works on a clean tree without verbose logs", () =>
    withCwd(tmp.dir, () => {
      assert.doesNotThrow(() => stageAllFiles());
      assert.equal(git("status --porcelain"), "");
    }));

  it("checkForIconChanges stages everything then returns the icon changes", () =>
    withCwd(tmp.dir, () => {
      write("outputs/icons/action/new_round.svg");
      const output = captureConsole();
      let changes;
      try {
        changes = checkForIconChanges();
      } finally {
        output.restore();
      }
      assert.deepEqual(changes, [{ type: "A", path: "outputs/icons/action/new_round.svg" }]);
      assert.deepEqual(output.log, [["Staged all files"]]);
    }));

  it("GitChangeType exposes every git status letter", () => {
    assert.deepEqual(
      Object.keys(GitChangeType).sort(),
      ["A", "B", "C", "D", "M", "R", "T", "U", "X"],
    );
    assert.equal(GitChangeType.A, "Added");
    assert.equal(GitChangeType.R, "Renamed");
  });
});

describe("parseFilesChanged (extra)", () => {
  const parse = (files: { type: string; path: string }[]) => parseFilesChanged(files as []);

  it("returns 'No icon changes' for an empty list", () => assert.equal(parse([]), "No icon changes"));

  it("returns 'No icon changes' when only non-icon files changed", () =>
    assert.equal(parse([{ type: "M", path: "package.json" }, { type: "A", path: "outputs/png/a_round.png" }]), "No icon changes"));

  it("returns 'No icon changes' for icon files with an unhandled change type", () =>
    assert.equal(parse([{ type: "T", path: "outputs/icons/a/b_round.svg" }]), "No icon changes"));

  it("formats added icons, title-casing category and name", () =>
    assert.equal(
      parse([{ type: "A", path: "outputs/icons/arrows_and/zoom_in_round.svg" }]),
      "\niconadd(Arrows_and): Zoom In",
    ));

  it("deduplicates round and sharp variants of the same icon", () =>
    assert.equal(
      parse([
        { type: "A", path: "outputs/icons/maps/pin_round.svg" },
        { type: "A", path: "outputs/icons/maps/pin_sharp.svg" },
      ]),
      "\niconadd(Maps): Pin",
    ));

  it("treats Renamed as an update and lists adds, updates then removes", () =>
    assert.equal(
      parse([
        { type: "D", path: "outputs/icons/maps/old_round.svg" },
        { type: "R", path: "outputs/icons/file/moved_sharp.svg" },
        { type: "M", path: "outputs/icons/file/edited_round.svg" },
        { type: "A", path: "outputs/icons/content/fresh_sharp.svg" },
      ]),
      "\niconadd(Content): Fresh\niconupdate(File): Moved\niconupdate(File): Edited\niconremove(Maps): Old",
    ));

  it("handles single word icon names", () =>
    assert.equal(parse([{ type: "A", path: "outputs/icons/x/star_round.svg" }]), "\niconadd(X): Star"));
});
