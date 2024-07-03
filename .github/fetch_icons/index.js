import core from "@actions/core";
import { readFileSync, writeFileSync } from "fs";
import fetchIcons from "../../dist/scripts/fetchIcons.js";

const FIGMA_ICON_FILE_ID = "VQ7Aa3rDYB7mgpToI3bZ4D";
const FIGMA_ACCESS_TOKEN = core.getInput("figma-access-token") || process.env.FIGMA_ACCESS_TOKEN;

try {
  const hashPath = "./.github/fetch_icons/hash.txt";
  let oldHash = "";
  const iconPageName = "🦓 Icons";

  try {
    oldHash = readFileSync(hashPath).toString();
  } catch (e) {
    oldHash = "";
  }

  const newHash = await fetchIcons(
    FIGMA_ACCESS_TOKEN,
    FIGMA_ICON_FILE_ID,
    iconPageName,
    oldHash,
    "outputs",
    false
  );

  if (newHash) {
    writeFileSync(hashPath, newHash);
  }
  console.log("Files changed", newHash);
  core.setOutput("files_changed", newHash != undefined);
} catch (error) {
  core.setFailed(error.message);
}
