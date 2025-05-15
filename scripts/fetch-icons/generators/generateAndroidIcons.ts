import { readFileSync, writeFileSync } from "fs";
import { IconManifest } from "../../../types.js";
import * as cheerio from "cheerio";
import { createFolder, toSnakeCase } from "../../utils/fileUtils.js";

/**
 * Generates an android icon for each icon in the manifest.
 * @param iconManifest The manifest of icons to generate.
 * @param outputDir The directory to save the generated icons to.
 */
export const generateAndroidIcons = (outputDir: string, iconManifest: IconManifest) => {
  createFolder(outputDir);
  for (const icon of iconManifest) {
    const definition = icon[1];
    outputAndroidFile(definition.roundPath, "round", definition.name, outputDir);
    outputAndroidFile(definition.sharpPath, "sharp", definition.name, outputDir);
  }
};

const outputAndroidFile = (svg: string, type: string, iconName: string, outputDir: string) => {
  try {
    const svg2 = readFileSync(svg).toString();
    const file = generateAndroidIcon(svg2);
    if (file) {
      writeFileSync(`${outputDir}/${getAndroidIconFileName(iconName, type)}`, file);
    } else {
      throw new Error("Error generating Android icon");
    }
  } catch (e) {
    console.error(`Error generating Android icon for ${type} ${iconName}`, e);
  }
};

/**
 * Creates the file name for an Android icon.
 * @param iconName The name of the icon.
 * @returns The file name for the Android icon.
 */
export const getAndroidIconFileName = (iconName: string, type: String) => `ic_${toSnakeCase(iconName)}_${type}.xml`;

/**
 * Creates the contents of an xml file for an Android icon.
 * @param svg The svg data for the icon.
 * @returns The xml file contents for the Android icon as a string.
 */
export const generateAndroidIcon = (svg: string): string => {
  const path = extractPath(svg);
  let file = readFileSync("./scripts/fetch-icons/templates/android-icon.xml.template").toString();
  return file.replace("{{svgPath}}", path);
};

/**
 * Extracts the path from an svg string.
 * @param svgData The svg string to extract the path from.
 * @returns The path from the svg string.
 */
export const extractPath = (svgData: string): string => {
  const svg = cheerio.load(svgData);
  const path = svg("path").attr("d");
  if (!path) {
    throw new Error("Path not found");
  }
  return path;
};
