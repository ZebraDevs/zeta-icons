import { assert } from "chai";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import md5 from "md5";
import {
  checkFigmaTokenIsSet,
  extractCategoryNames,
  extractCategoryNodes,
  extractIconSets,
  findIconPage,
  getSearchTerms,
} from "../../scripts/utils/figmaUtils.js";
import {
  clearDirectory,
  createFolder,
  getIconFileName,
  toSnakeCase,
  writeSVGToFile,
} from "../../scripts/utils/fileUtils.js";
import { generateHash } from "../../scripts/utils/hash.js";
import { saveSVGs } from "../../scripts/utils/saveSvgs.js";
import { optimizeSVGs } from "../../scripts/utils/optimizeSvgs.js";
import { ComponentSets, FigmaNode } from "../../scripts/types/figmaTypes.js";
import { ImageManifest } from "../../types.js";
import { captureConsole, makeTmpDir, svgWithPath } from "./helpers.js";

const node = (name: string, type: string, children: FigmaNode[] = [], id = name): FigmaNode =>
  ({ name, type, id, children }) as FigmaNode;

describe("figmaUtils (synthetic)", () => {
  describe("findIconPage", () => {
    it("returns the first page with a matching name", () => {
      const first = node("Icons", "CANVAS", [], "1");
      const second = node("Icons", "CANVAS", [], "2");
      assert.strictEqual(findIconPage(node("doc", "DOCUMENT", [node("Other", "CANVAS"), first, second]), "Icons"), first);
    });

    it("throws a descriptive error when no page matches (case-sensitive)", () => {
      const doc = node("doc", "DOCUMENT", [node("icons", "CANVAS")]);
      assert.throws(() => findIconPage(doc, "Icons"), "Cannot find icons page for page name Icons");
    });
  });

  describe("extractCategoryNodes", () => {
    it("returns FRAME children of the 'icons' page, ignoring dna / internal use only / non frames", () => {
      const keep1 = node("Action", "FRAME");
      const keep2 = node("Maps", "FRAME");
      const page = node("page", "CANVAS", [
        node("Cover", "FRAME"),
        node("ICONS", "SECTION", [
          keep1,
          node("DNA", "FRAME"),
          node("Internal Use Only", "FRAME"),
          node("Loose text", "TEXT"),
          keep2,
        ]),
      ]);
      // "icons" lookup is case-insensitive and finds the SECTION, children filtered by FRAME + ignore list.
      assert.deepEqual(extractCategoryNodes(page), [keep1, keep2]);
    });

    it("throws when there is no icons node", () => {
      assert.throws(() => extractCategoryNodes(node("page", "CANVAS", [node("Cover", "FRAME")])), "Icons page not found");
    });
  });

  describe("extractIconSets", () => {
    it("returns only COMPONENT_SET children of the frame matching the category name", () => {
      const set1 = node("Add", "COMPONENT_SET");
      const set2 = node("Remove", "COMPONENT_SET");
      const category = node("Content", "FRAME", [
        node("Content", "TEXT"),
        node("Content", "FRAME", [set1, node("stray", "COMPONENT"), set2]),
      ]);
      assert.deepEqual(extractIconSets(category), [set1, set2]);
    });

    it("returns [] when the matching frame has no children property", () => {
      const inner = { name: "Content", type: "FRAME", id: "i" } as FigmaNode;
      assert.deepEqual(extractIconSets(node("Content", "FRAME", [inner])), []);
    });

    it("throws when no frame matches the category name", () => {
      const category = node("Content", "FRAME", [node("Other", "FRAME")]);
      assert.throws(() => extractIconSets(category), "Cannot find matching node for category name Content");
    });
  });

  describe("getSearchTerms", () => {
    const sets: ComponentSets = new Map([
      ["1", { name: "Add", description: "Plus, add, create" }],
      ["2", { name: "None", description: "" }],
    ]);

    it("splits the description on ', '", () => assert.deepEqual(getSearchTerms("1", sets), ["Plus", "add", "create"]));
    it("returns [''] for an empty description", () => assert.deepEqual(getSearchTerms("2", sets), [""]));
    it("returns [] for an unknown id", () => assert.deepEqual(getSearchTerms("3", sets), []));
  });

  describe("extractCategoryNames", () => {
    it("snake_cases each category name", () => {
      assert.deepEqual(
        extractCategoryNames([node("Action", "FRAME"), node("Arrows And Things", "FRAME")]),
        ["action", "arrows_and_things"],
      );
    });
    it("returns [] for no categories", () => assert.deepEqual(extractCategoryNames([]), []));
  });

  describe("checkFigmaTokenIsSet", () => {
    it("throws for undefined", () => assert.throws(() => checkFigmaTokenIsSet(undefined), "Figma Token is not set"));
    it("throws for an empty string", () => assert.throws(() => checkFigmaTokenIsSet(""), "Figma Token is not set"));
    it("does not throw for a token", () => assert.doesNotThrow(() => checkFigmaTokenIsSet("abc")));
  });
});

describe("fileUtils (extra)", () => {
  let tmp: ReturnType<typeof makeTmpDir>;
  beforeEach(() => (tmp = makeTmpDir()));
  afterEach(() => tmp.cleanup());

  describe("toSnakeCase", () => {
    it("lowercases and replaces spaces by default", () => assert.equal(toSnakeCase("Add Circle Outline"), "add_circle_outline"));
    it("replaces every occurrence of a custom separator", () => assert.equal(toSnakeCase("A-B-C", "-"), "a_b_c"));
    it("leaves an empty string alone", () => assert.equal(toSnakeCase(""), ""));
    it("does not replace other characters", () => assert.equal(toSnakeCase("A-B C"), "a-b_c"));
  });

  describe("getIconFileName", () => {
    it("joins the snake_cased name and type", () => assert.equal(getIconFileName("Zoom In", "round"), "zoom_in_round"));
  });

  describe("String.prototype.capitalize", () => {
    it("uppercases the first letter only", () => assert.equal("hello world".capitalize(), "Hello world"));
    it("is a no-op for an already capitalised string", () => assert.equal("Round".capitalize(), "Round"));
    it("returns '' and warns for an empty string", () => {
      const output = captureConsole();
      try {
        assert.equal("".capitalize(), "");
        assert.equal(output.warn.length, 1);
        assert.equal(output.warn[0][0], "capitalize() was called on an empty string.");
      } finally {
        output.restore();
      }
    });
  });

  describe("createFolder", () => {
    it("creates nested directories and normalises the path", () => {
      const dir = `${tmp.dir}/a/./b/../c`;
      assert.isTrue(createFolder(dir));
      assert.isTrue(existsSync(`${tmp.dir}/a/c`));
      assert.isFalse(createFolder(dir));
    });
  });

  describe("clearDirectory", () => {
    it("removes nested content and recreates the empty directory", async () => {
      mkdirSync(`${tmp.dir}/x/y`, { recursive: true });
      writeFileSync(`${tmp.dir}/x/y/f.txt`, "hi");
      await clearDirectory(`${tmp.dir}/x`);
      assert.isTrue(existsSync(`${tmp.dir}/x`));
      assert.isFalse(existsSync(`${tmp.dir}/x/y`));
    });

    it("creates the directory if it does not exist", async () => {
      await clearDirectory(`${tmp.dir}/new`);
      assert.isTrue(existsSync(`${tmp.dir}/new`));
    });
  });

  describe("writeSVGToFile", () => {
    it("writes the svg scaled up 50x", async () => {
      const file = `${tmp.dir}/out.svg`;
      await writeSVGToFile(svgWithPath(), file);
      const written = readFileSync(file).toString();
      assert.match(written, /width="1200"/);
      assert.match(written, /height="1200"/);
      assert.match(written, /viewBox="0 0 1200 1200"/);
      assert.match(written, /<path/);
    });

    it("rejects when the destination directory does not exist", async () => {
      let error: unknown;
      try {
        await writeSVGToFile(svgWithPath(), `${tmp.dir}/missing/dir/out.svg`);
      } catch (e) {
        error = e;
      }
      assert.instanceOf(error, Error);
    });
  });
});

describe("generateHash", () => {
  const manifest = (round: string): ImageManifest =>
    new Map([
      [
        "1",
        {
          name: "A",
          searchTerms: [],
          category: "c",
          roundPath: "r",
          sharpPath: "s",
          roundId: "1",
          sharpId: "2",
          roundData: round,
          sharpData: "x",
        },
      ],
    ]);

  it("is the md5 of the JSON of the map as an object", () => {
    const m = manifest("a");
    assert.equal(generateHash(m), md5(JSON.stringify(Object.fromEntries(m))));
    assert.match(generateHash(m), /^[0-9a-f]{32}$/);
  });
  it("is deterministic", () => assert.equal(generateHash(manifest("a")), generateHash(manifest("a"))));
  it("changes when the data changes", () => assert.notEqual(generateHash(manifest("a")), generateHash(manifest("b"))));
  it("hashes an empty map", () => assert.equal(generateHash(new Map() as ImageManifest), md5("{}")));
});

describe("saveSVGs (synthetic)", () => {
  let tmp: ReturnType<typeof makeTmpDir>;
  beforeEach(() => (tmp = makeTmpDir()));
  afterEach(() => tmp.cleanup());

  it("creates category folders and writes a scaled round and sharp svg per icon", async () => {
    const icons: ImageManifest = new Map([
      [
        "1",
        {
          name: "Add",
          searchTerms: [],
          category: "content",
          roundPath: `${tmp.dir}/icons/content/add_round.svg`,
          sharpPath: `${tmp.dir}/icons/content/add_sharp.svg`,
          roundId: "1",
          sharpId: "2",
          roundData: svgWithPath("M0 0H1V1Z"),
          sharpData: svgWithPath("M0 0H2V2Z"),
        },
      ],
    ]);
    await saveSVGs(icons, `${tmp.dir}/icons`, ["content", "empty_category"]);

    assert.isTrue(existsSync(`${tmp.dir}/icons/empty_category`));
    assert.include(readFileSync(`${tmp.dir}/icons/content/add_round.svg`).toString(), "M0 0H50V50Z");
    assert.include(readFileSync(`${tmp.dir}/icons/content/add_sharp.svg`).toString(), "M0 0H100V100Z");
  });

  it("only creates folders for an empty manifest", async () => {
    await saveSVGs(new Map() as ImageManifest, `${tmp.dir}/icons`, ["a", "b"]);
    assert.isTrue(existsSync(`${tmp.dir}/icons/a`));
    assert.isTrue(existsSync(`${tmp.dir}/icons/b`));
  });
});

describe("optimizeSVGs", function () {
  this.timeout(60000);
  let tmp: ReturnType<typeof makeTmpDir>;
  beforeEach(() => (tmp = makeTmpDir()));
  afterEach(() => tmp.cleanup());

  it("redraws every svg of each category into the temp dir as paths only", async () => {
    mkdirSync(`${tmp.dir}/icons/one`, { recursive: true });
    mkdirSync(`${tmp.dir}/icons/two`, { recursive: true });
    const withClip =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#c)"><path d="M2 2H22V22H2Z" fill="#000"/></g><defs><clipPath id="c"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>';
    writeFileSync(`${tmp.dir}/icons/one/a_round.svg`, withClip);
    writeFileSync(`${tmp.dir}/icons/two/b_sharp.svg`, withClip);

    await optimizeSVGs(`${tmp.dir}/icons`, `${tmp.dir}/temp`, ["one", "two"]);

    for (const file of ["a_round.svg", "b_sharp.svg"]) {
      assert.isTrue(existsSync(`${tmp.dir}/temp/${file}`), file);
      const out = readFileSync(`${tmp.dir}/temp/${file}`).toString();
      assert.include(out, "<path");
      assert.notInclude(out, "clip-path");
    }
  });

  it("logs and carries on when a category cannot be optimised", async () => {
    const output = captureConsole();
    try {
      await optimizeSVGs(`${tmp.dir}/icons`, `${tmp.dir}/temp`, ["missing"]);
      assert.isTrue(existsSync(`${tmp.dir}/temp`));
      assert.equal(output.error.length, 1);
      assert.include(String(output.error[0][0]), "Error optimizing icons from missing");
    } finally {
      output.restore();
    }
  });

  it("strips shell metacharacters from the category before running svgo", async () => {
    const output = captureConsole();
    try {
      await optimizeSVGs(`${tmp.dir}/icons`, `${tmp.dir}/temp`, ["x; touch pwned"]);
      assert.isFalse(existsSync("pwned"));
      assert.isFalse(existsSync(`${tmp.dir}/pwned`));
      assert.equal(output.error.length, 1);
    } finally {
      output.restore();
    }
  });
});
