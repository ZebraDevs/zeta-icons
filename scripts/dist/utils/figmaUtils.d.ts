import { ComponentSets, FigmaNode } from "../types/figmaTypes.js";
/**
 * Locates the relevant icon page from a Figma document.
 *
 * @param {FigmaNode} document The Figma document to be searched.
 * @returns {FigmaNode} a `FigmaNode` containing the icons page.
 */
export declare function findIconPage(document: FigmaNode, iconPageName: string): FigmaNode;
/**
 * Extracts all nodes from a page which represent categories by looking for nodes of type `FRAME`.
 *
 * @param {FigmaNode} iconPage -  The page to search.
 * @returns {FigmaNode[]} A list of `FigmaNode`s representing categories.
 */
export declare function extractCategoryNodes(iconPage: FigmaNode): FigmaNode[];
/**
 * Extracts all icon sets from a category by looking for nodes of type `COMPONENT_SET`.
 *
 * @param {FigmaNode} categoryNode - The category to extract from.
 * @returns {FigmaNode[]} A list of icon sets found from the given category node.
 */
export declare function extractIconSets(categoryNode: FigmaNode): FigmaNode[];
/**
 * Gets a list of search terms for a given icon set.
 *
 * @param {string} iconSetId The id of the icon set.
 * @param {ComponentSets} componentSets The map of all component sets from the Figma document.
 * @returns {string[]} The search terms as a list of strings.
 */
export declare function getSearchTerms(iconSetId: string, componentSets: ComponentSets): string[];
