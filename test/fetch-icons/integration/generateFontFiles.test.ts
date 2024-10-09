import "./saveSvgs.test.js"; // Ensures saveSVGs is called before running these tests.

import { assert } from "chai";
import { checkFontsExist } from "../utils.js";
import { generateFonts } from "../../../scripts/fetch-icons/generators/generateFonts.js";
import { optimizeSVGs } from "../../../scripts/utils/optimizeSvgs.js";
import {
  testIconsOutputDir,
  testTempOutputDir,
  testFontName,
  testDartOutputDir,
  testTSOutputDir,
} from "../../data/constants.js";
import { categoryNames, generatedFontDefinitions } from "../../data/index.js";
import { GenerateFontResult } from "../../../scripts/types/customTypes.js";

describe("generateFontFiles", () => {
  let result: GenerateFontResult;

  before(async () => {
    await optimizeSVGs(testIconsOutputDir, testTempOutputDir, categoryNames);
    result = await generateFonts(testTempOutputDir, testFontName, testDartOutputDir, testTSOutputDir);
  });

  it("should return a correct font generation result", () => {
    assert.deepEqual(result, generatedFontDefinitions);
  });

  it("should have created sharp and rounded ttf and woff2 files", () => {
    checkFontsExist(testFontName, testDartOutputDir, testTSOutputDir);
  });
});
