import { assert } from "chai";
import { generateIconManifest } from "../../scripts/generators/generateIconManifest.js";
import { testIconsOutputDir } from "../data/constants.js";
import { categoryNodes, componentSets, manifest } from "../data/index.js";

describe("generateIconManifest", () => {
  it("should generate the correct icon manifest from a given list of category nodes", () => {
    const result = generateIconManifest(categoryNodes, componentSets, testIconsOutputDir, false);

    assert.deepEqual(result, manifest);
  });
});
