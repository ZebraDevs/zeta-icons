import { readFileSync, writeFileSync } from "fs";
import packageJson from "../../package.json" with { type: "json" };

const updateVersionConst = (): void => {
  const indexTsPath = "./index.ts";
  let indexTsContent = readFileSync(indexTsPath).toString();
  const versionRegex = /const\s+version\s*=\s*['"`][^'"`]+['"`]/;
  const newVersionLine = `const version = '${packageJson.version}'`;
  indexTsContent = indexTsContent.replace(versionRegex, newVersionLine);

  console.log(`Updating version in index.ts to ${packageJson.version}`);
  writeFileSync(indexTsPath, indexTsContent);
};

updateVersionConst();

export default updateVersionConst;
