import { ImageManifest } from "../types/customTypes.js";
/**
 * Saves svg files within icons object to `{category}/{icon-name}.svg`.
 *
 * @param {ImageManifest} icons - Categorized `ImageDefinition`s.
 * @param {string} iconsOutputDir - Directory to place icons in. Will create categories within this.
 * @param {string[]} categoryNames - Array of all category names; used to create directories.
 * @returns {Promise<void>} Promise resolves when SVGs have been saved.
 */
export declare const saveSVGs: (icons: ImageManifest, iconsOutputDir: string, categoryNames: string[]) => Promise<void>;
