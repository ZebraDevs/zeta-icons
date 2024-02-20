import {
  writeSVGToFile,
  createFolder,
  fileExists,
  writeToFile,
  readFile,
  deleteFile,
  getDartIconName,
  optimizeSvgsInDir
} from "../utils/file-utils.mjs";
import { getImageApi } from "./api.js";
import {
  checkIconName,
  checkCategoryName,
  ErrorSeverity,
} from "zeta-icon-name-checker";

/**
 *
 * @param {*} iconPage The json object describing the figma page
 * @param {*} assetsPath The path to save assets.json
 * @param {*} iconDirectory The directory for the icons to be saved in
 * @param {*} componentSets The component sets from the figma document used to look up search terms
 */
export async function parseIconPage(
  iconPage,
  assetsPath,
  iconDirectory,
  componentSets
) {
  // Fetches the search terms for an icon
  function getSearchTerm(componentId) {
    const componentSet = componentSets[componentId];

    return componentSet.description.split(", ") ?? "";
  }

  // Find all the categories by getting a list of all the frames
  const categories = iconPage.children.filter((child) => child.type == "FRAME");

  const baseUrl = process.cwd();

  // Fetch the assets file from the previous run
  let oldAssetsObj = {};
  if (fileExists(assetsPath)) {
    oldAssetsObj = JSON.parse(await readFile(assetsPath));
  }

  // Create the assets folder if it doesn't exist
  await createFolder(iconDirectory);

  const newAssetsObj = {}; // Maps category names to a list of icon models
  const usedIconNames = []; // A list of used icon names

  for (const category of categories) {
    try {
      console.log(`Fetching icons from ${category.name}`);

      const formattedCategoryName = category.name
        .replace(" ", "_")
        .toLowerCase();

      const categoryNameError = checkCategoryName(formattedCategoryName);

      if (categoryNameError.severity == ErrorSeverity.high) {
        throw new Error(categoryNameError.message);
      }

      const folderPath = `${iconDirectory}/${formattedCategoryName}`;

      const folderCreated = await createFolder(folderPath);

      if (folderCreated) {
        const allChildren = category.children;

        // Find all icons by getting each component set in the frame
        const icons = allChildren.filter(
          (child) => child.type == "COMPONENT_SET"
        );

        // Load a list of the previous icons to check if any have been removed
        let checkList = oldAssetsObj[category.name] ?? [];

        const iconModels = []; // A list of icon models to be mapped to the category

        for (const iconSet of icons) {
          try {
            let name = iconSet.name;

            const nameError = checkIconName(name, category.name, usedIconNames);

            if (nameError.severity == ErrorSeverity.high) {
              throw new Error(nameError.message);
            } else if (nameError.severity == ErrorSeverity.medium) {
              console.log(nameError.message);
            }

            if (nameError.newName != undefined) {
              name = nameError.newName;
            }
            usedIconNames.push(name);

            // Create a new icon model regardless in case name/search terms have been updated
            let iconModel = {
              name: name,
              id: iconSet.id,
              searchTerms: getSearchTerm(iconSet.id),
            };

            // Find any pre-existing icons with the same id
            const iconMatches = checkList.filter(
              (oldIcon) => iconSet.id == oldIcon.id
            );

            if (iconMatches.length > 0) {
              // If the icon already exists...
              console.log(`Icon already exists ${name}`);
              iconModel["roundPath"] = iconMatches[0].roundPath;
              iconModel["sharpPath"] = iconMatches[0].sharpPath;
            } else {
              // Loop through each variant of the icon
              for (const iconVariant of iconSet.children) {
                console.log("NAME", iconVariant.name);

                // This isn't a great way to fetch the style name but Figma does not return the same style names for each element
                const styleName = iconVariant.name
                  .toLowerCase()
                  .includes("sharp")
                  ? "sharp"
                  : "round";

                console.log(`Fetching ${name} ${styleName}`);
                const fileName = `${getDartIconName(name)}_${styleName}.svg`;
                const filePath = `${folderPath}/${fileName}`;

                // Fetch the image data of the icon
                const svgDOM = await getImageApi(iconVariant.id);
                if (svgDOM != null && svgDOM != undefined) {
                  // Write the SVG to a file
                  await writeSVGToFile(svgDOM, filePath);

                  // Set the relative path by removing the base url
                  const relativePath = filePath.replace(`${baseUrl}/`, "");
                  iconModel[`${styleName}Path`] = relativePath;
                } else {
                  console.log("corrupt svgDom", svgDOM);
                  iconModel[`${styleName}Path`] = "ERROR";
                }
              }
            }

            // Remove the icon from the check list as it already exists or has been fetched
            checkList = checkList.filter((oldIcon) => iconSet.id != oldIcon.id);

            iconModels.push(iconModel);
          } catch (e) {
            console.error(e.message);
          }
        }
        if (iconModels.length > 0) {
          newAssetsObj[category.name] = iconModels;
        }

        if (checkList != undefined) {
          // Each icon on the check list is no longer on Figma so should be deleted
          checkList.forEach((icon) => {
            console.log(`Deleting icon ${icon.name}`);

            try {
              const roundedPath = `${baseUrl}/${icon.roundPath}`;
              deleteFile(roundedPath);
              const sharpPath = `${baseUrl}/${icon.sharpPath}`;
              deleteFile(sharpPath);
            } catch (e) {
              console.log(e);
            }
          });
        }
        optimizeSvgsInDir(folderPath);

      } else {
        console.log(`${category.name} is an invalid folder name`);
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  writeToFile(assetsPath, JSON.stringify(newAssetsObj, null, 2));
}
