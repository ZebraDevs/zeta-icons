import { getFigmaDocument, getImageFiles } from "./utils/api.js";
import { extractCategoryNodes, findIconPage } from "./utils/figmaUtils.js";
import { clearDirectory } from "./utils/fileUtils.js";
import { generateDefinitionFiles } from "./generators/generateDefinitionFiles.js";
import { generateFonts } from "./generators/generateFonts.js";
import { generateIconManifest } from "./generators/generateIconManifest.js";
import { optimizeSVGs } from "./utils/optmizeSvgs.js";
import { saveSVGs } from "./utils/saveSvgs.js";
import { generateHash } from "./utils/hash.js";
const fontDir = "/font";
const iconsDir = "/icons";
const definitionsDir = "/definitions";
const tempDir = "/temp";
/**
 * Main function to run icons action. For slightly more information, see {@link https://miro.com/app/board/uXjVKUMv1ME=/?share_link_id=952145602435 | Miro }
 *
 * @param {string} figmaToken - Figma authentication token. See {@link https://www.figma.com/developers/api#authentication | Figma API documentation}.
 * @param {string} figmaFileId - Figma file ID to retrieve icons from.
 * @param {string} oldHash - Hash of icons from cache.
 * @param {string} outputDir - Directory to (potentially) save icons to.
 * @returns {string | undefined} Hash of updated icons. If undefined, icons have not changed.
 */
export default async function main(figmaToken, figmaFileId, iconPageName, oldHash, outputDir, verboseLogs) {
    const fontOutputDir = outputDir + fontDir;
    const iconsOutputDir = outputDir + iconsDir;
    const definitionsOutputDir = outputDir + definitionsDir;
    const tempOutputDir = outputDir + tempDir;
    const response = await getFigmaDocument(figmaFileId, figmaToken);
    console.log("✅ - Fetched figma document");
    const componentSet = new Map(Object.entries(response.componentSets));
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
    if (!isChanged)
        return;
    await clearDirectory(outputDir);
    console.log("✅ - Deleted old files");
    /// Create simple array of category names
    const categoryNames = categories.map((category) => category.name.toSnakeCase());
    await saveSVGs(allImageFiles, iconsOutputDir, categoryNames);
    console.log("✅ - Saved new SVGs");
    await optimizeSVGs(iconsOutputDir, tempOutputDir, categoryNames);
    console.log("✅ - Optimized SVGs");
    const generateFontResult = await generateFonts(tempOutputDir, fontOutputDir);
    console.log("✅ - Generated fonts");
    generateDefinitionFiles(outputDir, definitionsOutputDir, generateFontResult, manifest);
    console.log("✅ - Generated definition files.");
    console.log("✅ - Done - Icons updated!");
    return newHash;
}
