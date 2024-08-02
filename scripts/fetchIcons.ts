import { getFigmaDocument, getImageFiles } from "./utils/api.js";
import { extractCategoryNames, extractCategoryNodes, findIconPage } from "./utils/figmaUtils.js";
import { clearDirectory } from "./utils/fileUtils.js";
import { generateDefinitionFiles } from "./generators/generateDefinitionFiles.js";
import { generateFonts } from "./generators/generateFonts.js";
import { generateIconManifest } from "./generators/generateIconManifest.js";
import { optimizeSVGs } from "./utils/optimizeSvgs.js";
import { saveSVGs } from "./utils/saveSvgs.js";
import { generateHash } from "./utils/hash.js";
import { ComponentSets } from "./types/figmaTypes.js";
import { generatePNGs } from "./generators/generatePNGs.js";

export const iconsDir = "/icons";
export const tempDir = "/temp";
export const pngDir = "/png";
export const dartDir = "/dart";
export const tsDir = "/ts";

/**
 * Main function to run icons action. For slightly more information, see {@link https://miro.com/app/board/uXjVKUMv1ME=/?share_link_id=952145602435 | Miro }
 *
 * @param {string} figmaToken - Figma authentication token. See {@link https://www.figma.com/developers/api#authentication | Figma API documentation}.
 * @param {string} figmaFileId - Figma file ID to retrieve icons from.
 * @param {string} iconPageName - The name of the icon page from the given Figma file that the icons will be extracted from.
 * @param {string} oldHash - Hash of icons from cache.
 * @param {string} outputDir - Directory to (potentially) save icons to.
 * @param {boolean} verboseLogs - Logs more verbose outputs for testing.
 *
 * @returns {string | undefined} Hash of updated icons. If undefined, icons have not changed.
 */
export default async function main(
  figmaToken: string,
  figmaFileId: string,
  iconPageName: string,
  oldHash: string,
  outputDir: string,
  verboseLogs: boolean
): Promise<string | undefined> {
  const iconsOutputDir = outputDir + iconsDir;
  const tempOutputDir = outputDir + tempDir;
  const pngOutputDir = outputDir + pngDir;
  const dartOutputDir = outputDir + dartDir;
  const tsOutputDir = outputDir + tsDir;

  const response = await getFigmaDocument(figmaFileId, figmaToken);
  console.log("✅ - Fetched figma document");

  const componentSet: ComponentSets = new Map(Object.entries(response.componentSets));

  const iconPage = findIconPage(response.document, iconPageName);
  console.log("✅ - Found icon page");

  const categories = extractCategoryNodes(iconPage);
  console.log("✅ - Extracted categories");

  const manifest = generateIconManifest(categories, componentSet, iconsOutputDir, verboseLogs);
  console.log("✅ - Generated icon manifest");

  const allImageFiles = await getImageFiles(manifest, figmaFileId, figmaToken);
  console.log("✅ - Fetched image files");

  const newHash = generateHash(allImageFiles);
  console.log("✅ - Generated new hash");

  /// Compare old hash from cache to new hash generated.
  const isChanged = oldHash !== newHash;

  console.log("\n\n👀 - Icons have" + (isChanged ? "" : " not") + " changed.\n\n");
  if (!isChanged) return;

  await clearDirectory(outputDir);
  console.log("✅ - Deleted old files");

  /// Create simple array of category names
  const categoryNames = extractCategoryNames(categories);

  await saveSVGs(allImageFiles, iconsOutputDir, categoryNames);
  console.log("✅ - Saved new SVGs");

  await optimizeSVGs(iconsOutputDir, tempOutputDir, categoryNames);
  console.log("✅ - Optimized SVGs");

  const generateFontResult = await generateFonts(tempOutputDir, "zeta-icons", dartOutputDir, tsOutputDir);
  console.log("✅ - Generated fonts");

  generateDefinitionFiles(outputDir, generateFontResult, manifest);
  console.log("✅ - Generated definition files.");

  generatePNGs(iconsOutputDir, pngOutputDir, categoryNames);
  console.log("✅ - Generated PNGs.");

  console.log("✅ - Done - Icons updated!");

  return newHash;
}
