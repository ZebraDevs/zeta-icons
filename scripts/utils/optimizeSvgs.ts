import { createFolder } from "./fileUtils.js";
import SVGFixer from "oslllo-svg-fixer";

/**
 * Optimizes SVG files using {@link https://github.com/oslllo/svg-fixer | oslllo-svg-fixer}.
 *
 * SVGs that are optimized are re-drawn with just `paths`, removing `clip-path` and
 * other attributes, as these do not play nicely with icon-fonts.
 *
 * @param {string} iconsOutputDir - Directory icons are saved in.
 * @param {string} tempOutputDir - Directory to save optimized files in temporarily.
 */
export const optimizeSVGs = async (
  iconsOutputDir: string,
  tempOutputDir: string,
  categories: string[]
): Promise<void> => {
  createFolder(tempOutputDir);
  await Promise.all(
    categories.map((category) => {
      console.log(`Optimizing icons from ${category}`);
      return SVGFixer(`${iconsOutputDir}/${category}`, tempOutputDir).fix();
    })
  );
};
