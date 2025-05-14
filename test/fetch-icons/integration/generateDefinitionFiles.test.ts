import { assert } from "chai";
import { existsSync } from "fs";
import { generateDefinitionFiles } from "../../../scripts/fetch-icons/generators/generateDefinitionFiles.js";
import { generatedFontDefinitions, manifest } from "../../data/index.js";
import { testDartOutputDir, testOutputDir, testTSOutputDir } from "../../data/constants.js";

describe("generateDefinitionFiles", () => {
  before(async () => {
    generateDefinitionFiles(testOutputDir, generatedFontDefinitions, manifest);
  });

  it("should write definition files", () => {
    assert.equal(existsSync(`${testDartOutputDir}/icons.g.dart`), true);
    assert.equal(existsSync(`${testTSOutputDir}/icon-types.ts`), true);
  });
});
