import { ImageManifest, IconManifest } from "../types/customTypes.js";
import { DocumentResponse } from "../types/figmaTypes.js";
/**
 * Fetches a Figma document.
 *
 * @param {string} fileID - The ID of the Figma file.
 * @param {string} accessToken - The token used to access Figma.
 * @returns {DocumentResponse}
 * @throws A network error if the request fails.
 */
export declare function getFigmaDocument(fileID: string, accessToken: string): Promise<DocumentResponse>;
/**
 * Fetches all the images of the icons in `manifest` using the roundId and sharpId of each icon.
 *
 * @param {IconManifest} manifest - The manifest of all the icons to be fetched.
 * @param {string} fileID - The ID of the Figma file.
 * @param {string} accessToken - The token used to access Figma.
 * @returns {ImageManifest} A copy of `manifest` containing the contents of the image files for each icon saved under `roundData` and `sharpData`.
 * @throws A network error if the request fails.
 */
export declare function getImageFiles(manifest: IconManifest, fileID: string, accessToken: string): Promise<ImageManifest>;
