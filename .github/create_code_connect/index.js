import { readFileSync } from "fs";
import { generateCodeConnectFiles } from "../../dist/scripts/code-connect/generate-code-connect-files.js";

const main = async () => {
  const iconManifest = new Map(Object.entries(JSON.parse(readFileSync("../../outputs/icon-manifest.json"))));
  const dir = "../../outputs/code-connect";

  generateCodeConnectFiles(dir, iconManifest);
};

main();
