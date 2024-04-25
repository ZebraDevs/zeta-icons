import { ComponentSets, FigmaNode } from "../types/figmaTypes.js";

/**
 * Locates the relevant icon page from a Figma document.
 *
 * @param {FigmaNode} document The Figma document to be searched.
 * @param iconPageName The name of the icon page to be located.
 *
 * @returns {FigmaNode} A `FigmaNode` containing the icons page.
 * @throws An error if the given page name cannot be found from the document.
 */
export function findIconPage(document: FigmaNode, iconPageName: string): FigmaNode {
  const iconPage = document.children.filter((page) => page.name == iconPageName)[0];
  if (iconPage == undefined) {
    throw new Error(`❌ Cannot find icons page for page name ${iconPageName}`);
  }
  return iconPage;
}

/**
 * Extracts all nodes from a page which represent categories by looking for nodes of type `FRAME`.
 *
 * @param {FigmaNode} iconPage -  The page to search.
 * @returns {FigmaNode[]} A list of `FigmaNode`s representing categories.
 */
export function extractCategoryNodes(iconPage: FigmaNode): FigmaNode[] {
  return iconPage.children.filter((child) => child.type == "FRAME") as FigmaNode[];
}

/**
 * Extracts all icon sets from a category by looking for nodes of type `COMPONENT_SET`.
 *
 * @param {FigmaNode} categoryNode - The category to extract from.
 * @returns {FigmaNode[]} A list of icon sets found from the given category node.
 */
export function extractIconSets(categoryNode: FigmaNode): FigmaNode[] {
  return categoryNode.children.filter((child) => child.type == "COMPONENT_SET") as FigmaNode[];
}

/**
 * Gets a list of search terms for a given icon set.
 *
 * @param {string} iconSetId The id of the icon set.
 * @param {ComponentSets} componentSets The map of all component sets from the Figma document.
 * @returns {string[]} The search terms as a list of strings.
 */
export function getSearchTerms(iconSetId: string, componentSets: ComponentSets): string[] {
  const iconComponentSet = componentSets.get(iconSetId);

  if (!iconComponentSet) return [];
  return iconComponentSet.description.split(", ") ?? "";
}
