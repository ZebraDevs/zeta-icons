import * as fs from "fs";
import core from "@actions/core";
import { optimize } from "svgo";
import { scale } from "scale-that-svg";

export const fileExists = (path) => {
  return fs.existsSync(path);
};

export const createFolder = async (path) => {
  const pathValid = path.includes("/");
  if (!pathValid) return false;
  try {
    await fs.promises.access(path, fs.constants.F_OK);
  } catch (err) {
    await fs.promises.mkdir(path);
  }
  return true;
};

export const deleteFile = async (path) => {
  return await fs.promises.rm(path);
};

export const readFile = async (path) => {
  return await fs.promises.readFile(path, { encoding: "utf8" });
};

export const writeSVGToFile = async (svgDOM, filePath) => {
  console.log(svgDOM);

  const stream = svgDOM;
  const chunks = [];
  let svgData = await new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
  svgData = await scale(svgData, { scale: 100 });

  const optimizedSvg = optimize(svgData, {
    plugins: [
      plugin,
      {
        name: "removeUselessDefs",
      },
      {
        name: "convertShapeToPath",
      },
      {
        name: "mergePaths",
      },
      {
        name: "removeDimensions",
      },
      {
        name: "removeAttrs",
        params: {
          attrs: ["clip-path"],
        },
      },
    ],
  });

  return writeToFile(filePath, optimizedSvg.data);
};

export const writeToFile = async (fileName, data) => {
  return fs.writeFile(fileName, data, (error) => {
    if (error) {
      core.setFailed(error.message);
    } else {
      console.log(`The file ${fileName} has been saved`);
    }
  });
};

export const getDartIconName = (iconName) => {
  return iconName.toLowerCase().replaceAll(" ", "_");
};

export const getScssIconName = (iconName) => {
  return iconName
    .toLowerCase()
    .replaceAll(" ", "-")
    .replace("_round", "")
    .replace("_sharp", "");
};

const plugin = {
  name: "remove-defs",
  fn: () => {
    return {
      element: {
        enter: (node, parentNode) => {
          if (node.name == "defs") {
            //remove defs from svg
            parentNode.children = parentNode.children.filter(
              (child) => child !== node
            );
          }
        },
      },
    };
  },
};
