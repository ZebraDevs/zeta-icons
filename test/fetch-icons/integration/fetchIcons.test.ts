import assert from "assert";
import { ZDS_ASSETS_FILE_ID, ZDS_ASSETS_ICON_PAGE_NAME } from "../../../figmaConfig.js";
import { rmSync, existsSync, readFileSync } from "fs";
import fetchIcons from "../../../scripts/fetch-icons/fetchIcons.js";
import { IconManifest } from "../../../scripts/fetch-icons/types/customTypes.js";
import { checkFigmaTokenIsSet } from "../../../scripts/utils/figmaUtils.js";
import { zdsIntegrationOutputDir, testDartOutputDir, testTSOutputDir } from "../../data/constants.js";
import { checkFontsExist, checkIconsExist } from "../utils.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

describe("fetchIcons", () => {
  before(async () => {
    rmSync(zdsIntegrationOutputDir, { recursive: true, force: true });
    require("dotenv").config({
      path: ".env.test.local",
    });

    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
    checkFigmaTokenIsSet(process.env.FIGMA_ACCESS_TOKEN);

    await fetchIcons(
      process.env.FIGMA_ACCESS_TOKEN!,
      ZDS_ASSETS_FILE_ID,
      ZDS_ASSETS_ICON_PAGE_NAME,
      "",
      zdsIntegrationOutputDir,
      true,
    );
  });

  const iconManifestPath = `${zdsIntegrationOutputDir}/icon-manifest.json`;
  it("should create an icon manifest", () => {
    assert.equal(existsSync(iconManifestPath), true);
  });

  it("should create all the svgs in the icon manifest", () => {
    const iconManifest: IconManifest = new Map(Object.entries(JSON.parse(readFileSync(iconManifestPath).toString())));

    checkIconsExist(iconManifest);
  });

  it("should create fonts", () => {
    checkFontsExist(
      "zeta-icons",
      `${zdsIntegrationOutputDir}/${testDartOutputDir}`,
      `${zdsIntegrationOutputDir}/${testTSOutputDir}`,
    );
  });

  it("should write definition files", () => {
    assert.equal(existsSync(`${zdsIntegrationOutputDir}/${testDartOutputDir}/icons.g.dart`), true);
    assert.equal(existsSync(`${zdsIntegrationOutputDir}/${testTSOutputDir}/icon-types.ts`), true);
  });
});
