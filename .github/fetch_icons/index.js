import core from "@actions/core";
import { readFileSync, writeFileSync } from "fs";
import fetchIcons from "../../dist/scripts/fetch-icons/fetchIcons.js";
import { checkForFileChanges, stageAllFiles } from '../../dist/scripts/utils/checkGit.js';
import { ZDS_ASSETS_FILE_ID, ZDS_ASSETS_ICON_PAGE_NAME } from "../../figmaConfig.js";

const FIGMA_ACCESS_TOKEN = core.getInput("figma-access-token") || process.env.FIGMA_ACCESS_TOKEN;
let VERBOSE_LOGS = false;
try {
  VERBOSE_LOGS = core.getBooleanInput("actions-runner-debug");
} catch (e) {
  console.warn('Debug input not found, defaulting to false');
}

const DATE = core.getInput("date") || 'now';

try {
  const hashPath = "./.github/fetch_icons/hash.txt";
  let oldHash = "";

  try {
    oldHash = readFileSync(hashPath).toString();
  } catch (e) {
    oldHash = "";
  }

  const newHash = await fetchIcons(
    FIGMA_ACCESS_TOKEN,
    ZDS_ASSETS_FILE_ID,
    ZDS_ASSETS_ICON_PAGE_NAME,
    oldHash,
    "outputs",
    VERBOSE_LOGS,
  );
  let filesChanged = false;

  if (newHash) {
    writeFileSync(hashPath, newHash);
    filesChanged = checkForFileChanges(VERBOSE_LOGS);
    if (filesChanged) {
      const packageJson = JSON.parse(readFileSync("./package.json").toString());
      packageJson.lastUpdated = DATE;
      writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));
      stageAllFiles();
    }
  }

  console.log("Files changed", filesChanged);
  core.setOutput("files_changed", filesChanged);
} catch (error) {
  core.setFailed(error.message);
}
