import { GenerateFontResult, IconManifest } from "../types/customTypes.js";
import { readFileSync, writeFileSync } from "fs";
import { flutterDir, webDir } from "../fetchIcons.js";
import { createFolder } from "../../utils/fileUtils.js";

/**
 * Writes out `icon-manifest.json`, `icons.g.dart` and `icon-types.ts`.
 *
 * @param {String} outputDir - Location of output directory. Icon manifest is saved here.
 * @param {GenerateFontResult} fontData - Object containing body lines for generating definition files.
 * @param {IconManifest} manifest - data to be written to `icon-manifest.json`
 */
export const generateDefinitionFiles = (outputDir: string, fontData: GenerateFontResult, manifest: IconManifest) => {
  const dartOutputDir = outputDir + flutterDir;
  const tsOutputDir = outputDir + webDir;

  createFolder(dartOutputDir);
  createFolder(tsOutputDir);

  const dartFile = generateDartFile(fontData);
  const tsFile = generateTSFile(fontData);
  const iconManifestFile = JSON.stringify(Object.fromEntries(manifest));

  writeFileSync(dartOutputDir + "/icons.g.dart", dartFile);
  writeFileSync(tsOutputDir + "/icon-types.ts", tsFile);
  writeFileSync(outputDir + "/icon-manifest.json", iconManifestFile);
};

/**
 * Builds out contents of `icons.g.dart`.
 *
 * Inserts new icon data into template file: `scripts/src/templates/icons.dart.template`.
 *
 * @param {GenerateFontResult} fontData - Object containing body lines for generating definition files.
 * @returns {string} Content of `icons.g.dart`.
 */
const generateDartFile = (fontData: GenerateFontResult): string => {
  let dartTemplate = readFileSync("./scripts/templates/icons.dart.template").toString();
  const newLine = "\n";

  const icons = fontData.dartDefinitions.join(newLine);
  const roundIcons = fontData.dartRoundDefinitions.join(newLine);
  const sharpIcons = fontData.dartSharpDefinitions.join(newLine);
  const iconNames =
    fontData.iconNames.map((iconName) => `  '${iconName}': ZetaIcons.${iconName}`).join(`,${newLine}`) + ",";

  dartTemplate = dartTemplate.replace("{{icons}}", icons);
  dartTemplate = dartTemplate.replace("{{roundIcons}}", roundIcons);
  dartTemplate = dartTemplate.replace("{{sharpIcons}}", sharpIcons);
  dartTemplate = dartTemplate.replace("{{iconNames}}", iconNames);

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

  const nameList = fontData.iconNames.map((icon) => `"${icon}"`);
  const iconNames = nameList.join(",\n  ");
  const unionType = nameList.join("\n | ");

  tsTemplate = tsTemplate.replace("{{iconNames}}", iconNames);
  tsTemplate = tsTemplate.replace("{{iconTypes}}", unionType);

  return tsTemplate;
};
