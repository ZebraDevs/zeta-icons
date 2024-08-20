import { rmSync, rmdirSync, writeFileSync } from "fs";
import * as dotenv from "dotenv";
import { getFigmaDocument, getImageFiles } from "../scripts/utils/api.js";
import {
  testDartOutputDir,
  testFileId,
  testIconPageName,
  testIconsOutputDir,
  testOutputDir,
  testTSOutputDir,
} from "./data/constants.js";
import {
  extractCategoryNames,
  extractCategoryNodes,
  extractIconSets,
  findIconPage,
} from "../scripts/utils/figmaUtils.js";
import { generateIconManifest } from "../scripts/generators/generateIconManifest.js";
import { ComponentSets } from "../scripts/types/figmaTypes.js";
import { generateFonts } from "../scripts/generators/generateFonts.js";
import { saveSVGs } from "../scripts/utils/saveSvgs.js";
import { optimizeSVGs } from "../scripts/utils/optimizeSvgs.js";

async function main() {
  const tempOutputDir = `${testOutputDir}/temp`;
  dotenv.config({
    path: ".env.test.local",
  });

  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

  if (process.env.FIGMA_ACCESS_TOKEN != undefined) {
    const response = await getFigmaDocument(testFileId, process.env.FIGMA_ACCESS_TOKEN);
    writeFile(response, "documentResponse.json");
    writeFile(response.componentSets, "componentSets.json");

    const componentSet: ComponentSets = new Map(Object.entries(response.componentSets));

    const iconPage = findIconPage(response.document, testIconPageName);
    writeFile(iconPage, "iconsPage.json");

    const categories = extractCategoryNodes(iconPage);
    writeFile(categories, "categoryNodes.json");

    writeFile(categories[0], "singleCategoryNode.json");

    const iconNodes = extractIconSets(categories[0]);
    writeFile(iconNodes, "iconNodes.json");

    const manifest = generateIconManifest(categories, componentSet, testIconsOutputDir, true);
    writeFile(Object.fromEntries(manifest), "manifest.json");

    const allImageFiles = await getImageFiles(manifest, testFileId, process.env.FIGMA_ACCESS_TOKEN);
    writeFile(Object.fromEntries(allImageFiles), "allImageFiles.json");

    /// Create simple array of category names
    const categoryNames = extractCategoryNames(categories);

    await saveSVGs(allImageFiles, testIconsOutputDir, categoryNames);
    console.log("✅ - Saved new SVGs");

    await optimizeSVGs(testIconsOutputDir, tempOutputDir, categoryNames);
    console.log("✅ - Optimized SVGs");

    const generateFontResult = await generateFonts(tempOutputDir, "zeta-icons", testDartOutputDir, testTSOutputDir);
    writeFile(generateFontResult, "generatedFontResponse.json");

    rmSync(testOutputDir, { recursive: true });
  } else {
    throw new Error("FIGMA_ACCESS_TOKEN is not defined");
  }
}

function writeFile(contents: Object, name: string) {
  writeFileSync(`./test/data/${name}`, JSON.stringify(contents));
}

main();
