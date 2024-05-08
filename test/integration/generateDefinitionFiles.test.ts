import { assert } from "chai";
import { existsSync } from "fs";
import { generateDefinitionFiles } from "../../scripts/generators/generateDefinitionFiles.js";
import { generatedFontDefinitions, manifest } from "../data/index.js";
import { testDefinitionsOutputDir, testOutputDir } from "../data/constants.js";

describe("generateDefinitionFiles", () => {
  before(async () => {
    generateDefinitionFiles(testOutputDir, testDefinitionsOutputDir, generatedFontDefinitions, manifest);
  });

  it("should write definition files", () => {
    assert.equal(existsSync(`${testDefinitionsOutputDir}/icons.dart`), true);
    assert.equal(existsSync(`${testDefinitionsOutputDir}/icon-types.ts`), true);
  });

  it("should write the icon manifest", () => {
    assert.equal(existsSync(`${testOutputDir}/icon-manifest.json`), true);
  });
});
