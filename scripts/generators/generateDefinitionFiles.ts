import { createFolder } from "../utils/fileUtils.js";
import { GenerateFontResult, IconManifest } from "../types/customTypes.js";
import { readFileSync, writeFileSync } from "fs";

/**
 * Writes out `icon-manifest.json`, `icons.dart` and `icon-types.ts`.
 *
 * @param {String} outputDir - Location of output directory. Icon manifest is saved here.
 * @param {String} definitionsOutputDir - Location of definitions output.
 * @param {GenerateFontResult} fontData - Object containing body lines for generating definition files.
 * @param {IconManifest} manifest - data to be written to `icon-manifest.json`
 */
export const generateDefinitionFiles = (
  outputDir: string,
  definitionsOutputDir: string,
  fontData: GenerateFontResult,
  manifest: IconManifest
) => {
  createFolder(definitionsOutputDir);

  const dartFile = generateDartFile(fontData);
  const tsFile = generateTSFile(fontData);
  const iconManifestFile = JSON.stringify(Object.fromEntries(manifest));

  writeFileSync(definitionsOutputDir + "/icons.dart", dartFile);
  writeFileSync(definitionsOutputDir + "/icon-types.ts", tsFile);
  writeFileSync(outputDir + "/icon-manifest.json", iconManifestFile);
};

/**
 * Builds out contents of `icons.dart`.
 *
 * Inserts new icon data into template file: `scripts/src/templates/icons.dart.template`.
 *
 * @param {GenerateFontResult} fontData - Object containing body lines for generating definition files.
 * @returns {string} Content of `icons.dart`.
 */
const generateDartFile = (fontData: GenerateFontResult): string => {
  let dartTemplate = readFileSync("./scripts/templates/icons.dart.template").toString();

  const roundIcons = fontData.dartRoundTypes.join("\n");
  const sharpIcons = fontData.dartSharpTypes.join("\n");
  const roundList = fontData.dartRoundList.join(",\n") + ",";
  const sharpList = fontData.dartSharpList.join(",\n") + ",";

  dartTemplate = dartTemplate.replace("{{roundIcons}}", roundIcons);
  dartTemplate = dartTemplate.replace("{{sharpIcons}}", sharpIcons);
  dartTemplate = dartTemplate.replace("{{sharpIconList}}", sharpList);
  dartTemplate = dartTemplate.replace("{{roundIconList}}", roundList);

  return dartTemplate;
};

/**
 * Builds out contents of `icon-types.ts`.
 *
 * Inserts new icon name data into template file: `scripts/src/icon-types.ts.template`.
 * @param {GenerateFontResult} fontData - Object containing body lines for generating definition files.
 * @returns {string} Content of `icon-types.ts`.
 */
const generateTSFile = (fontData: GenerateFontResult): string => {
  let tsTemplate = readFileSync("./scripts/templates/icon-types.ts.template").toString();

  const tsList = fontData.tsTypes.map((icon) => `"${icon}"`).join(",\n  ");

  tsTemplate = tsTemplate.replace("{{iconNames}}", tsList);

  return tsTemplate;
};
