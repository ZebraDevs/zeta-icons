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

const parseIcon = (line: string, change: GitChangeType): Icon => {
  const category = line.split("**")[1].replace(":", "");
  const name = line.split("**")[2].split("(")[0].trim();
  const style = line.split("(")[1].split(")")[0];
  return { name: name, category: category, style: style, change: change };
};

const toConventionalCommit = (icon: Icon): string =>
  "icon" + icon.change + "(" + icon.category + "): " + icon.name + " (" + icon.style + ")";

export const getIcons = (): Icon[] => {
  const data = readFileSync(changelogPath, "utf8");

  const lastData = data.split(`
## `)[1];
  let added: Icon[] = [];
  let updated: Icon[] = [];
  let removed: Icon[] = [];

  try {
    added = lastData
      .split("### 🔺 Icons added")[1]
      .split("###")[0]
      .split("\n")
      .filter((i) => i && i.trim())
      .map((i) => parseIcon(i, "updated"));
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
      .split("### 🔻 Icons removed")[1]
      .split("###")[0]
      .split("\n")
      .filter((i) => i && i.trim())
      .map((i) => parseIcon(i, "removed"));
  } catch (e) {}

  return [...added, ...updated, ...removed];
};

export const getConventionalCommit = (icons: Icon[]): string => "\n" + icons.map(toConventionalCommit).join("\n");

export const getBody = (icons: Icon[]): string =>
  "\n## Icons updated \n" + icons.map((i) => `- ${i.category} /  ${i.name} (${i.style})`).join("\n") + "\n";
