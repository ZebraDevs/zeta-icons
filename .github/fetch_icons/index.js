import core from "@actions/core";
import { readFileSync, writeFileSync } from "fs";
import fetchIcons from "../../scripts/dist/fetchIcons.js";

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
    core.getInput("figma-access-token"),
    "VQ7Aa3rDYB7mgpToI3bZ4D",
    iconPageName,
    oldHash,
    "./outputs",
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
