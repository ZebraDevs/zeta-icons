import { assert } from "chai";
import { ComponentSets } from "../../scripts/types/figmaTypes.js";
import {
  extractCategoryNames,
  extractCategoryNodes,
  extractIconSets,
  findIconPage,
  getSearchTerms,
} from "../../scripts/utils/figmaUtils.js";
import {
  categoryNames,
  categoryNodes,
  componentSets,
  figmaDoc,
  iconNodes,
  iconPage,
  singleCategoryNode,
} from "../data/index.js";

describe("figmaUtils", () => {
  describe("findIconPage", () => {
    it("should find the correct page with the given page name", () => {
      const iconPageName = "Icons";
      const result = findIconPage(figmaDoc.document, iconPageName);

      assert.deepEqual(result, iconPage);
    });

    it("should throw an error if the page cannot be found", () => {
      const iconPageName = "Incorrect page name";

      assert.throw(() => findIconPage(figmaDoc.document, iconPageName), Error);
    });
  });

  describe("extractCategories", () => {
    it("should extract the correct list of category nodes from the given icon page", () => {
      const result = extractCategoryNodes(iconPage);

      assert.deepEqual(result, categoryNodes);
    });
  });

  describe("extractIconSets", () => {
    it("should extract the correct list of icon set nodes from a given category node", () => {
      const result = extractIconSets(singleCategoryNode);

      assert.deepEqual(result, iconNodes);
    });
  });

  describe("getSearchTerms", () => {
    it("should return the correct list of search terms for a given icon id and componentSets object", () => {
      const iconId = "176:5662";
      const searchTerms = ["Plus", "add", "create", "request"];

      const result = getSearchTerms(iconId, componentSets);

      assert.deepEqual(result, searchTerms);
    });
  });

  describe("extractCategoryNames", () => {
    it("should return the correct list of category names", () => {
      const result = extractCategoryNames(categoryNodes);

      assert.deepEqual(result, categoryNames);
    });
  });
});
