import core from "@actions/core";
import * as fs from "fs";
import { getDartIconName, writeToFile } from "../utils/file-utils.mjs";
import { webfont } from "webfont";

const fontName = "zeta-icons";

let dartFileContents = createDartFile();
let typesFileContents = "export const ZetaIconNameList = [ \n";

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

      const dartIconName = getDartIconName(obj.name);

      const strUnicode = Number(unicodeAcc).toString(16);

      if (type === 'round') {
        dartFileContents += getDartIconDefinition(dartIconName, strUnicode);
      }

      if (type === 'round') {
        typesFileContents += getIconTypeDefinition(obj.name);
      }

      unicodeAcc++;
      return obj;
    },
  });

  fs.writeFileSync(woff2Url, font.woff2);
  fs.writeFileSync(ttfUrl, font.ttf);
};

try {
  const baseUrl = process.cwd();
  const baseFontUrl = `${baseUrl}/fonts`;

  const ttfRoundFontUrl = `${baseFontUrl}/${fontName}-round.ttf`;
  const ttfSharpFontUrl = `${baseFontUrl}/${fontName}-sharp.ttf`;
  const woff2RoundFontUrl = `${baseFontUrl}/${fontName}-round.woff2`;
  const woff2SharpFontUrl = `${baseFontUrl}/${fontName}-sharp.woff2`;

  await buildFontFile(woff2RoundFontUrl, ttfRoundFontUrl, "round");
  await buildFontFile(woff2SharpFontUrl, ttfSharpFontUrl, "sharp");

  dartFileContents += "} \n";

  typesFileContents = typesFileContents.trim();
  typesFileContents += `];\n type ZetaIconNameTuple = typeof ZetaIconNameList;\n export type ZetaIconName = ZetaIconNameTuple[number];`;

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
  return `"${iconName}",\n`;
}
