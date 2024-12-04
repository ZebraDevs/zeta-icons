import { saveSVGs } from "../../../scripts/utils/saveSvgs.js";
import { allImageFiles, categoryNames } from "../../data/index.js";
import { testIconsOutputDir } from "../../data/constants.js";
import { existsSync } from "fs";
import { assert } from "chai";
import { checkIconsExist } from "../utils.js";
import { ImageManifest } from "../../../types.js";

describe("saveSvgs", () => {
  before(async () => {
    await saveSVGs(allImageFiles, testIconsOutputDir, categoryNames);
  });

  it("should create a folder for each category", () => {
    categoryNames.forEach((category) => assert.equal(existsSync(`${testIconsOutputDir}/${category}`), true));
  });

  it("should successfully save each svg", () => {
    const imageManifest: ImageManifest = new Map(Object.assign(allImageFiles));

    checkIconsExist(imageManifest);
  });
});
