import { FontType } from "../../scripts/types/customTypes.js";
import { clearDirectory, createFolder, getIconFileName } from "../../scripts/utils/fileUtils.js";
import { existsSync, rmSync, writeFileSync } from "node:fs";
import { testOutputDir } from "../data/constants.js";
import { assert } from "chai";

describe("fileUtils - folders", () => {
  const testDir = `${testOutputDir}/test`;

  before(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true });
    }
  });

  describe("createFolder", () => {
    it("should create a directory successfully", () => {
      const result = createFolder(testDir);

      assert.equal(result, true);
      assert.equal(existsSync(testDir), true);
    });

    it("should not create a directory if it already exists", () => {
      const result = createFolder(testDir);

      assert.equal(result, false);
    });
  });

  describe("clearDirectory", () => {
    const testFilePath = `${testDir}/test.txt`;
    before(() => writeFileSync(testFilePath, ""));

    it("should clear a directory successfully", () => {
      clearDirectory(testDir);

      const dirExists = existsSync(testDir);
      const fileExists = existsSync(testFilePath);

      assert.equal(fileExists, false);
      assert.equal(dirExists, true);
    });
  });

  after(() => {
    rmSync(testDir, { recursive: true });
  });
});

describe("fileUtils - other", () => {
  describe("getIconFileName", () => {
    it("should return the correctly formatted icon name with its type appended (no spaces)", () => {
      const iconName = "Add";
      const fontType: FontType = "round";
      const result = getIconFileName(iconName, fontType);

      assert.equal(result, "add_round");
    });

    it("should return the correctly formatted icon name with its type appended (with spaces)", () => {
      const iconName = "Copy File";
      const fontType: FontType = "sharp";
      const result = getIconFileName(iconName, fontType);

      assert.equal(result, "copy_file_sharp");
    });
  });
});
