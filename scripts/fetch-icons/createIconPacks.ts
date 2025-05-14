import { generateDefinitionFiles } from "./generators/generateDefinitionFiles.js";
import { generateFonts } from "./generators/generateFonts.js";
import { generatePNGs } from "./generators/generatePNGs.js";
import { generateAndroidIcons } from "./generators/generateAndroidIcons.js";
import iconManifestJson from "../../outputs/icon-manifest.json" with { type: "json" };
import { readdirSync, statSync } from "fs";
import { join } from "path";
import { IconManifest } from "../../types.js";
import { clearDirectory } from "../utils/fileUtils.js";

export const iconsDir = "/icons";
export const tempDir = "/temp";
export const pngDir = "/png";
export const flutterDir = "/flutter";
export const webDir = "/web";
export const androidDir = "/android";

const getCategoryNames = (iconsOutputDir: string): string[] => {
  const entries = readdirSync(iconsOutputDir);
  return entries.filter((entry) => {
    const fullPath = join(iconsOutputDir, entry);
    return statSync(fullPath).isDirectory();
  });
};

/**
 * Main function to run icons action. For slightly more information, see {@link https://miro.com/app/board/uXjVKUMv1ME=/?share_link_id=952145602435 | Miro }
 *
 * @param {string} outputDir - Directory to (potentially) save icons to.
 */
export default async function main(outputDir: string): Promise<void> {
  const iconsOutputDir = outputDir + iconsDir;
  const tempOutputDir = outputDir + tempDir;
  const pngOutputDir = outputDir + pngDir;
  const dartOutputDir = outputDir + flutterDir;
  const tsOutputDir = outputDir + webDir;
  const androidOutputDir = outputDir + androidDir;

  await clearDirectory(pngOutputDir);
  await clearDirectory(dartOutputDir);
  await clearDirectory(tsOutputDir);
  // await clearDirectory(androidOutputDir);

  const categoryNames = getCategoryNames(iconsOutputDir);
  console.log("✅ - Extracted categories");

  const generateFontResult = await generateFonts(tempOutputDir, "zeta-icons", dartOutputDir + "/assets", tsOutputDir);
  console.log("✅ - Generated fonts");

  const manifest = new Map(Object.entries(iconManifestJson)) as IconManifest;

  // generateAndroidIcons(androidOutputDir, manifest);
  // console.log("✅ - Generated Android icons.");

  generateDefinitionFiles(outputDir, generateFontResult, manifest);
  console.log("✅ - Generated definition files.");

  await generatePNGs(iconsOutputDir, pngOutputDir, categoryNames);
  console.log("✅ - Generated PNGs.");

  console.log("✅ - Done - Icons updated!");
}

main("outputs");
