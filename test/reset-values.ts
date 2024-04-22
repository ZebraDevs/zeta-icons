import { getFigmaDocument, getImageFiles } from "../scripts/src/utils/api.ts";
import { findIconPage, extractCategoryNodes } from "../scripts/src/utils/figmaUtils.ts";
import { generateFonts } from "../scripts/src/generators/generateFonts.ts";
import { generateIconManifest } from "../scripts/src/generators/generateIconManifest.ts";
import { figmaFileId, figmaToken, outputDir } from "./test-data.ts";
import { writeFileSync } from "fs";
import { generateHash } from "../scripts/src/utils/hash.ts";
import { Component } from "../scripts/src/types/figmaTypes.ts";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const _figmaDoc = await getFigmaDocument(figmaFileId, figmaToken);
writeFileSync("./test/test-data/figmaDoc.json", JSON.stringify(_figmaDoc));
const _iconPage = findIconPage(_figmaDoc.document);
writeFileSync("./test/test-data/iconsPage.json", JSON.stringify(_iconPage));
const _categories = extractCategoryNodes(_iconPage);
writeFileSync("./test/test-data/categories.json", JSON.stringify(_categories));
const componentSet: Map<string, Component> = new Map(Object.entries(_figmaDoc.componentSets));
const _manifest = generateIconManifest(_categories, componentSet, outputDir);
writeFileSync("./test/test-data/manifest.json", JSON.stringify(Object.fromEntries(_manifest)));
const _allImageFiles = await getImageFiles(_manifest, figmaFileId, figmaToken);
writeFileSync("./test/test-data/allImageFiles.json", JSON.stringify(Object.fromEntries(_allImageFiles)));
const newHash = generateHash(_allImageFiles);
writeFileSync("./test/test-data/hash.txt", newHash);
const generatedFontResponse = await generateFonts(outputDir + "/temp", outputDir);
writeFileSync("./test/test-data/generatedFontResponse.json", JSON.stringify(generatedFontResponse));
console.log("Values updated");
