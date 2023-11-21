import core from "@actions/core";
import {
  writeSVGToFile,
  createFolder,
  fileExists,
  writeToFile,
  readFile,
  deleteFile,
  getDartIconName,
} from "../utils/file-utils.mjs";
import { getDocumentApi, getImageApi } from "./api.mjs";
import {
  checkIconName,
  checkCategoryName,
  ErrorSeverity,
} from "zeta-icon-name-checker";

try {
  // Fetch the figma document
  console.log("Fetching Figma document...");
  const result = await getDocumentApi();
  console.log("Figma document fetched");

  // Find the correct page
  const body = await result.json();
  const iconPage = body.document.children.filter(
    (page) => page.name == "Icons"
  )[0];

  // Fetches the search terms for an icon
  function getSearchTerm(componentId) {
    const componentSet = body.componentSets[componentId];

    return componentSet.description.split(", ") ?? "";
  }

  // Find all the categories by getting a list of all the frames
  const categories = iconPage.children.filter((child) => child.type == "FRAME");

  const baseUrl = process.cwd();

  // Fetch the assets file from the previous run
  const assetsPath = `${baseUrl}/src/assets.json`;
  let oldAssetsObj = {};
  if (fileExists(assetsPath)) {
    oldAssetsObj = JSON.parse(await readFile(assetsPath));
  }

  // Create the assets folder if it doesn't exist
  const fileDestination = `${baseUrl}/public/assets`;
  await createFolder(fileDestination);

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

      const folderPath = `${fileDestination}/${formattedCategoryName}`;

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
                  const relativePath = filePath.replace(
                    `${baseUrl}/public/`,
                    ""
                  );
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
              const roundedPath = `${baseUrl}/public/${icon.roundPath}`;
              deleteFile(roundedPath);
              const sharpPath = `${baseUrl}/public/${icon.sharpPath}`;
              deleteFile(sharpPath);
            } catch (e) {
              console.log(e);
            }
          });
        }
      } else {
        console.log(`${category.name} is an invalid folder name`);
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  const iconsChanged =
    JSON.stringify(oldAssetsObj) != JSON.stringify(newAssetsObj);
  console.log("ICONS CHANGED", iconsChanged);
  writeToFile(assetsPath, JSON.stringify(newAssetsObj, null, 2));
  core.setOutput("assets_path", assetsPath);
  core.setOutput("icons_changed", iconsChanged);

  console.log("DONE");
} catch (error) {
  core.setFailed(error.message);
}
