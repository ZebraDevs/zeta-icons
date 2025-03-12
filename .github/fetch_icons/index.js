import core from "@actions/core";
import { readFileSync, writeFileSync } from "fs";
import fetchIcons from "../../dist/scripts/fetch-icons/fetchIcons.js";
import { checkForIconChanges, stageAllFiles, parseFilesChanged } from '../../dist/scripts/utils/checkGit.js';
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
  let filesChanged = [];
  let filesChangedOutput = "";

  if (newHash) {
    writeFileSync(hashPath, newHash);
    filesChanged = checkForIconChanges(VERBOSE_LOGS);
    if (filesChanged.length > 0) {
      console.log('1')
      const packageJson = JSON.parse(readFileSync("./package.json").toString());
      console.log('2')
      packageJson.lastUpdated = DATE;
      console.log('3')
      writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));
      console.log('4')
      stageAllFiles();
      console.log('5')
      filesChangedOutput = parseFilesChanged(filesChanged);
      console.log('6')
    }
  }
  console.log('7')
  core.setOutput("files_changed", filesChangedOutput);
  console.log('8')
  core.setOutput('comment', filesChangedOutput)
  console.log('9')
} catch (error) {
  core.setFailed(error.message);
}
