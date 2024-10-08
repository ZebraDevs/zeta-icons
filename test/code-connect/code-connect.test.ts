import { getNodeText } from "../../scripts/code-connect/get-node-text.js";
import { generateConnectFileContents } from "../../scripts/code-connect/generate-connect-file-contents.js";
import { generateCodeConnectFiles } from "../../scripts/code-connect/generate-code-connect-files.js";
import { assert } from "chai";
import { figmaConnectFile } from "../data/figma-connect-file.js";
import { manifest } from "../data/index.js";

describe("code-connect", () => {
  it("should generate the correct file contents", () => {
    const result = generateConnectFileContents("star", "123");

    assert.equal(getNodeText(result), getNodeText(figmaConnectFile));
  });

  it("should generate code connect files from an icon manifes", () => {
    generateCodeConnectFiles(`./test/outputs/code-connect`, manifest);
  });
});
