import { execSync } from "child_process";

/**
 * Gets all files that have changed in the current branch
 * @param {boolean} verboseLogs - Logs more verbose outputs for testing.
 * @returns string[] - List of files that have changed
 */
const getAllChangedFiles = (verboseLogs?: boolean): string[] => {
  const diffOutput = execSync(`git diff HEAD --name-only`).toString();
  if (diffOutput != "" && verboseLogs) {
    console.log("Files changed:", execSync(`git diff HEAD`).toString());
  }
  return diffOutput.toString().split("\n").filter(Boolean);
};

/**
 * Stages all files in the current branch
 * @param {boolean} verboseLogs - Logs more verbose outputs for testing.
 */
export const stageAllFiles = (verboseLogs?: boolean): void => {
  if (verboseLogs) {
    console.log("git add", execSync(`git add .`).toString());
  } else {
    execSync(`git add .`);
  }
};

/**
 * Checks if any files have changed in the current branch.
 * The check is deliberately off by one to account for `outputs/code-connect.figma.ts` which is not yet regenerated, so will always be changed.
 * @param {boolean} verboseLogs - Logs more verbose outputs for testing.
 * @returns boolean - Whether files have changed and the action should create a PR
 */
export const checkForFileChanges = (verboseLogs?: boolean): boolean => {
  stageAllFiles(verboseLogs);
  return getAllChangedFiles(verboseLogs).length > 1;
};
