import { readFileSync, writeFileSync } from "fs";
import packageJson from "../../package.json" with { type: "json" };

const indexTsPath = "./index.ts";
const dartTemplatePath = "./scripts/fetch-icons/templates/icons.dart.template";
const dartOutputPath = "./outputs/flutter/icons.g.dart";

const updateVersionConst = (): void => {
  let indexTsContent = readFileSync(indexTsPath).toString();
  const versionRegex = /const\s+version\s*=\s*['"`][^'"`]+['"`]/;
  const newVersionLine = `const version = '${packageJson.version}'`;
  indexTsContent = indexTsContent.replace(versionRegex, newVersionLine);

  let dartTemplateContent = readFileSync(dartTemplatePath).toString();
  const dartVersionRegex = /const\s+zetaIconsVersion\s*=\s*['"`][^'"`]+['"`];/;
  const newDartVersionLine = `const zetaIconsVersion = '${packageJson.version}';`;

  dartTemplateContent = dartTemplateContent.replace(dartVersionRegex, newDartVersionLine);
  writeFileSync(dartTemplatePath, dartTemplateContent);

  let dartGeneratedContent = readFileSync(dartOutputPath).toString();
  dartGeneratedContent = dartGeneratedContent.replace(dartVersionRegex, newDartVersionLine);
  writeFileSync(dartOutputPath, dartGeneratedContent);

  console.log(`Updating version in index.ts to ${packageJson.version}`);
  writeFileSync(indexTsPath, indexTsContent);
};

updateVersionConst();

export default updateVersionConst;
