import { assert } from "chai";
import { getFigmaDocument, getImageFiles } from "../../scripts/utils/api.js";
import { ZDS_ASSETS_FILE_ID } from "../../figmaConfig.js";
import { testFileId } from "../data/constants.js";
import { manifest } from "../data/index.js";
import { IconManifest } from "../../types.js";

/** Smoke tests against the real Figma API: check the shape of responses, not their exact content. */
describe("api (live Figma)", function () {
  const token = process.env.FIGMA_ACCESS_TOKEN;

  before(function () {
    if (!token) this.skip();
  });

  it("getFigmaDocument returns a document with children and componentSets", async () => {
    const response = await getFigmaDocument(ZDS_ASSETS_FILE_ID, token!);
    assert.isNotEmpty(response.document?.children);
    assert.isNotEmpty(response.componentSets);
  });

  it("getImageFiles returns svg markup for each icon", async () => {
    const subset: IconManifest = new Map([...manifest].slice(0, 2));
    const result = await getImageFiles(subset, testFileId, token!);
    assert.equal(result.size, subset.size);
    result.forEach((icon) => {
      assert.match(icon.roundData, /^<svg/);
      assert.match(icon.sharpData, /^<svg/);
    });
  });
});
