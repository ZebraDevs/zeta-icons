import { createFolder, writeSVGToFile } from "./fileUtils.js";
import { ImageDefinition, ImageManifest } from "../fetch-icons/types/customTypes.js";

/**
 * Saves svg files within icons object to `{category}/{icon-name}.svg`.
 *
 * @param {ImageManifest} icons - Categorized `ImageDefinition`s.
 * @param {string} iconsOutputDir - Directory to place icons in. Will create categories within this.
 * @param {string[]} categoryNames - Array of all category names; used to create directories.
 * @returns {Promise<void>} Promise resolves when SVGs have been saved.
 */
export const saveSVGs = async (
  icons: ImageManifest,
  iconsOutputDir: string,
  categoryNames: string[]
): Promise<void> => {
  createFolder(iconsOutputDir);

  for (const category of categoryNames) {
    const dir = `${iconsOutputDir}/${category}`;
    createFolder(dir);
  }

  const promises: Promise<void>[] = [];
  icons.forEach(async (icon: ImageDefinition) => {
    promises.push(writeSVGToFile(icon.roundData, icon.roundPath));
    promises.push(writeSVGToFile(icon.sharpData, icon.sharpPath));
  });

  await Promise.all(promises);
};
