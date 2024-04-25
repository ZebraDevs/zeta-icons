/**
 * Optimizes SVG files using {@link https://github.com/oslllo/svg-fixer | oslllo-svg-fixer}.
 *
 * SVGs that are optimized are re-drawn with just `paths`, removing `clip-path` and
 * other attributes, as these do not play nicely with icon-fonts.
 *
 * @param {string} iconsOutputDir - Directory icons are saved in.
 * @param {string} tempOutputDir - Directory to save optimized files in temporarily.
 */
export declare const optimizeSVGs: (iconsOutputDir: string, tempOutputDir: string, categories: string[]) => Promise<void>;