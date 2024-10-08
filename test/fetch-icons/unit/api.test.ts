import { assert } from "chai";
import { DocumentResponse } from "../../../scripts/fetch-icons/types/figmaTypes.js";
import { getFigmaDocument, getImageFiles } from "../../../scripts/utils/api.js";
import { testFileId } from "../../data/constants.js";
import { allImageFiles, manifest } from "../../data/index.js";
import { before } from "mocha";
import { checkFigmaTokenIsSet } from "../../../scripts/utils/figmaUtils.js";
import { ZDS_ASSETS_FILE_ID } from "../../../figmaConfig.js";

describe("api", () => {
  before(() => {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
    checkFigmaTokenIsSet(process.env.FIGMA_ACCESS_TOKEN);
  });

  describe("getFigmaDocument", () => {
    let response: DocumentResponse;

    before(async () => {
      response = await getFigmaDocument(ZDS_ASSETS_FILE_ID, process.env.FIGMA_ACCESS_TOKEN!);
    });

    it("response should have children", () => {
      assert.notEqual(response.document?.children, undefined);
    });

    it("response should have componentSets", () => {
      assert.notEqual(response.componentSets, undefined);
    });
  });

  describe("getImageFiles", () => {
    it("should return a valid ImageManifest when given an IconManifest for the test Figma file", async () => {
      const result = await getImageFiles(manifest, testFileId, process.env.FIGMA_ACCESS_TOKEN!);

      assert.deepEqual(result, allImageFiles);
    });
  });
});
