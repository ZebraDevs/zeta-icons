import { generateFigmaConnectCall } from "../../scripts/code-connect/generate-code-connect-call.js";
import { generateCodeConnectFile } from "../../scripts/code-connect/generate-code-connect-file.js";
import { getNodeText } from "../../scripts/code-connect/get-node-text.js";
import { assert } from "chai";
import { figmaConnectFile } from "../data/figma-connect-call.js";
import { manifest } from "../data/index.js";

describe("code-connect", () => {
  it("should generate the correct file contents", () => {
    const result = generateFigmaConnectCall("star", "123");

    assert.equal(getNodeText(result), getNodeText(figmaConnectFile));
  });

  it("should generate code connect files from an icon manifest", () => {
    generateCodeConnectFile(`./test/outputs/code-connect`, manifest);
  });
});
