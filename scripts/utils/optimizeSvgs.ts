import { execSync } from "child_process";
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
  categories: string[],
): Promise<void> => {
  createFolder(tempOutputDir);
  await Promise.all(
    categories.map((category) => {
      try {
        const safeCategory = category.replace(/[^a-zA-Z0-9-_]/g, "");
        execSync(`npx svgo -f ${iconsOutputDir}/${safeCategory}`);
        return SVGFixer(`${iconsOutputDir}/${safeCategory}`, tempOutputDir).fix();
      } catch (e) {
        console.error(`Error optimizing icons from ${category}: ${e}`);
      }
    }),
  );
};
