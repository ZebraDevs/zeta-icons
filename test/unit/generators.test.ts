import { assert } from "chai";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import sharp from "sharp";
import { RenameErrorType, ZetaIconNameError } from "@zebra-fed/zeta-icon-validator";
import { generateIconManifest } from "../../scripts/fetch-icons/generators/generateIconManifest.js";
import {
  extractPath,
  generateAndroidIcon,
  generateAndroidIcons,
  getAndroidIconFileName,
} from "../../scripts/fetch-icons/generators/generateAndroidIcons.js";
import { generateDefinitionFiles } from "../../scripts/fetch-icons/generators/generateDefinitionFiles.js";
import { generateFonts } from "../../scripts/fetch-icons/generators/generateFonts.js";
import { generatePNGs } from "../../scripts/fetch-icons/generators/generatePNGs.js";
import { FigmaNode } from "../../scripts/types/figmaTypes.js";
import { GenerateFontResult, IconDefinition, IconManifest } from "../../types.js";
import { categoryNodes, componentSets } from "../data/index.js";
import { captureConsole, makeTmpDir, svgWithPath } from "./helpers.js";

const clone = <T>(o: T): T => JSON.parse(JSON.stringify(o));

/** First `n` icons of the fixture "Content" category, deep cloned. */
const contentCategory = (n: number, categoryName = "Content", idPrefix = ""): FigmaNode => {
  const category = clone(categoryNodes[0]);
  category.name = categoryName;
  const frame = category.children.find((c) => c.type == "FRAME")!;
  frame.name = categoryName;
  frame.children = frame.children.slice(0, n);
  if (idPrefix) {
    frame.children.forEach((icon) => {
      icon.id = idPrefix + icon.id;
      icon.children.forEach((c) => (c.id = idPrefix + c.id));
    });
  }
  return category;
};
const iconsOf = (category: FigmaNode) => category.children.find((c) => c.type == "FRAME")!.children;

describe("generateIconManifest (extra)", () => {
  let output: ReturnType<typeof captureConsole>;
  beforeEach(() => (output = captureConsole()));
  afterEach(() => output.restore());

  it("builds an entry per valid icon with snake_cased paths, ids and search terms", () => {
    const category = contentCategory(2);
    const [first] = iconsOf(category);
    const result = generateIconManifest([category], componentSets, "out/icons", false);

    assert.equal(result.size, 2);
    const entry = result.get(first.id)!;
    assert.equal(entry.name, first.name);
    assert.equal(entry.category, "content");
    assert.equal(entry.roundPath, `out/icons/content/${first.name.toLowerCase().replaceAll(" ", "_")}_round.svg`);
    assert.equal(entry.sharpPath, entry.roundPath.replace("_round", "_sharp"));
    assert.equal(entry.roundId, first.children.find((c) => c.name.includes("Round"))!.id);
    assert.equal(entry.sharpId, first.children.find((c) => c.name.includes("Sharp"))!.id);
    assert.isArray(entry.searchTerms);
    assert.deepEqual(output.log, []);
  });

  it("logs the category and icon name when verbose", () => {
    const category = contentCategory(1);
    generateIconManifest([category], componentSets, "out", true);
    const lines = output.log.map((l) => String(l[0]));
    assert.include(lines, "---------------- Current category: content ----------------");
    assert.include(lines, `Current Icon: ${iconsOf(category)[0].name}`);
  });

  it("returns an empty manifest for no categories", () => {
    assert.equal(generateIconManifest([], componentSets, "out", false).size, 0);
  });

  it("throws when the category name has an invalid character", () => {
    const category = contentCategory(1, "bad/name");
    assert.throws(() => generateIconManifest([category], componentSets, "out", false), "invalid character");
  });

  it("skips (and logs) icons whose validation has a high severity error", () => {
    const category = contentCategory(2);
    const [bad, good] = iconsOf(category);
    bad.name = "1 starts with number";

    const result = generateIconManifest([category], componentSets, "out", false);

    assert.deepEqual([...result.keys()], [good.id]);
    assert.isTrue(output.log.some((l) => String(l[0]).startsWith("❌ 1 starts with number")));
  });

  it("skips icons that use a reserved word as their name", () => {
    const category = contentCategory(1);
    iconsOf(category)[0].name = "class";
    assert.equal(generateIconManifest([category], componentSets, "out", false).size, 0);
  });

  describe("duplicate icon names across categories", () => {
    const build = () => {
      const first = contentCategory(1, "Content");
      const second = contentCategory(1, "Hardware", "dup-");
      return { first, second, name: iconsOf(first)[0].name };
    };

    it("keeps the duplicate under its original name, because validator 0.2.4 never sets `newName` (known bug)", () => {
      const { first, second, name } = build();

      const result = generateIconManifest([first, second], componentSets, "out", false);

      assert.deepEqual([...result.values()].map((i) => i.name), [name, name]);
      assert.isFalse(output.log.some((l) => String(l[0]).includes("Renamed to")));
    });

    describe("when the validator provides `newName`", () => {
      // Simulates the intended validator behaviour: newName is parsed from the rename message.
      before(() =>
        Object.defineProperty(ZetaIconNameError.prototype, "newName", {
          configurable: true,
          get(this: ZetaIconNameError) {
            return this.type == RenameErrorType.iconRenamed ? this.message.split("renamed to ")[1] : undefined;
          },
        }),
      );
      after(() => void delete (ZetaIconNameError.prototype as { newName?: string }).newName);

      it("renames the duplicate and uses the new name in its paths", () => {
        const { first, second, name } = build();

        const result = generateIconManifest([first, second], componentSets, "out", false);

        assert.deepEqual([...result.values()].map((i) => i.name), [name, `${name} Hardware`]);
        const renamed = result.get(iconsOf(second)[0].id)!;
        assert.equal(renamed.category, "hardware");
        assert.equal(renamed.roundPath, `out/hardware/${name.toLowerCase()}_hardware_round.svg`);
        assert.isTrue(output.log.some((l) => String(l[0]) === `✅ ${name} Renamed to: ${name} Hardware`));
      });
    });
  });

  it("keeps icons that only have medium severity issues (e.g. a coloured fill)", () => {
    const category = contentCategory(1);
    const icon = iconsOf(category)[0];
    (icon.children[0] as unknown as { fills: unknown }).fills = [{ color: { r: 0.5, g: 0.2, b: 0.9 } }];

    const result = generateIconManifest([category], componentSets, "out", false);

    assert.equal(result.size, 1);
    assert.equal(result.get(icon.id)!.name, icon.name);
  });

  it("throws if style children cannot be resolved after validation passed", () => {
    const category = contentCategory(1);
    const icon = iconsOf(category)[0];
    icon.children.filter = () => {
      throw new Error("nope");
    };
    assert.throws(() => generateIconManifest([category], componentSets, "out", false), `Error finding styles for ${icon.name}`);
  });
});

describe("android generation (extra)", () => {
  let tmp: ReturnType<typeof makeTmpDir>;
  beforeEach(() => (tmp = makeTmpDir()));
  afterEach(() => tmp.cleanup());

  const definition = (name: string, roundPath: string, sharpPath: string): IconDefinition => ({
    name,
    searchTerms: [],
    category: "c",
    roundPath,
    sharpPath,
    roundId: "1",
    sharpId: "2",
  });

  it("getAndroidIconFileName snake_cases and wraps in ic_ / .xml", () => {
    assert.equal(getAndroidIconFileName("Add Circle", "round"), "ic_add_circle_round.xml");
    assert.equal(getAndroidIconFileName("Star", "sharp"), "ic_star_sharp.xml");
  });

  it("extractPath returns the d attribute of the first path", () => {
    assert.equal(extractPath(svgWithPath("M1 1H2")), "M1 1H2");
    assert.equal(extractPath('<svg><path d="A"/><path d="B"/></svg>'), "A");
  });

  it("extractPath throws when there is no path or the d attribute is empty", () => {
    assert.throws(() => extractPath("<svg></svg>"), "Path not found");
    assert.throws(() => extractPath('<svg><path d=""/></svg>'), "Path not found");
  });

  it("generateAndroidIcon fills the template's pathData and keeps the vector wrapper", () => {
    const xml = generateAndroidIcon(svgWithPath("M5 5H6"));
    assert.include(xml, 'android:pathData="M5 5H6"');
    assert.notInclude(xml, "{{svgPath}}");
    assert.match(xml, /^<vector xmlns:android=/);
    assert.include(xml, 'android:viewportWidth="1200"');
  });

  it("generateAndroidIcons writes an xml per round and sharp svg", () => {
    writeFileSync(`${tmp.dir}/a_round.svg`, svgWithPath("M1 1H2"));
    writeFileSync(`${tmp.dir}/a_sharp.svg`, svgWithPath("M3 3H4"));
    const manifest: IconManifest = new Map([
      ["1", definition("Add Circle", `${tmp.dir}/a_round.svg`, `${tmp.dir}/a_sharp.svg`)],
    ]);

    generateAndroidIcons(`${tmp.dir}/android/nested`, manifest);

    assert.include(readFileSync(`${tmp.dir}/android/nested/ic_add_circle_round.xml`).toString(), 'pathData="M1 1H2"');
    assert.include(readFileSync(`${tmp.dir}/android/nested/ic_add_circle_sharp.xml`).toString(), 'pathData="M3 3H4"');
  });

  it("logs an error and skips the file when the svg is missing or has no path", () => {
    writeFileSync(`${tmp.dir}/nopath_sharp.svg`, "<svg></svg>");
    const manifest: IconManifest = new Map([
      ["1", definition("Broken", `${tmp.dir}/missing_round.svg`, `${tmp.dir}/nopath_sharp.svg`)],
    ]);
    const output = captureConsole();
    try {
      generateAndroidIcons(`${tmp.dir}/android`, manifest);
      assert.deepEqual(
        output.error.map((e) => e[0]),
        ["Error generating Android icon for round Broken", "Error generating Android icon for sharp Broken"],
      );
    } finally {
      output.restore();
    }
    assert.isFalse(existsSync(`${tmp.dir}/android/ic_broken_round.xml`));
    assert.isFalse(existsSync(`${tmp.dir}/android/ic_broken_sharp.xml`));
  });

  it("creates the output directory even for an empty manifest", () => {
    generateAndroidIcons(`${tmp.dir}/empty`, new Map() as IconManifest);
    assert.isTrue(existsSync(`${tmp.dir}/empty`));
  });
});

describe("generateDefinitionFiles (extra)", () => {
  let tmp: ReturnType<typeof makeTmpDir>;
  beforeEach(() => (tmp = makeTmpDir()));
  afterEach(() => tmp.cleanup());

  const fontData: GenerateFontResult = {
    dartDefinitions: ["DEF_A", "DEF_B"],
    dartRoundDefinitions: ["ROUND_A", "ROUND_B"],
    dartSharpDefinitions: ["SHARP_A", "SHARP_B"],
    dartRoundLookup: ["  0xe001: ROUND_LOOKUP_A", "  0xe002: ROUND_LOOKUP_B"],
    dartSharpLookup: ["  0xe001: SHARP_LOOKUP_A", "  0xe002: SHARP_LOOKUP_B"],
    iconNames: ["a", "b_c"],
  };

  it("writes icons.g.dart with every placeholder filled", () => {
    generateDefinitionFiles(tmp.dir, fontData, new Map() as IconManifest);
    const dart = readFileSync(`${tmp.dir}/flutter/icons.g.dart`).toString();

    assert.notMatch(dart, /\{\{\w+\}\}/);
    assert.include(dart, "DEF_A\nDEF_B");
    assert.include(dart, "ROUND_A\nROUND_B");
    assert.include(dart, "SHARP_A\nSHARP_B");
    assert.include(dart, "  'a': ZetaIcons.a,\n  'b_c': ZetaIcons.b_c,");
    assert.include(dart, "  0xe001: ROUND_LOOKUP_A,\n  0xe002: ROUND_LOOKUP_B,");
    assert.include(dart, "  0xe001: SHARP_LOOKUP_A,\n  0xe002: SHARP_LOOKUP_B,");
  });

  it("writes icon-types.ts with the name list and union type", () => {
    generateDefinitionFiles(tmp.dir, fontData, new Map() as IconManifest);
    const ts = readFileSync(`${tmp.dir}/web/icon-types.ts`).toString();

    assert.notMatch(ts, /\{\{\w+\}\}/);
    assert.include(ts, 'export const ZetaIconNameList = [\n  "a",\n  "b_c"\n];');
    assert.include(ts, 'export type ZetaIconName = "a"\n | "b_c";');
  });

  it("handles no icons", () => {
    const empty: GenerateFontResult = {
      dartDefinitions: [],
      dartRoundDefinitions: [],
      dartSharpDefinitions: [],
      dartRoundLookup: [],
      dartSharpLookup: [],
      iconNames: [],
    };
    generateDefinitionFiles(tmp.dir, empty, new Map() as IconManifest);
    assert.include(readFileSync(`${tmp.dir}/web/icon-types.ts`).toString(), "export type ZetaIconName = ;");
  });
});

describe("generateFonts", function () {
  this.timeout(60000);
  let tmp: ReturnType<typeof makeTmpDir>;
  beforeEach(() => (tmp = makeTmpDir()));
  afterEach(() => tmp.cleanup());

  const writeIcons = (names: string[]) => {
    mkdirSync(`${tmp.dir}/in`, { recursive: true });
    names.forEach((n, i) => {
      for (const style of ["round", "sharp"]) {
        writeFileSync(`${tmp.dir}/in/${n}_${style}.svg`, svgWithPath(`M${i} ${i}H20V20H${i}Z`));
      }
    });
  };

  it("builds ttf and woff2 for both styles and returns matching dart/ts data", async () => {
    writeIcons(["alpha", "zoom_in"]);
    const output = captureConsole();
    let result: GenerateFontResult;
    try {
      result = await generateFonts(`${tmp.dir}/in`, "my-font", `${tmp.dir}/ttf`, `${tmp.dir}/woff2`);
    } finally {
      output.restore();
    }

    for (const file of ["ttf/my-font-round.ttf", "ttf/my-font-sharp.ttf", "woff2/my-font-round.woff2", "woff2/my-font-sharp.woff2"]) {
      assert.isTrue(existsSync(`${tmp.dir}/${file}`), file);
      assert.isAbove(readFileSync(`${tmp.dir}/${file}`).length, 100, file);
    }
    // TrueType magic number, woff2 magic number.
    assert.equal(readFileSync(`${tmp.dir}/ttf/my-font-round.ttf`).readUInt32BE(0), 0x00010000);
    assert.equal(readFileSync(`${tmp.dir}/woff2/my-font-sharp.woff2`).toString("latin1", 0, 4), "wOF2");

    assert.deepEqual(result.iconNames, ["alpha", "zoom_in"]);
    assert.lengthOf(result.dartDefinitions, 2);
    assert.lengthOf(result.dartRoundDefinitions, 2);
    assert.lengthOf(result.dartSharpDefinitions, 2);
    assert.deepEqual(result.dartRoundLookup, [
      "  0xe001: ZetaIcons.alpha_round",
      "  0xe002: ZetaIcons.zoom_in_round",
    ]);
    assert.deepEqual(result.dartSharpLookup, [
      "  0xe001: ZetaIcons.alpha_sharp",
      "  0xe002: ZetaIcons.zoom_in_sharp",
    ]);

    assert.include(result.dartDefinitions[1], "static const IconData zoom_in = IconData(0xe002, fontFamily: family, fontPackage: package);");
    assert.include(result.dartDefinitions[1], "Zoom In icon </i>");
    assert.include(result.dartDefinitions[1], "outputs/png/zoom_in_round.png");
    assert.include(result.dartRoundDefinitions[0], "static const IconData alpha_round = IconData(0xe001, fontFamily: familyRound, fontPackage: package);");
    assert.include(result.dartRoundDefinitions[0], "Alpha icon (round)");
    assert.include(result.dartSharpDefinitions[0], "static const IconData alpha_sharp = IconData(0xe001, fontFamily: familySharp, fontPackage: package);");
    assert.include(result.dartSharpDefinitions[0], "outputs/png/alpha_sharp.png");
    assert.include(result.dartSharpDefinitions[0], "Alpha icon (sharp)");
    // dartDefinitions are generated without a type, so they warn.
    assert.isAtLeast(output.warn.length, 2);
  });

  it("rejects when there are no svgs to build a font from", async () => {
    mkdirSync(`${tmp.dir}/in`);
    let error: unknown;
    try {
      await generateFonts(`${tmp.dir}/in`, "f", `${tmp.dir}/ttf`, `${tmp.dir}/woff2`);
    } catch (e) {
      error = e;
    }
    assert.instanceOf(error, Error);
  });
});

describe("generatePNGs", function () {
  this.timeout(30000);
  let tmp: ReturnType<typeof makeTmpDir>;
  beforeEach(() => (tmp = makeTmpDir()));
  afterEach(() => tmp.cleanup());

  it("writes a 512px wide png for every svg in every category", async () => {
    for (const cat of ["one", "two"]) {
      mkdirSync(`${tmp.dir}/icons/${cat}`, { recursive: true });
    }
    writeFileSync(`${tmp.dir}/icons/one/a_round.svg`, svgWithPath("M2 2H22V22H2Z", "#000000"));
    writeFileSync(`${tmp.dir}/icons/one/a_sharp.svg`, svgWithPath("M2 2H22V22H2Z", "#000000"));
    writeFileSync(`${tmp.dir}/icons/two/b_round.svg`, svgWithPath("M2 2H22V22H2Z", "#000000"));

    await generatePNGs(`${tmp.dir}/icons`, `${tmp.dir}/png`, ["one", "two"]);

    for (const name of ["a_round", "a_sharp", "b_round"]) {
      const meta = await sharp(`${tmp.dir}/png/${name}.png`).metadata();
      assert.equal(meta.format, "png", name);
      assert.equal(meta.width, 512, name);
      assert.equal(meta.height, 512, name);
    }
  });

  it("modulates lightness so black icons become dark grey rather than pure black", async () => {
    mkdirSync(`${tmp.dir}/icons/one`, { recursive: true });
    writeFileSync(`${tmp.dir}/icons/one/a_round.svg`, svgWithPath("M0 0H24V24H0Z", "#000000"));
    await generatePNGs(`${tmp.dir}/icons`, `${tmp.dir}/png`, ["one"]);
    const { data } = await sharp(`${tmp.dir}/png/a_round.png`).raw().toBuffer({ resolveWithObject: true });
    assert.equal(data[3], 255); // opaque
    assert.isAbove(data[0], 0);
  });

  it("creates the output directory when there are no categories", async () => {
    await generatePNGs(`${tmp.dir}/icons`, `${tmp.dir}/png`, []);
    assert.isTrue(existsSync(`${tmp.dir}/png`));
  });

  it("rejects when a category directory does not exist", async () => {
    let error: unknown;
    try {
      await generatePNGs(`${tmp.dir}/icons`, `${tmp.dir}/png`, ["nope"]);
    } catch (e) {
      error = e;
    }
    assert.instanceOf(error, Error);
  });
});
