import { join } from "path";
import { readFileSync } from "fs";

const changelogPath = join("CHANGELOG.md");

interface Icon {
  name: string;
  category: string;
  style: string;
  change: GitChangeType;
}

type GitChangeType = "added" | "updated" | "removed";

/**
 * Parses a line from the changelog and returns an Icon object.
 * @param line - Line from the changelog
 * @param change - Type of change
 * @returns {Icon} Icon object
 */
const parseIcon = (line: string, change: GitChangeType): Icon => {
  const category = line.split("**")[1].replace(":", "");
  const name = line.split("**")[2].split("(")[0].trim();
  const style = line.split("(")[1].split(")")[0];
  return { name: name, category: category, style: style, change: change };
};

/**
 * Reads the changelog and returns the list of icons that were added, updated or removed
 * @returns {Icon[]} List of icons
 */
export const getIcons = (): Icon[] => {
  const data = readFileSync(changelogPath, "utf8");

  const lastData = data.split(`
## `)[1];
  let added: Icon[] = [];
  let updated: Icon[] = [];
  let removed: Icon[] = [];

  try {
    added = lastData
      .split("### ✅ Icons added")[1]
      .split("###")[0]
      .split("\n")
      .filter((i) => i && i.trim())
      .map((i) => parseIcon(i, "added"));
  } catch (e) {}

  try {
    updated = lastData
      .split("### 🎨 Icons updated")[1]
      .split("###")[0]
      .split("\n")
      .filter((i) => i && i.trim())
      .map((i) => parseIcon(i, "updated"));
  } catch (e) {}

  try {
    removed = lastData
      .split("### ✂️ Icons removed")[1]
      .split("###")[0]
      .split("\n")
      .filter((i) => i && i.trim())
      .map((i) => parseIcon(i, "removed"));
  } catch (e) {}

  return [...added, ...updated, ...removed];
};

/**
 * Builds the conventional commit message for the release used for Android and Flutter repos
 * @param icons - List of icons
 * @returns {string} The conventional commit message
 */
export const getConventionalCommit = (icons: Icon[]): string =>
  "\n" +
  icons
    .map((icon) => "icon" + icon.change + "(" + icon.category + "): " + icon.name + " (" + icon.style + ")")
    .join("\n");

/**
 * Builds the body of the release, used for Android and Flutter repos
 * @param icons - List of icons
 * @returns {string} The body of the release
 */
export const getBody = (icons: Icon[]): string =>
  "\n## Icons updated \n" + icons.map((i) => `- ${i.category} /  ${i.name} (${i.style})`).join("\n") + "\n";
