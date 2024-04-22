import { GenerateFontResult } from "../types/customTypes.js";
/**
 * Generates font files from optimized SVGs.
 *
 * This function returns data needed to create Dart / TS output files,
 * as this data needs to link up to unicode values generated in this step.
 *
 * @param {string} inputDir - Location of temporary directory containing optimized SVG files.
 * @param {String} fontOutputDir - Location of font output directory.
 * @returns {Promise<GenerateFontResult>} Object containing body lines for generating definition files.
 * @throws If any font file was not generated.
 */
export declare const generateFonts: (inputDir: string, fontOutputDir: string) => Promise<GenerateFontResult>;
