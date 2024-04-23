import { IconManifest, ImageManifest } from "../scripts/src/types/customTypes.js";
import { readFileSync } from "fs";
import { DocumentResponse, FigmaNode } from "../scripts/src/types/figmaTypes.js";

export const testFigmaFileId = "oIiGXVNKX4KjppcGxOEbZa";
export const zdsAssetsfigmaFileId = "VQ7Aa3rDYB7mgpToI3bZ4D";
export const figmaToken = ""; //TODO: populate before testing.
export const outputDir = "./test/outputs";

export const figmaDoc: DocumentResponse = JSON.parse(readFileSync("./test/test-data/figmaDoc.json").toString());
export const iconPage: FigmaNode = JSON.parse(readFileSync("./test/test-data/iconsPage.json").toString());
export const categories: FigmaNode[] = JSON.parse(readFileSync("./test/test-data/categories.json").toString());
export const manifest: IconManifest = new Map(
  Object.entries(JSON.parse(readFileSync("./test/test-data/manifest.json").toString()))
);
export const allImageFiles: ImageManifest = new Map(
  Object.entries(JSON.parse(readFileSync("./test/test-data/allImageFiles.json").toString()))
);
export const hash = readFileSync("./test/test-data/hash.txt").toString();
//@ts-ignore
export const categoryNames = categories.map((category) => category.name.toSnakeCase());
export const generatedFontDefinitions = JSON.parse(
  readFileSync("./test/test-data/generatedFontResponse.json").toString()
);