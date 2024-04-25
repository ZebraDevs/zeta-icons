import { IconManifest } from "../types/customTypes.js";
import { ComponentSets, FigmaNode } from "../types/figmaTypes.js";
/**
 * Generates an icon manifest from a list of category nodes.
 *
 * @param {FigmaNode[]} categoryNodes The given list of category nodes.
 * @param {ComponentSets} componentSets The component set map from the Figma document. Used to fetch search terms for each icon.
 * @param {string} fontOutputDir The directory that the icons should be saved to. Icon paths are generated using the pattern `[categoryName]/[icon]`
 * @param {boolean} verboseLogs Logs more verbose outputs for testing.
 *
 * @returns {IconManifest} An icon manifest object.
 * @throws If any category name has an error of `ErrorSeverity.high`.
 */
export declare function generateIconManifest(categoryNodes: FigmaNode[], componentSets: ComponentSets, fontOutputDir: string, verboseLogs: boolean): IconManifest;
