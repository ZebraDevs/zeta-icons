import {
  ErrorSeverity,
  RenameErrorType,
  validateCategoryName,
  validateIcon,
  ZetaIconNameError,
} from "@zebra-fed/zeta-icon-validator";
import { extractIconSets, getSearchTerms } from "../../utils/figmaUtils.js";
import { IconManifest } from "../../../types.js";
import { getIconFileName, toSnakeCase } from "../../utils/fileUtils.js";
import { ComponentSets, FigmaNode } from "../../types/figmaTypes.js";

/**
 * Generates an icon manifest from a list of category nodes.
 *
 * @param {FigmaNode[]} categoryNodes The given list of category nodes.
 * @param {ComponentSets} componentSets The component set map from the Figma document. Used to fetch search terms for each icon.
 * @param {string} iconOutputDir The directory that the icons should be saved to. Icon paths are generated using the pattern `[categoryName]/[icon]`
 * @param {boolean} verboseLogs Logs more verbose outputs for testing.
 *
 * @returns {IconManifest} An icon manifest object.
 * @throws If any category name has an error of `ErrorSeverity.high`.
 */
export function generateIconManifest(
  categoryNodes: FigmaNode[],
  componentSets: ComponentSets,
  iconOutputDir: string,
  verboseLogs: boolean,
): IconManifest {
  const iconMap: IconManifest = new Map();

  const usedIconNames: string[] = []; // A list of used icon names

  for (const category of categoryNodes) {
    const formattedCategoryName = toSnakeCase(category.name);

    if (verboseLogs) {
      console.log(`---------------- Current category: ${formattedCategoryName} ----------------`);
    }

    const categoryNameError = validateCategoryName(formattedCategoryName);

    if (categoryNameError.severity == ErrorSeverity.high) {
      throw new Error(categoryNameError.message);
    } else {
      const icons = extractIconSets(category);

      for (const icon of icons) {
        let name = icon.name;

        if (verboseLogs) {
          console.log(`Current Icon: ${name}`);
        }

        const validationErrors = validateIcon(icon, category.name, usedIconNames);

        let highestSeverity = ErrorSeverity.none;

        for (const error of validationErrors) {
          if (error.severity == ErrorSeverity.high) {
            console.log(`❌ ${name}`, error.message);
            highestSeverity = ErrorSeverity.high;
            break;
          } else if (error instanceof ZetaIconNameError && error.type == RenameErrorType.iconRenamed && error.newName) {
            console.log(`✅ ${name} Renamed to: ${error.newName}`);
            name = error.newName;
          } else if (error.severity == ErrorSeverity.medium) {
            highestSeverity = ErrorSeverity.medium;
          }
        }

        // If the highest severity is high, skip the icon
        if (highestSeverity == ErrorSeverity.high) {
          continue;
        }

        usedIconNames.push(name);
        try {
          const sharpId = icon.children.filter((n) => n.name.toLowerCase().includes("sharp"))[0].id;
          const roundId = icon.children.filter((n) => n.name.toLowerCase().includes("round"))[0].id;

          iconMap.set(icon.id, {
            name: name,
            searchTerms: getSearchTerms(icon.id, componentSets),
            roundPath: `${iconOutputDir}/${formattedCategoryName}/${getIconFileName(name, "round")}.svg`,
            sharpPath: `${iconOutputDir}/${formattedCategoryName}/${getIconFileName(name, "sharp")}.svg`,
            category: formattedCategoryName,
            roundId: roundId,
            sharpId: sharpId,
          });
        } catch (e) {
          throw new Error(` Error finding styles for ${name}`);
        }
      }
    }
  }

  return iconMap;
}
