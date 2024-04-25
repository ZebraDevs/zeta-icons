import { FontType } from "../types/customTypes.js";
/**
 * Creates a directory recursively; creating intermediate directories if needed.
 *
 * @param {string} dir - Directory to create.
 */
export declare const createFolder: (dir: string) => void;
/**
 * Returns the icon name formatted in snake_case.
 *
 * Used for file names and dart icon names.
 *
 * @param {string} iconName - Unformatted name of icon.
 * @param {FontType} type - Round or sharp.
 * @returns {string} Icon name in snake_case.
 */
export declare const getIconFileName: (iconName: string, type: FontType) => string;
/**
 * Recursively deletes all children of `dir`, and then places an empty directory in its place.
 *
 * @param {string} dir - directory to clear.
 */
export declare const clearDirectory: (dir: string) => Promise<void>;
/**
 * Writes an svg file and increases the scale 50x to avoid rounding errors.
 *
 * @param {string} svg - Contents of SVG to save.
 * @param {string} filePath - Location to save SVG. Should include full file path, name and extension.
 */
export declare const writeSVGToFile: (svg: string, filePath: string) => Promise<void>;
