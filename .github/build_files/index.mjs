import core from "@actions/core";
import * as fs from "fs";
import {
  getDartIconName,
  getScssIconName,
  writeToFile,
} from "../utils/file-utils.mjs";
import { webfont } from "webfont";

const fontName = "zeta-icons";

let dartFileContents = createDartFile();
let typesFileContents = "export type ZetaIcon = \n";

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
      obj.name = obj.unicode[1] = obj.name
        .replace("_round", "")
        .replace("_sharp", "");
      unicodeAcc++;

      const dartIconName = getDartIconName(obj.name);

      const strUnicode = Number(unicodeAcc).toString(16);

      if (!dartFileContents.includes(dartIconName)) {
        dartFileContents += getDartIconDefinition(dartIconName, strUnicode);
      }

      if (!typesFileContents.includes(obj.name)) {
        typesFileContents += getIconTypeDefinition(obj.name);
      }

      return obj;
    },
  });

  fs.writeFileSync(woff2Url, font.woff2);
  fs.writeFileSync(ttfUrl, font.ttf);
};

try {
  const baseUrl = process.cwd();
  const baseFontUrl = `${baseUrl}/fonts`;

  const ttfRoundFontUrl = `${baseFontUrl}/${fontName}_round.ttf`;
  const ttfSharpFontUrl = `${baseFontUrl}/${fontName}_sharp.ttf`;
  const woff2RoundFontUrl = `${baseFontUrl}/${fontName}_round.woff2`;
  const woff2SharpFontUrl = `${baseFontUrl}/${fontName}_sharp.woff2`;

  await buildFontFile(woff2RoundFontUrl, ttfRoundFontUrl, "round");
  await buildFontFile(woff2SharpFontUrl, ttfSharpFontUrl, "sharp");

  dartFileContents += "} \n";

  typesFileContents = typesFileContents.trim();
  typesFileContents += "; \n";

  const baseAssetsUrl = `${baseUrl}/build_files`;

  const dartFilePath = `${baseAssetsUrl}/icons.dart`;
  writeToFile(dartFilePath, dartFileContents);

  const typesPath = `${baseAssetsUrl}/icon-types.ts`;
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