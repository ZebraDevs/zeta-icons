import { mkdirSync, existsSync, rmSync, writeFileSync } from "fs";
import * as path from "path";
import { scale } from "scale-that-svg";
import { FontType } from "../types/customTypes.js";

/**
 * Creates a directory recursively; creating intermediate directories if needed.
 *
 * @param {string} dir - Directory to create.
 * @returns true if the directory is created.
 */
export const createFolder = (dir: string): boolean => {
  dir = path.normalize(dir);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    return true;
  }
  return false;
};

/**
 * Returns the icon name formatted in snake_case.
 *
 * Used for file names and dart icon names.
 *
 * @param {string} iconName - Unformatted name of icon.
 * @param {FontType} type - Round or sharp.
 * @returns {string} Icon name in snake_case.
 */
export const getIconFileName = (iconName: string, type: FontType): string => `${toSnakeCase(iconName)}_${type}`;

/**
 * Formats string in snake_case.
 *
 * @param {string} separator - Character used as word separator in string. Defaults to ` ` (space).
 */
export const toSnakeCase = function (string: string, separator: string = " "): string {
  return `${string.toLowerCase().replaceAll(separator, "_")}`;
};

/**
 * Capitalizes first letter of a string.
 */
String.prototype.capitalize = function (): string {
  return `${this[0].toUpperCase()}${this.slice(1)}`;
};

/**
 * Recursively deletes all children of `dir`, and then places an empty directory in its place.
 *
 * @param {string} dir - directory to clear.
 */
export const clearDirectory = async (dir: string) => {
  dir = path.normalize(dir);

  rmSync(path.normalize(dir), { recursive: true, force: true });

  createFolder(dir);
};

/**
 * Writes an svg file and increases the scale 50x to avoid rounding errors.
 *
 * @param {string} svg - Contents of SVG to save.
 * @param {string} filePath - Location to save SVG. Should include full file path, name and extension.
 */
export const writeSVGToFile = async (svg: string, filePath: string): Promise<void> => {
  svg = await scale(svg, { scale: 50 });

  writeFileSync(filePath, svg);
};
