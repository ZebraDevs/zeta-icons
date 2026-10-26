import { assert } from "chai";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "fs";
import main, {
  androidDir,
  flutterDir,
  iconsDir,
  pngDir,
  tempDir,
  webDir,
} from "../../scripts/fetch-icons/fetchIcons.js";
import { generateHash } from "../../scripts/utils/hash.js";
import { IconManifest, ImageManifest } from "../../types.js";
import { testIconPageName } from "../data/constants.js";
import { allImageFiles, figmaDoc, manifest } from "../data/index.js";
import { captureConsole, jsonResponse, makeTmpDir, stubFetch, textResponse } from "./helpers.js";

/** Fake Figma + CDN built from the recorded fixtures. Nothing here touches the network. */
const fakeFigma = (documentStatus = 200) => {
  const svgById = new Map<string, string>();
  allImageFiles.forEach((icon) => {
    svgById.set(icon.roundId, icon.roundData);
    svgById.set(icon.sharpId, icon.sharpData);
  });
  return stubFetch((url) => {
    if (url.startsWith("https://api.figma.com/v1/files/")) {
      return jsonResponse(figmaDoc, documentStatus, documentStatus == 200 ? "OK" : "Forbidden");
    }
    if (url.startsWith("https://api.figma.com/v1/images/")) {
      const ids = new URL(url).searchParams.get("ids")!.split(",");
      return jsonResponse({ images: Object.fromEntries(ids.map((id) => [id, `https://cdn.test/${encodeURIComponent(id)}`])) });
    }
    return textResponse(svgById.get(decodeURIComponent(url.split("/").pop()!))!);
  });
};

describe("icon pipeline (offline)", function () {
  this.timeout(120000);
  let tmp: ReturnType<typeof makeTmpDir>;
  let output: ReturnType<typeof captureConsole>;
  let figma: ReturnType<typeof fakeFigma>;

  beforeEach(() => {
    tmp = makeTmpDir();
    output = captureConsole();
  });
  afterEach(() => {
    figma?.restore();
    output.restore();
    tmp.cleanup();
  });

  it("exports the output sub-directory names", () => {
    assert.deepEqual([iconsDir, tempDir, pngDir, flutterDir, webDir, androidDir], [
      "/icons",
      "/temp",
      "/png",
      "/flutter",
      "/web",
      "/android",
    ]);
  });

  it("generates every output on the first run and returns the hash of the images", async () => {
    figma = fakeFigma();
    const out = `${tmp.dir}/out`;

    const hash = await main("token", "FILE", testIconPageName, "", out, false);

    // manifest
    const written: IconManifest = new Map(Object.entries(JSON.parse(readFileSync(`${out}/icon-manifest.json`).toString())));

    // The hash covers paths (which include the temp dir) plus svg data, so rebuild what main hashed.
    const hashed: ImageManifest = new Map(
      [...written].map(([id, icon]) => [
        id,
        { ...icon, roundData: allImageFiles.get(id)!.roundData, sharpData: allImageFiles.get(id)!.sharpData },
      ]),
    );
    assert.equal(hash, generateHash(hashed));
    assert.deepEqual([...written.keys()], [...manifest.keys()]);

    // per-icon outputs
    for (const icon of written.values()) {
      assert.isTrue(existsSync(icon.roundPath), icon.roundPath);
      assert.isTrue(existsSync(icon.sharpPath), icon.sharpPath);
      const fileName = (p: string) => p.split("/").pop()!.replace(".svg", "");
      assert.isTrue(existsSync(`${out}/png/${fileName(icon.roundPath)}.png`));
      assert.isTrue(existsSync(`${out}/png/${fileName(icon.sharpPath)}.png`));
    }
    // The fixture has two icons called "Save" (in different categories). Android/PNG file names ignore the
    // category, so the second overwrites the first - see the validator `newName` note in generators.test.ts.
    const uniqueFiles = new Set([...written.values()].map((i) => i.name)).size * 2;
    assert.equal(readdirSync(`${out}/android`).length, uniqueFiles);
    assert.equal(readdirSync(`${out}/png`).length, uniqueFiles);

    // fonts + definitions
    for (const f of ["flutter/assets/zeta-icons-round.ttf", "flutter/assets/zeta-icons-sharp.ttf", "web/zeta-icons-round.woff2", "web/zeta-icons-sharp.woff2", "flutter/icons.g.dart", "web/icon-types.ts"]) {
      assert.isTrue(existsSync(`${out}/${f}`), f);
    }
    const names = readFileSync(`${out}/web/icon-types.ts`).toString();
    for (const icon of written.values()) assert.include(names, `"${icon.name.toLowerCase().replaceAll(" ", "_")}"`);

    // network: one document call, then image calls + one download per id
    assert.equal(figma.calls.filter((c) => c.url.startsWith("https://api.figma.com/v1/files/FILE")).length, 1);
    assert.equal(figma.calls.filter((c) => c.url.startsWith("https://cdn.test/")).length, written.size * 2);
    assert.include(output.log.map((l) => String(l[0])).join("\n"), "Done - Icons updated!");
  });

  it("does nothing and returns undefined when the hash is unchanged", async () => {
    figma = fakeFigma();
    const out = `${tmp.dir}/out`;
    const hash = await main("token", "FILE", testIconPageName, "", out, false);
    writeFileSync(`${out}/sentinel.txt`, "still here");

    const second = await main("token", "FILE", testIconPageName, hash!, out, false);

    assert.isUndefined(second);
    assert.isTrue(existsSync(`${out}/sentinel.txt`), "output directory must not be cleared");
  });

  it("clears stale files when the hash changed", async () => {
    figma = fakeFigma();
    const out = `${tmp.dir}/out`;
    const first = await main("token", "FILE", testIconPageName, "", out, false);
    writeFileSync(`${out}/sentinel.txt`, "stale");

    const second = await main("token", "FILE", testIconPageName, "old-hash", out, false);

    assert.equal(second, first);
    assert.isFalse(existsSync(`${out}/sentinel.txt`));
  });

  it("uses the token for every Figma call", async () => {
    figma = fakeFigma();
    await main("secret-token", "FILE", testIconPageName, "", `${tmp.dir}/out`, false);
    const apiCalls = figma.calls.filter((c) => c.url.startsWith("https://api.figma.com"));
    assert.isAbove(apiCalls.length, 1);
    apiCalls.forEach((c) => assert.equal((c.options?.headers as Record<string, string>)["X-Figma-Token"], "secret-token"));
  });

  it("rejects when the icon page cannot be found, before downloading any image", async () => {
    figma = fakeFigma();
    let error: Error | undefined;
    try {
      await main("token", "FILE", "No such page", "", `${tmp.dir}/out`, false);
    } catch (e) {
      error = e as Error;
    }
    assert.include(error?.message, "Cannot find icons page for page name No such page");
    assert.equal(figma.calls.length, 1);
  });

  it("rejects when Figma refuses the document request", async () => {
    figma = fakeFigma(403);
    let error: Error | undefined;
    try {
      await main("bad", "FILE", testIconPageName, "", `${tmp.dir}/out`, false);
    } catch (e) {
      error = e as Error;
    }
    assert.equal(error?.message, "Failed to fetch Figma document: Forbidden");
    assert.isFalse(existsSync(`${tmp.dir}/out`));
  });
});
