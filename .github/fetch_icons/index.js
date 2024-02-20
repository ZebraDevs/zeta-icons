import core from "@actions/core";
import { getDocumentApi } from "./api.js";
import { parseIconPage } from "./parse-icons.js";

try {
  // Fetch the figma document
  console.log("Fetching Figma document...");
  const result = await getDocumentApi();
  console.log("Figma document fetched");

  // Find the correct page
  const body = await result.json();
  const iconPage = body.document.children.filter(
    (page) => page.name == "Icons"
  )[0];

  const baseUrl = process.cwd();

  const assetsPath = `${baseUrl}/assets.json`;

  await parseIconPage(
    iconPage,
    assetsPath,
    `${baseUrl}/icons`,
    body.componentSets
  );

  core.setOutput("assets_path", assetsPath);
  console.log("DONE");
} catch (error) {
  core.setFailed(error.message);
}
