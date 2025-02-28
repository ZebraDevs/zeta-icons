import { execSync } from "child_process";

export enum GitChangeType {
  A = "Added",
  C = "Copied",
  D = "Deleted",
  M = "Modified",
  R = "Renamed",
  T = "File type changed",
  U = "Unmerged",
  X = "Unknown",
  B = "Broken",
}
export type ChangedFilesDetails = { type: GitChangeType; path: string };

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
  return diffOutput
    .toString()
    .split("\n")
    .map((line) => {
      const matches = /^(A|C|D|M|R|T|U|X|B)\s+(.*)$/.exec(line);
      if (!matches) return null;
      return { type: matches[1] as GitChangeType, path: matches[2] };
    })
    .filter((change) => change != null);
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

const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
};

const parseIconName = (path: string): string => {
  const category = path.split("outputs/icons/")[1].split("/")[0];
  const _iconName = path.split("outputs/icons/")[1].split("/")[1].split("_");

  const iconType = _iconName.pop()?.split(".")[0];
  const iconName = _iconName.join(" ");

  return toTitleCase(`${category} / ${iconName} / ${iconType}`);
};

const buildIconsList = (icons: ChangedFilesDetails[]): string => {
  return `<br> ${icons.map((icon) => "* " + parseIconName(icon.path)).join("< br>")}<br><br>`;
};

export const parseFilesChanged = (changed: []): string => {
  const filesChanged: ChangedFilesDetails[] = changed.map((file: any) => {
    return {
      path: file.path,
      type: GitChangeType[file.type as keyof typeof GitChangeType],
    };
  });

  const newIcons: ChangedFilesDetails[] = [];
  const updatedIcons: ChangedFilesDetails[] = [];
  const deletedIcons: ChangedFilesDetails[] = [];

  let comment = "";

  filesChanged.forEach((file) => {
    if (file.path.startsWith("outputs/icons/")) {
      if (file.type === "Added") {
        newIcons.push(file);
      } else if (file.type === "Modified" || file.type === "Renamed") {
        updatedIcons.push(file);
      } else if (file.type === "Deleted") {
        deletedIcons.push(file);
      }
    }
  });

  if (newIcons.length === 0 && updatedIcons.length === 0 && deletedIcons.length === 0) {
    return "No icon changes";
  }
  if (newIcons.length > 0) {
    comment += `## Icons added: ${buildIconsList(newIcons)}`;
  }
  if (updatedIcons.length > 0) {
    comment += `## Icons updated: ${buildIconsList(updatedIcons)}`;
  }
  if (deletedIcons.length > 0) {
    comment += `## Icons deleted: ${buildIconsList(deletedIcons)}`;
  }

  return comment;
};
