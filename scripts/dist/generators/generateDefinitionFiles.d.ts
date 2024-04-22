import { GenerateFontResult, IconManifest } from "../types/customTypes.js";
/**
 * Writes out `icon-manifest.json`, `icons.dart` and `icon-types.ts`.
 *
 * @param {String} outputDir - Location of output directory. Icon manifest is saved here.
 * @param {String} definitionsOutputDir - Location of definitions output.
 * @param {GenerateFontResult} fontData - Object containing body lines for generating definition files.
 */
export declare const generateDefinitionFiles: (outputDir: string, definitionsOutputDir: string, fontData: GenerateFontResult, manifest: IconManifest) => void;
