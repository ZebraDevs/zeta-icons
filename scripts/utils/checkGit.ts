import { execSync } from "child_process";

/**
 * Gets all files that have changed in the current branch
 * @returns string[] - List of files that have changed
 */
const getAllChangedFiles = (): string[] => {
  const diffOutput = execSync(`git diff HEAD --name-only`).toString();
  if (diffOutput != "") {
    console.log("Files changed:", diffOutput);
  }
  return diffOutput.toString().split("\n").filter(Boolean);
};

/**
 * Stages all files in the current branch
 */
export const stageAllFiles = (): void => {
  execSync(`git add .`);
};

/**
 * Checks if any files have changed in the current branch, but removes package.json from the list of changed files
 * @returns boolean - Whether files have changed and the action should create a PR
 */
export const checkForFileChanges = (): boolean => {
  stageAllFiles();
  return getAllChangedFiles().length > 0;
};
