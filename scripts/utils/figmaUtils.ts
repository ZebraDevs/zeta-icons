import { ComponentSets, FigmaNode } from "../types/figmaTypes.js";
import { toSnakeCase } from "./fileUtils.js";

const IGNORED_ICONSETS = ["dna", "internal use only"];

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
  const iconsPage = iconPage.children.find((page) => page.name.toLowerCase() === "icons");
  if (!iconsPage) {
    throw new Error("❌ Icons page not found in the document.");
  }
  return iconsPage.children.filter((child) => {
    return child.type == "FRAME" && !IGNORED_ICONSETS.includes(child.name.toLowerCase());
  }) as FigmaNode[];
}

/**
 * Extracts all icon sets from a category by looking for nodes of type `COMPONENT_SET`.
 *
 * @param {FigmaNode} categoryNode - The category to extract from.
 * @returns {FigmaNode[]} A list of icon sets found from the given category node.
 */
export function extractIconSets(categoryNode: FigmaNode): FigmaNode[] {
  const foundNode = categoryNode.children.find((child) => child.name === categoryNode.name);
  if (!foundNode) {
    throw new Error(`❌ Cannot find matching node for category name ${categoryNode.name}`);
  }
  return foundNode.children.filter((child) => child.type == "COMPONENT_SET") as FigmaNode[];
}

/**
 * Gets a list of search terms for a given icon set.
 *
 * @param {string} iconSetId - id of the icon set.
 * @param {ComponentSets} componentSets - map of all component sets from the Figma document.
 * @returns {string[]} The search terms as a list of strings.
 */
export function getSearchTerms(iconSetId: string, componentSets: ComponentSets): string[] {
  const iconComponentSet = componentSets.get(iconSetId);

  if (!iconComponentSet) return [];
  return iconComponentSet.description.split(", ") ?? "";
}

/**
 * Extracts a list of category names from a given list of category nodes
 *
 * @param categoryNodes - List of FigmaNodes for the names to be extracted from.
 * @returns A list of the category names in snake_case
 */
export function extractCategoryNames(categoryNodes: FigmaNode[]): string[] {
  return categoryNodes.map((category) => toSnakeCase(category.name));
}

export function checkFigmaTokenIsSet(figmaToken: string | undefined): void {
  if (!figmaToken || figmaToken == "") {
    throw new Error(
      '❌ Figma Token is not set. Set the Figma token by creating an `.env` file with its contents `FIGMA_ACCESS_TOKEN="..."`',
    );
  }
}
