import { readFileSync } from "fs";
import { IconManifest, ImageManifest, GenerateFontResult } from "../../scripts/types/customTypes.js";
import { DocumentResponse, FigmaNode, ComponentSets } from "../../scripts/types/figmaTypes.js";
import { extractCategoryNames } from "../../scripts/utils/figmaUtils.js";

export const outputDir = "./test/outputs";

export const figmaDoc: DocumentResponse = JSON.parse(readFileSync("./test/data/documentResponse.json").toString());
export const iconPage: FigmaNode = JSON.parse(readFileSync("./test/data/iconsPage.json").toString());
export const categoryNodes: FigmaNode[] = JSON.parse(readFileSync("./test/data/categoryNodes.json").toString());
export const singleCategoryNode: FigmaNode = JSON.parse(readFileSync("./test/data/singleCategoryNode.json").toString());
export const iconNodes: FigmaNode[] = JSON.parse(readFileSync("./test/data/iconNodes.json").toString());
export const componentSets: ComponentSets = new Map(
  Object.entries(JSON.parse(readFileSync("./test/data/componentSets.json").toString())),
);

export const manifest: IconManifest = new Map(
  Object.entries(JSON.parse(readFileSync("./test/data/manifest.json").toString())),
);
export const allImageFiles: ImageManifest = new Map(
  Object.entries(JSON.parse(readFileSync("./test/data/allImageFiles.json").toString())),
);
export const hash = readFileSync("./test/data/hash.txt").toString();
export const categoryNames = extractCategoryNames(categoryNodes);
export const generatedFontDefinitions: GenerateFontResult = JSON.parse(
  readFileSync("./test/data/generatedFontResponse.json").toString(),
);
