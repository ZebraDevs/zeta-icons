import core from "@actions/core";
import * as fs from "fs";
import {
  getDartIconName,
  getScssIconName,
  readFile,
  writeToFile,
} from "../utils/file-utils.mjs";
import { webfont } from "webfont";

const fontName = "zeta-icons";

const buildFontFile = async (woff2Url, ttfUrl, type) => {
  let unicodeAcc = 0xe001;

  const font = await webfont({
    files: `./assets/**/*_${type}.svg`,
    fontName: "zeta-icons",
    formats: ["woff2", "ttf"],
    fontId: "zeta-icons",
    height: 2400,
    centerHorizontally: true,
    centerVertically: true,
    normalize: true,
    glyphTransformFn: (obj) => {
      obj.unicode[0] = String.fromCharCode(unicodeAcc);
      unicodeAcc++;

      const dartIconName = getDartIconName(icon.name);
      const scssIconName = getScssIconName(icon.name);

      const strUnicode = Number(unicodeAcc).toString(16);

      dartFileContents += getDartIconDefinition(dartIconName, strUnicode);
      typesFileContents += getIconTypeDefinition(scssIconName);

      return obj;
    },
  });

  fs.writeFileSync(woff2Url, font.woff2);
  fs.writeFileSync(ttfUrl, font.ttf);
};

try {
  const baseUrl = process.cwd();

  const ttfRoundFontUrl = `${baseUrl}/build_files/${fontName}_round.ttf`;
  const ttfSharpFontUrl = `${baseUrl}/build_files/${fontName}_sharp.ttf`;
  const woff2RoundFontUrl = `${baseUrl}/build_files/${fontName}_round.woff2`;
  const woff2SharpFontUrl = `${baseUrl}/build_files/${fontName}_sharp.woff2`;

  await buildFontFile(woff2RoundFontUrl, ttfRoundFontUrl, "round");
  await buildFontFile(woff2SharpFontUrl, ttfSharpFontUrl, "sharp");

  let dartFileContents = createDartFile();
  let typesFileContents = "export type IconName = \n";

  dartFileContents += "} \n";

  typesFileContents = typesFileContents.trim();
  typesFileContents += "; \n";

  const dartFilePath = `${baseUrl}/build_files/icons.dart`;
  writeToFile(dartFilePath, dartFileContents);

  const typesPath = `${baseUrl}/build_files/icon-types.ts`;
  writeToFile(typesPath, typesFileContents);
} catch (error) {
  core.setFailed(error.message);
}

function createDartFile() {
  var contents = "";

  // Add imports
  contents += "import 'package:flutter/material.dart'; \n ";
  contents += "\n";

  // Class definition
  contents += "class ZetaIcons { \n";
  contents += "  ZetaIcons._(); \n";

  // Font family definition
  contents += `  static const String _family = '${fontName}'; \n \n`;

  return contents;
}

function getDartIconDefinition(iconName, unicode) {
  return `  static const IconData ${iconName} = IconData(0x${unicode}, fontFamily: _family); \n`;
}

function getIconTypeDefinition(iconName) {
  return `  | "${iconName}" \n`;
}
