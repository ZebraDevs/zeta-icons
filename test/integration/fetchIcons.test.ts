import { assert } from "chai";
import { ZDS_ASSETS_FILE_ID, ZDS_ASSETS_ICON_PAGE_NAME } from "../../figmaConfig.js";
import fetchIcons, { definitionsDir, fontDir } from "../../scripts/fetchIcons.js";
import { checkFigmaTokenIsSet } from "../../scripts/utils/figmaUtils.js";
import { zdsIntegrationOutputDir } from "../data/constants.js";
import { existsSync, readFileSync, rmSync } from "fs";
import { IconManifest } from "../../scripts/types/customTypes.js";
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
      true
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
    checkFontsExist("zeta-icons", `${zdsIntegrationOutputDir}/${fontDir}`);
  });

  it("should write definition files", () => {
    assert.equal(existsSync(`${zdsIntegrationOutputDir}/${definitionsDir}/icons.dart`), true);
    assert.equal(existsSync(`${zdsIntegrationOutputDir}/${definitionsDir}/icon-types.ts`), true);
  });
});
