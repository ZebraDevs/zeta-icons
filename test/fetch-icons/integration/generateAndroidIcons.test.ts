import {
  extractPath,
  generateAndroidIcon,
  generateAndroidIcons,
} from "../../../scripts/fetch-icons/generators/generateAndroidIcons.js";
import { assert } from "chai";
import { allImageFiles, androidAddIcon, categoryNames, manifest } from "../../data/index.js";
import { checkAndroidIconFilesExist } from "../utils.js";
import { saveSVGs } from "../../../scripts/utils/saveSvgs.js";
import { testIconsOutputDir } from "../../data/constants.js";

describe("generateAndroidIcons", () => {
  before(async () => {
    await saveSVGs(allImageFiles, testIconsOutputDir, categoryNames);
  });

  it("extractPath should extract the path from an svg string", () => {
    const path =
      "M18 13H13V18C13 18.55 12.55 19 12 19C11.45 19 11 18.55 11 18V13H6C5.45 13 5 12.55 5 12C5 11.45 5.45 11 6 11H11V6C11 5.45 11.45 5 12 5C12.55 5 13 5.45 13 6V11H18C18.55 11 19 11.45 19 12C19 12.55 18.55 13 18 13Z";
    const svg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n<g clip-path="url(#clip0_176_5663)">\n<path d="${path}" fill="#1D1E23"/>\n</g>\n<defs>\n<clipPath id="clip0_176_5663">\n<rect width="24" height="24" fill="white"/></clipPath></defs></svg>`;

    const result = extractPath(svg);

    assert.equal(result, path);
  });

  it("extractPath should throw an error if the given svg does not have a path", () => {
    const svg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n<g clip-path="url(#clip0_176_5663)">\n</g>\n<defs>\n<clipPath id="clip0_176_5663">\n<rect width="24" height="24" fill="white"/></clipPath></defs></svg>`;

    assert.throws(() => extractPath(svg), "Path not found");
  });

  it("generateAndroidIcon should create an xml file containing the correct icon", () => {
    const svg =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n<g clip-path="url(#clip0_176_5663)">\n<path d="M18 13H13V18C13 18.55 12.55 19 12 19C11.45 19 11 18.55 11 18V13H6C5.45 13 5 12.55 5 12C5 11.45 5.45 11 6 11H11V6C11 5.45 11.45 5 12 5C12.55 5 13 5.45 13 6V11H18C18.55 11 19 11.45 19 12C19 12.55 18.55 13 18 13Z" fill="#1D1E23"/>\n</g>\n<defs>\n<clipPath id="clip0_176_5663">\n<rect width="24" height="24" fill="white"/>\n</clipPath>\n</defs>\n</svg>\n';

    const file = generateAndroidIcon(svg);

    assert.deepEqual(file, androidAddIcon);
  });

  it("generateAndroidIcons should generate an xml file for each icon", () => {
    generateAndroidIcons("./test/outputs/android", manifest);

    checkAndroidIconFilesExist(manifest, "./test/outputs/android");
  });
});
