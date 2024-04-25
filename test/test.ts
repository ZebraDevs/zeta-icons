import { getFigmaDocument, getImageFiles } from "../scripts/utils/api.js";
import fetchIcons from "../scripts/fetchIcons.js";
import { findIconPage, extractCategoryNodes } from "../scripts/utils/figmaUtils.js";
import { clearDirectory } from "../scripts/utils/fileUtils.js";
import { generateIconManifest } from "../scripts/generators/generateIconManifest.js";
import { saveSVGs } from "../scripts/utils/saveSvgs.js";
import {
  figmaToken,
  testFigmaFileId,
  outputDir,
  allImageFiles,
  categories,
  figmaDoc,
  hash,
  iconPage,
  manifest,
  categoryNames,
  zdsAssetsfigmaFileId,
} from "./test-data.js";
import { Component } from "../scripts/types/figmaTypes.js";
import { generateHash } from "../scripts/utils/hash.js";
import { optimizeSVGs } from "../scripts/utils/optmizeSvgs.js";
import { generateFonts } from "../scripts/generators/generateFonts.js";
import { generateDefinitionFiles } from "../scripts/generators/generateDefinitionFiles.js";
import { generatePNGs } from "../scripts/generators/generatePNGs.js";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

// Locked icons Test page is: https://www.figma.com/file/oIiGXVNKX4KjppcGxOEbZa/IconsTestPage?type=design&node-id=156%3A1674&mode=design&t=g5XPv72Yi7RPDjS4-1

const functionsToTest = {
  integration: true,
  getFigmaDocument: false,
  findIconPage: false,
  extractCategories: false,
  generateIconManifest: false,
  getImageFiles: false,
  generateHash: false,
  clearDirectory: false,
  saveSVGs: false,
  generateFonts: false,
  generatePNGs: false,
};

const output = (name: string, val1: any, val2: any) => {
  return val1.toString() === val2.toString() ? console.log("Success - " + name) : console.error("Error - " + name);
};
if (functionsToTest.integration) {
  fetchIcons(figmaToken, testFigmaFileId, "Icons", hash, outputDir, true);
}

if (functionsToTest.getFigmaDocument) {
  const _figmaDoc = await getFigmaDocument(testFigmaFileId, figmaToken);
  output("getFigmaDocument", figmaDoc, _figmaDoc);
}

if (functionsToTest.findIconPage) {
  const _iconPage = findIconPage(figmaDoc.document, "Icons");

  output("findIconPage", iconPage, _iconPage);
}

if (functionsToTest.extractCategories) {
  //TODO: This is not passing. Maybe something to do with ts?
  const _categories = extractCategoryNodes(iconPage);
  output("extractCategories", categories, _categories);
}

if (functionsToTest.generateIconManifest) {
  const componentSet: Map<string, Component> = new Map(Object.entries(figmaDoc.componentSets));
  const _manifest = generateIconManifest(categories, componentSet, outputDir, true);
  output("generateIconManifest", manifest, _manifest);
}

if (functionsToTest.getImageFiles) {
  const _allImageFiles = await getImageFiles(manifest, testFigmaFileId, figmaToken);
  output("getImageFiles", allImageFiles, _allImageFiles);
}

if (functionsToTest.generateHash) {
  const _hash = generateHash(allImageFiles);
  output("generateHash", hash, _hash);
}
if (functionsToTest.clearDirectory) {
  const _clearDirectory = clearDirectory(outputDir);
  output("clearDirectory", true, _clearDirectory);
}
if (functionsToTest.saveSVGs) {
  await saveSVGs(allImageFiles, outputDir, categoryNames);
}
if (functionsToTest.generateFonts) {
  await optimizeSVGs(outputDir + "/icons", outputDir + "/temp", categoryNames);
  const fontData = await generateFonts(outputDir + "/temp", outputDir);
  generateDefinitionFiles(outputDir, outputDir + "/definitions", fontData, manifest);
}
if (functionsToTest.generatePNGs) {
  generatePNGs(outputDir + "/icons", outputDir + "/png", categoryNames);
}
