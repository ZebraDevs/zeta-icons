import sharp from "sharp";
import { readdirSync } from "fs";
import { createFolder } from "../../utils/fileUtils.js";

/**
 * Builds and saves PNG versions of all icons.
 * @param {string} inputDir - Location of SVG files.
 * @param {string} outputDir - Location to save PNG files
 * @param {string[]} categories  - List of all icon categories.
 */
export const generatePNGs = async (inputDir: string, outputDir: string, categories: string[]) => {
  createFolder(outputDir);

  for (const cat of categories) {
    const svgDirs = readdirSync(inputDir + "/" + cat);

    for (const svg of svgDirs) {
      const split = svg.split("/");
      const name = split.pop()?.slice(0, -3);
      await sharp(inputDir + "/" + cat + "/" + svg)
        .resize(512)
        .modulate({ lightness: 43 })
        .png()
        .toFile(outputDir + "/" + name + "png");
    }
  }
};
