import { mkdirSync, rmSync, writeFileSync } from "fs";
import { IconManifest } from "../fetch-icons/types/customTypes.js";
import { generateConnectFileContents } from "./generate-connect-file-contents.js";
import { getNodeText } from "./get-node-text.js";
import { exec } from "child_process";
import { toSnakeCase } from "../utils/fileUtils.js";

export const generateCodeConnectFiles = async (outputDir: string, iconManifest: IconManifest) => {
  mkdirSync(outputDir, { recursive: true });

  iconManifest.forEach((definition, id) => {
    const fileContents = generateConnectFileContents(definition.name, id);

    const fileName = toSnakeCase(definition.name);

    writeFileSync(`${outputDir}/${fileName}.figma.ts`, getNodeText(fileContents));
  });

  exec(`npm run format-connect-files`, (error, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
  });
};
