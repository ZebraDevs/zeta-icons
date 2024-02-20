import * as fs from "fs";
import core from "@actions/core";
import { optimize } from "svgo";
import { scale } from "scale-that-svg";
import SVGFixer from 'oslllo-svg-fixer';
import { dirname } from "path";
import { exec } from "child_process";

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

  return writeToFile(filePath, svgData);
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

export const optimizeSvgsInDir = async (dirName) => {
  await SVGFixer(dirName, dirName, { showProgressBar: true, throwIfDestinationDoesNotExist: false }).fix();

  exec('npm i -g svgo', (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
    if (stdout) {
      console.log(`stderr: ${stdout}`);
    }
    exec('svgo -f ' + dirName + ' -o ' + dirName, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      if (stdout) {
        console.log(`stderr: ${stdout}`);
      }
    });
  })

}
