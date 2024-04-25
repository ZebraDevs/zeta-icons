import { getFigmaDocument, getImageFiles } from "../scripts/utils/api.js";
import { findIconPage, extractCategoryNodes } from "../scripts/utils/figmaUtils.js";
import { generateFonts } from "../scripts/generators/generateFonts.js";
import { generateIconManifest } from "../scripts/generators/generateIconManifest.js";
import { figmaToken, outputDir, zdsAssetsfigmaFileId } from "./test-data.js";
import { writeFileSync } from "fs";
import { generateHash } from "../scripts/utils/hash.js";
import { Component } from "../scripts/types/figmaTypes.js";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const _figmaDoc = await getFigmaDocument(zdsAssetsfigmaFileId, figmaToken);
writeFileSync("./test/test-data/figmaDoc.json", JSON.stringify(_figmaDoc));
const _iconPage = findIconPage(_figmaDoc.document, "🦓 Icons");
writeFileSync("./test/test-data/iconsPage.json", JSON.stringify(_iconPage));
const _categories = extractCategoryNodes(_iconPage);
writeFileSync("./test/test-data/categories.json", JSON.stringify(_categories));
const componentSet: Map<string, Component> = new Map(Object.entries(_figmaDoc.componentSets));
const _manifest = generateIconManifest(_categories, componentSet, outputDir, false);
writeFileSync("./test/test-data/manifest.json", JSON.stringify(Object.fromEntries(_manifest)));
const _allImageFiles = await getImageFiles(_manifest, zdsAssetsfigmaFileId, figmaToken);
writeFileSync("./test/test-data/allImageFiles.json", JSON.stringify(Object.fromEntries(_allImageFiles)));
const newHash = generateHash(_allImageFiles);
writeFileSync("./test/test-data/hash.txt", newHash);
const generatedFontResponse = await generateFonts(outputDir + "/temp", outputDir);
writeFileSync("./test/test-data/generatedFontResponse.json", JSON.stringify(generatedFontResponse));
console.log("Values updated");
