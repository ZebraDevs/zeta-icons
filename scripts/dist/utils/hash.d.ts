import { ImageManifest } from "../types/customTypes.js";
/**
 * Applies md5 hash to a Map.
 *
 * Function is designed to work with `ImageManifest`, as it converts the map to an object to a string,
 * but could easily be extended to work with other objects.
 *
 * @param {ImageManifest} objToHash - the image manifest to hash.
 * @returns {string} md5 hash generated from converting `objToHash` into a string.
 */
export declare const generateHash: (objToHash: ImageManifest) => string;
