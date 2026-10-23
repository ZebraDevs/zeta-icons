import { assert } from "chai";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { ZDS_ASSETS_FILE_ID } from "../../figmaConfig.js";
import { generateFigmaConnectCall } from "../../scripts/code-connect/generate-code-connect-call.js";
import { generateCodeConnectFile } from "../../scripts/code-connect/generate-code-connect-file.js";
import { getNodeText } from "../../scripts/code-connect/get-node-text.js";
import { getBody, getConventionalCommit, getIcons } from "../../scripts/on-release/get-changed-icons.js";
import { IconDefinition, IconManifest } from "../../types.js";
import packageJson from "../../package.json" with { type: "json" };
import { captureConsole, makeTmpDir, withCwd } from "./helpers.js";
import ts from "typescript";

describe("code-connect (extra)", () => {
  it("generateFigmaConnectCall renders the figma.connect call for an icon", () => {
    const text = getNodeText(generateFigmaConnectCall("star", "12:34"));
    assert.equal(
      text,
      `figma.connect("https://www.figma.com/design/${ZDS_ASSETS_FILE_ID}?node-id=12:34", { props: { rounded: figma.enum("Style", { Round: true, Sharp: false }) }, example: props => html \`<zeta-icon rounded=\${props.rounded}>star</zeta-icon>\` });`,
    );
  });

  it("lower-cases the icon name and replaces every space with an underscore", () => {
    const text = getNodeText(generateFigmaConnectCall("Add Circle Outline", "1"));
    assert.include(text, ">add_circle_outline</zeta-icon>");
  });

  it("getNodeText prints arbitrary nodes", () => {
    assert.equal(getNodeText(ts.factory.createIdentifier("hello")), "hello");
    assert.equal(getNodeText(ts.factory.createStringLiteral("x")), '"x"');
  });

  describe("generateCodeConnectFile", () => {
    let tmp: ReturnType<typeof makeTmpDir>;
    beforeEach(() => (tmp = makeTmpDir()));
    afterEach(() => tmp.cleanup());

    const def = (name: string): IconDefinition => ({
      name,
      searchTerms: [],
      category: "c",
      roundPath: "",
      sharpPath: "",
      roundId: "r",
      sharpId: "s",
    });

    it("writes a prettier-formatted file with the import and one connect call per icon, keyed by node id", async () => {
      const manifest: IconManifest = new Map([
        ["1:1", def("Add")],
        ["2:2", def("Zoom In")],
      ]);
      await generateCodeConnectFile(`${tmp.dir}/nested/out`, manifest);

      const file = readFileSync(`${tmp.dir}/nested/out/code-connect.figma.ts`).toString();
      assert.match(file, /^import \{ figma, html \} from "@figma\/code-connect\/html";\n/);
      assert.equal(file.match(/figma\.connect\(/g)!.length, 2);
      assert.include(file, `?node-id=1:1"`);
      assert.include(file, `?node-id=2:2"`);
      assert.include(file, ">add</zeta-icon>");
      assert.include(file, ">zoom_in</zeta-icon>");
      assert.include(file, 'props: { rounded: figma.enum("Style", { Round: true, Sharp: false }) },'); // prettier formatting
      assert.include(file, "example: (props) =>"); // printer emitted `props =>`, prettier adds the parens
      assert.isTrue(file.endsWith("\n"));
    });

    it("writes only the import for an empty manifest", async () => {
      await generateCodeConnectFile(tmp.dir, new Map() as IconManifest);
      assert.equal(
        readFileSync(`${tmp.dir}/code-connect.figma.ts`).toString(),
        'import { figma, html } from "@figma/code-connect/html";\n',
      );
    });
  });
});

describe("get-changed-icons", () => {
  let tmp: ReturnType<typeof makeTmpDir>;
  beforeEach(() => (tmp = makeTmpDir()));
  afterEach(() => tmp.cleanup());

  const changelog = (latest: string) =>
    `# Changelog\n\nintro\n\n## [2.0.0](link) (2026-01-01)\n\n${latest}\n## [1.0.0](link) (2025-01-01)\n\n### ✅ Icons added\n\n- **Old:** Ignored (round)\n`;

  const read = (latest: string) =>
    withCwd(tmp.dir, () => {
      writeFileSync("CHANGELOG.md", changelog(latest));
      return getIcons();
    });

  it("parses added, updated and removed icons from the latest release only, in that order", async () => {
    const icons = await read(
      [
        "### ✂️ Icons removed",
        "",
        "- **Maps:** Old Pin (sharp)",
        "",
        "### ✅ Icons added",
        "",
        "- **Content:** Add Circle (round)",
        "- **Content:** Remove (sharp)",
        "",
        "### 🎨 Icons updated",
        "",
        "- **File:** Export (round)",
      ].join("\n"),
    );

    assert.deepEqual(icons, [
      { name: "Add Circle", category: "Content", style: "round", change: "added" },
      { name: "Remove", category: "Content", style: "sharp", change: "added" },
      { name: "Export", category: "File", style: "round", change: "updated" },
      { name: "Old Pin", category: "Maps", style: "sharp", change: "removed" },
    ]);
  });

  it("strips a trailing colon from the category and skips blank lines", async () => {
    const icons = await read("### ✅ Icons added\n\n\n   \n- **A:** B (round)\n\n");
    assert.deepEqual(icons, [{ name: "B", category: "A", style: "round", change: "added" }]);
  });

  it("returns [] for sections that are missing", async () => {
    assert.deepEqual(await read("nothing here"), []);
  });

  it("returns [] when the changelog has no release sections", async () => {
    const icons = await withCwd(tmp.dir, () => {
      writeFileSync("CHANGELOG.md", "# Changelog\n");
      return getIcons();
    });
    assert.deepEqual(icons, []);
  });

  it("drops a whole section when one of its lines is not in the '- **Category:** Name (style)' format", async () => {
    const icons = await read(
      "### ✅ Icons added\n\n- **A:** B (round)\n- malformed line\n\n### 🎨 Icons updated\n\n- **C:** D (sharp)\n",
    );
    assert.deepEqual(icons, [{ name: "D", category: "C", style: "sharp", change: "updated" }]);
  });

  it("throws when CHANGELOG.md does not exist", async () => {
    let error: unknown;
    try {
      await withCwd(tmp.dir, () => getIcons());
    } catch (e) {
      error = e;
    }
    assert.instanceOf(error, Error);
  });

  describe("formatting", () => {
    const icons = [
      { name: "Add", category: "Content", style: "round", change: "added" as const },
      { name: "Old", category: "Maps", style: "sharp", change: "removed" as const },
    ];

    it("getConventionalCommit lists one line per icon preceded by a newline", () => {
      assert.equal(getConventionalCommit(icons), "\niconadded(Content): Add (round)\niconremoved(Maps): Old (sharp)");
    });
    it("getConventionalCommit handles no icons", () => assert.equal(getConventionalCommit([]), "\n"));
    it("getBody builds a markdown list", () => {
      assert.equal(getBody(icons), "\n## Icons updated \n- Content /  Add (round)\n- Maps /  Old (sharp)\n");
    });
    it("getBody handles no icons", () => assert.equal(getBody([]), "\n## Icons updated \n\n"));
  });
});

describe("updateVersionConst", () => {
  let tmp: ReturnType<typeof makeTmpDir>;
  let importCount = 0;
  const realExit = process.exit;
  let output: ReturnType<typeof captureConsole>;

  beforeEach(() => {
    tmp = makeTmpDir();
    output = captureConsole();
    process.exit = ((code?: number) => {
      throw new Error(`process.exit(${code})`);
    }) as typeof process.exit;
  });
  afterEach(() => {
    process.exit = realExit;
    output.restore();
    tmp.cleanup();
  });

  const files = {
    "index.ts": 'export const version = "0.0.1";\nexport const other = "keep";\n',
    "scripts/fetch-icons/templates/icons.dart.template": "const zetaIconsVersion = '0.0.1';\n// {{icons}}\n",
    "outputs/flutter/icons.g.dart": "const zetaIconsVersion = '0.0.1';\nrest\n",
  };

  const seed = (overrides: Record<string, string | null> = {}) => {
    for (const [path, content] of Object.entries({ ...files, ...overrides })) {
      if (content === null) continue;
      const full = `${tmp.dir}/${path}`;
      mkdirSync(full.split("/").slice(0, -1).join("/"), { recursive: true });
      writeFileSync(full, content);
    }
  };

  // The module runs on import, so a unique query string forces a fresh evaluation each time.
  const run = () => withCwd(tmp.dir, () => import(`../../scripts/ci/updateVersionConst.js?run=${importCount++}`));

  it("rewrites the version in index.ts, the dart template and the generated dart file", async () => {
    seed();
    await run();

    const v = packageJson.version;
    assert.equal(
      readFileSync(`${tmp.dir}/index.ts`).toString(),
      `export const version = "${v}";\nexport const other = "keep";\n`,
    );
    assert.equal(
      readFileSync(`${tmp.dir}/scripts/fetch-icons/templates/icons.dart.template`).toString(),
      `const zetaIconsVersion = '${v}';\n// {{icons}}\n`,
    );
    assert.equal(
      readFileSync(`${tmp.dir}/outputs/flutter/icons.g.dart`).toString(),
      `const zetaIconsVersion = '${v}';\nrest\n`,
    );
    assert.deepEqual(output.log, [[`✓ Updated version to ${v}`]]);
  });

  it("is idempotent", async () => {
    seed();
    await run();
    const first = readFileSync(`${tmp.dir}/index.ts`).toString();
    await run();
    assert.equal(readFileSync(`${tmp.dir}/index.ts`).toString(), first);
  });

  it("exits with an error when a target file is missing", async () => {
    seed({ "outputs/flutter/icons.g.dart": null });
    let error: Error | undefined;
    try {
      await run();
    } catch (e) {
      error = e as Error;
    }
    assert.equal(error?.message, "process.exit(1)");
    assert.deepEqual(output.error, [["❌ File not found: ./outputs/flutter/icons.g.dart"]]);
  });

  it("exits with an error when the version pattern is not found in a file", async () => {
    seed({ "index.ts": "export const nothing = 1;\n" });
    let error: Error | undefined;
    try {
      await run();
    } catch (e) {
      error = e as Error;
    }
    assert.equal(error?.message, "process.exit(1)");
    assert.deepEqual(output.error, [["❌ Version pattern not found in ./index.ts"]]);
    assert.isFalse(existsSync(`${tmp.dir}/missing`));
  });
});
