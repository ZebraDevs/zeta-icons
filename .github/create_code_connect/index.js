import { readFileSync } from "fs";
import { generateCodeConnectFile } from "../../dist/scripts/code-connect/generate-code-connect-file.js";

const main = async () => {
  const iconManifest = new Map(Object.entries(JSON.parse(readFileSync("outputs/icon-manifest.json"))));
  const dir = "outputs";

  generateCodeConnectFile(dir, iconManifest);
};

main();
