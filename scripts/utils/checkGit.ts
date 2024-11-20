import { execSync } from "child_process";

// type GitChangeType = "A" | "C" | "D" | "M" | "R" | "T" | "U" | "X" | "B";
enum GitChangeType {
  A = "Added",
  C = "Copied",
  D = "Deleted",
  M = "Modified",
  R = "Renamed",
  T = "File type changed",
  U = "Unmerged",
  X = "Unknown",
  B = "Broken"
}
export type ChangedFilesDetails = { type: GitChangeType, path: string };
export const gitChangeTypeToString = (changeType: keyof typeof GitChangeType): string => {
  return GitChangeType[changeType];
};
/**
 * Gets all files that have changed in the current branch
 * @param {boolean} verboseLogs - Logs more verbose outputs for testing.
 * @returns { type: GitChangeType, path: string }[] - List of files that have changed with their change type.
 */
export const getAllChangedFiles = (verboseLogs?: boolean): ChangedFilesDetails[] => {
  const diffOutput = execSync(`git diff HEAD --name-status`).toString();
  if (diffOutput != "" && verboseLogs) {
    console.log("Files changed:", execSync(`git diff HEAD`).toString());
  }
  return diffOutput.toString().split("\n").map((line) => {
    const matches = /^(A|C|D|M|R|T|U|X|B)\s+(.*)$/.exec(line);
    if (!matches) return null;
    return { type: matches[1] as GitChangeType, path: matches[2] };
  }).filter((change) => change !== null);
};

/**
 * Stages all files in the current branch
 * @param {boolean} verboseLogs - Logs more verbose outputs for testing.
 */
export const stageAllFiles = (verboseLogs?: boolean): void => {
  if (verboseLogs) {
    // console.log("git add", execSync(`git add .`).toString());
  } else {
    execSync(`git add .`);
  }
};

/**
 * Checks if any files have changed in the current branch.
 * The check is deliberately off by one to account for `outputs/code-connect.figma.ts` which is not yet regenerated, so will always be changed.
 * @param {boolean} verboseLogs - Logs more verbose outputs for testing.
 * @returns string[] - The list of changed file paths. If files have changed the action should create a PR.
 */
export const checkForFileChanges = (verboseLogs?: boolean): ChangedFilesDetails[] => {
  stageAllFiles(verboseLogs);
  return getAllChangedFiles(verboseLogs).filter(({ path }) => path !== "outputs/code-connect.figma.ts");
};
