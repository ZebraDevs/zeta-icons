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
    // console.log("Files changed:", execSync(`git diff HEAD`).toString());
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
  const statusOutput = execSync(`git status --porcelain`).toString();
  if (statusOutput != "" && verboseLogs) {
    console.log("Files staged:", statusOutput);
  }
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
  const iconsChange = getAllChangedFiles(verboseLogs).filter(({ path }) => path.startsWith("outputs/icons/"));
  if (iconsChange.length > 0) {
    console.log("Icons changed:", getAllChangedFiles(verboseLogs));
  }
  return iconsChange;
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

const parseIconNameAndStyle = (path: string): string[] => {
  const _iconName = path.split("outputs/icons/")[1].split("/")[1].split("_");
  const iconStyle = _iconName.pop();
  return [_iconName.join(" "), iconStyle ?? ""];
};

const buildIconsList = (icons: ChangedFilesDetails[]): string => {
  return `<ul>${icons.map((icon) => "<li>" + parseIconName(icon.path) + "</li>").join("")}</ul>`;
};

interface IconDetails {
  name: string;
  style: string;
  category: string;
}

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

const buildIconConventionalCommit = (icons: ChangedFilesDetails[], type: IconChangeType): string => {
  let str = "";

  icons.forEach((icon) => {
    const iconDetails = parseIconDetails(icon.path);

    str += `\nicon${type}(${iconDetails.category}): ${iconDetails.name} (${iconDetails.style})`;
  });

  return str;
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

  const iconsWithRoundAndSharp: { [key: string]: any } = {};

  newIcons.map((icon) => {
    const iconDetails = parseIconNameAndStyle(icon.path);

    if (iconDetails[1] === "round") {
      iconsWithRoundAndSharp[iconDetails[0]]["round"] = true;
    } else if (iconDetails[1] === "sharp") {
      iconsWithRoundAndSharp[iconDetails[0]]["sharp"] = true;
    }
  });

  // TODO: Find a way to generate correctly build conventional commit message
  // iterate though icons both round and sharp, and add those to the conventional commit with (round and sharp)
  // iterate though icons only round or sharp, and add those to the conventional commit with (round or sharp)
  // Find a way to appeand the conventaionl commit as this would require multiline string which gh a does not allow?
  // Find a way in the on-release script to read the latest change log, or the release notes and use the relevant parts of the release notes to become the body content in flutter  / android releeases.

  if (newIcons.length > 0) {
    comment += `<h2>Icons added:</h2> ${buildIconsList(newIcons)}`;
  }
  if (updatedIcons.length > 0) {
    comment += `<h2>Icons updated:</h2> ${buildIconsList(updatedIcons)}`;
  }
  if (deletedIcons.length > 0) {
    comment += `<h2>Icons deleted:</h2> ${buildIconsList(deletedIcons)}`;
  }

  console.log(updatedIcons);
  console.log(newIcons);

  if (newIcons.length > 0) {
    console.log("here 1");
    comment += buildIconConventionalCommit(newIcons, "add");
  }
  if (updatedIcons.length > 0) {
    console.log("here 2");

    comment += buildIconConventionalCommit(updatedIcons, "update");
  }
  if (deletedIcons.length > 0) {
    console.log("here 3");

    comment += buildIconConventionalCommit(deletedIcons, "remove");
  }

  return comment;
};

type IconChangeType = "add" | "remove" | "update";
