import { generateIconManifest } from "./generators/generateIconManifest.js";
import { ComponentSets } from "../types/figmaTypes.js";
import { getFigmaDocument, getImageFiles } from "../utils/api.js";
import { findIconPage, extractCategoryNodes, extractCategoryNames } from "../utils/figmaUtils.js";
import { clearDirectory } from "../utils/fileUtils.js";
import { generateHash } from "../utils/hash.js";
import { optimizeSVGs } from "../utils/optimizeSvgs.js";
import { saveSVGs } from "../utils/saveSvgs.js";
import { writeFileSync } from "fs";
import { ZDS_ASSETS_FILE_ID, ZDS_ASSETS_ICON_PAGE_NAME } from "../../figmaConfig.js";

export const iconsDir = "/icons";
export const tempDir = "/temp";

/**
 * Main function to run icons action. For slightly more information, see {@link https://miro.com/app/board/uXjVKUMv1ME=/?share_link_id=952145602435 | Miro }
 *
 * @param {string} figmaToken - Figma authentication token. See {@link https://www.figma.com/developers/api#authentication | Figma API documentation}.
 * @param {string} figmaFileId - Figma file ID to retrieve icons from.
 * @param {string} iconPageName - The name of the icon page from the given Figma file that the icons will be extracted from.
 * @param {string} oldHash - Hash of icons from cache.
 * @param {string} outputDir - Directory to (potentially) save icons to.

 *
 * @returns {string | undefined} Hash of updated icons. If undefined, icons have not changed.
 */
export default async function main(
  figmaToken: string,
  figmaFileId: string,
  iconPageName: string,

  outputDir: string,
): Promise<string | undefined> {
  const iconsOutputDir = outputDir + iconsDir;
  const tempOutputDir = outputDir + tempDir;

  const response = await getFigmaDocument(figmaFileId, figmaToken);
  console.log("✅ - Fetched figma document");

  const componentSet: ComponentSets = new Map(Object.entries(response.componentSets));

  const iconPage = findIconPage(response.document, iconPageName);
  console.log("✅ - Found icon page");

  const categories = extractCategoryNodes(iconPage);
  console.log("✅ - Extracted categories");

  const manifest = generateIconManifest(categories, componentSet, iconsOutputDir, false);
  console.log("✅ - Generated icon manifest");

  const allImageFiles = await getImageFiles(manifest, figmaFileId, figmaToken);
  console.log("✅ - Fetched image files");

  const newHash = generateHash(allImageFiles);
  console.log("✅ - Generated new hash");

  await clearDirectory(outputDir);
  console.log("✅ - Deleted old files");

  /// Create simple array of category names
  const categoryNames = extractCategoryNames(categories);

  await saveSVGs(allImageFiles, iconsOutputDir, categoryNames);
  console.log("✅ - Saved new SVGs");

  await optimizeSVGs(iconsOutputDir, tempOutputDir, categoryNames);
  console.log("✅ - Optimized SVGs");

  writeFileSync(outputDir + "/icon-manifest.json", JSON.stringify(Object.fromEntries(manifest)));
  console.log("✅ - Saved icon manifest");

  console.log("✅ - Done - Icon SVGs updated!");

  return newHash;
}

main(process.env.FIGMA_ACCESS_TOKEN ?? "", ZDS_ASSETS_FILE_ID, ZDS_ASSETS_ICON_PAGE_NAME, "outputs");
