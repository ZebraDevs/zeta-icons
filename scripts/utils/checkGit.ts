import { execSync, spawnSync } from "child_process";

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

type IconChangeType = "add" | "remove" | "update";

export type ChangedFilesDetails = { type: GitChangeType; path: string };

interface IconDetails {
  name: string;
  style: string;
  category: string;
}

/**
 * Gets all files that have changed in the current branch
 * @param {boolean} verboseLogs - Logs more verbose outputs for testing.
 * @returns { type: GitChangeType, path: string }[] - List of files that have changed with their change type.
 */
export const getAllChangedFiles = (verboseLogs?: boolean): ChangedFilesDetails[] => {
  const diff = spawnSync("git", ["diff", "HEAD", "--name-status", "--", "outputs/icons"], {
    encoding: "utf-8",
    maxBuffer: 1024 * 1024 * 1000,
  });
  const diffOutput = diff.stdout;
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
 * @param {boolean?} verboseLogs - Logs more verbose outputs for testing.
 */
export const stageAllFiles = (verboseLogs?: boolean): void => {
  // const statusOutput = execSync(`git status --porcelain`).toString();
  // if (statusOutput != "" && verboseLogs) {
  //   console.log("Files staged:", statusOutput);
  // }
  const stageAllFiles = execSync(`git add -A`).toString();
  if (stageAllFiles != "" && verboseLogs) {
    console.log("Files staged:", stageAllFiles);
  }
};

/**
 * Checks if any files have changed in the current branch.
 * The check is deliberately off by one to account for `outputs/code-connect.figma.ts` which is not yet regenerated, so will always be changed.
 * @param {boolean} verboseLogs - Logs more verbose outputs for testing.
 * @returns string[] - The list of changed file paths. If files have changed the action should create a PR.
 */
export const checkForIconChanges = (verboseLogs?: boolean): ChangedFilesDetails[] => {
  stageAllFiles(verboseLogs);
  const iconsChange = getAllChangedFiles(verboseLogs);
  if (iconsChange.length > 0) {
    console.log("Icons changed:", getAllChangedFiles(verboseLogs));
  }
  return iconsChange;
};

/**
 * Converts a string to title case
 * @param str - String to convert to title case
 * @returns - String in title case
 */
const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
};

/**
 * Parses the icon path and returns the icon name
 * @param path - Path of the icon
 * @returns string - Icon name
 */
const parseIconName = (path: string): string => {
  const category = path.split("outputs/icons/")[1].split("/")[0];
  const _iconName = path.split("outputs/icons/")[1].split("/")[1].split("_");

  const iconType = _iconName.pop()?.split(".")[0];
  const iconName = _iconName.join(" ");

  return toTitleCase(`${category} / ${iconName} / ${iconType}`);
};

/**
 * Returns html formatted list of icons.
 * @param icons - List of icons
 * @returns string - Html formatted list of icons
 */
const buildIconsList = (icons: ChangedFilesDetails[]): string => {
  return `<ul>${icons.map((icon) => "<li>" + parseIconName(icon.path) + "</li>").join("")}</ul>`;
};

/**
 * Parses the icon path and returns the icon details
 * @param path - Path of the icon
 * @returns IconDetails - Icon details
 */
const parseIconDetails = (path: string): IconDetails => {
  const category = path.split("outputs/icons/")[1].split("/")[0];
  const _iconName = path.split("outputs/icons/")[1].split("/")[1].split("_");
  const iconType = _iconName.pop()?.split(".")[0];
  const iconName = _iconName.join(" ");

  return {
    name: toTitleCase(iconName),
    category: toTitleCase(category),
    style: iconType ?? "",
  };
};

/**
 * Builds conventional commit message for icon changes
 * @param icons - List of changed icons
 * @param type - Type of change
 * @returns string - Conventional commit message for icon changes
 */
const buildIconConventionalCommit = (icons: ChangedFilesDetails[], type: IconChangeType): string => {
  let str = "";

  icons.forEach((icon) => {
    const iconDetails = parseIconDetails(icon.path);

    str += `\nicon${type}(${iconDetails.category}): ${iconDetails.name} (${iconDetails.style})`;
  });

  return str;
};

/**
 * Parses the changed files and returns a comment with the icons added, updated and deleted
 * @param changed - List of changed files
 * @returns string - Comment with the icons added, updated and deleted
 */
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

  const iconsWithRoundAndSharp: { [key: string]: any } = {};

  newIcons.map((icon) => {
    const iconDetails = parseIconDetails(icon.path);
    if (!iconsWithRoundAndSharp[iconDetails.name]) {
      iconsWithRoundAndSharp[iconDetails.name] = { round: false, sharp: false };
    }
    if (iconDetails.style === "round") {
      iconsWithRoundAndSharp[iconDetails.name]["round"] = true;
    } else if (iconDetails.style === "sharp") {
      iconsWithRoundAndSharp[iconDetails.name]["sharp"] = true;
    }
  });

  if (newIcons.length > 0) {
    comment += `<h2>Icons added:</h2> ${buildIconsList(newIcons)}`;
  }
  if (updatedIcons.length > 0) {
    comment += `<h2>Icons updated:</h2> ${buildIconsList(updatedIcons)}`;
  }
  if (deletedIcons.length > 0) {
    comment += `<h2>Icons deleted:</h2> ${buildIconsList(deletedIcons)}`;
  }

  if (newIcons.length > 0) {
    comment += buildIconConventionalCommit(newIcons, "add");
  }
  if (updatedIcons.length > 0) {
    comment += buildIconConventionalCommit(updatedIcons, "update");
  }
  if (deletedIcons.length > 0) {
    comment += buildIconConventionalCommit(deletedIcons, "remove");
  }

  return comment;
};
