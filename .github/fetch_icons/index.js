import core from "@actions/core";
import { readFileSync, writeFileSync } from "fs";
import fetchIcons from "../../scripts/dist/fetchIcons.js";

try {
  let oldHash = "";
  const iconPageName = "🦓 Icons";

  try {
    oldHash = readFileSync("./hash.txt").toString();
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
    writeFileSync("./hash.txt", newHash);
  }
  console.log("Files changed", newHash);
  core.setOutput("files_changed", newHash != undefined);
} catch (error) {
  core.setFailed(error.message);
}
