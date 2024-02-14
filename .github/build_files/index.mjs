import core from "@actions/core";
import * as fs from "fs";
import { getDartIconName, writeToFile } from "../utils/file-utils.mjs";
import { webfont } from "webfont";

const fontName = "zeta-icons";

let dartFileContents = createDartFile();
let typesFileContents = "export const ZetaIconNameList = [ \n";

let dartRoundIcons = "";
let dartSharpIcons = "";

let dartRoundList =
  "/// List of all rounded icons. \nconst Map<String, IconData> iconsRounded = {\n";
let dartSharpList =
  "\n/// List of all sharp icons. \nconst Map<String, IconData> iconsSharp = {\n";

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

      if (type === "round") {
        dartRoundIcons += getDartIconDefinition(
          dartIconName,
          strUnicode,
          "round"
        );
        dartRoundList += `   '${dartIconName}_round': ZetaIcons.${dartIconName}_round,\n`;
      } else if (type === "sharp") {
        dartSharpIcons += getDartIconDefinition(
          dartIconName,
          strUnicode,
          "sharp"
        );
        dartSharpList += `   '${dartIconName}_sharp': ZetaIcons.${dartIconName}_sharp,\n`;
      }

      if (type === "round") {
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

  dartRoundList += "};\n";
  dartSharpList += "};\n";

  dartFileContents += "   /// Round Icons\n";
  dartFileContents += dartRoundIcons;
  dartFileContents += "\n \n    /// Sharp Icons\n";
  dartFileContents += dartSharpIcons;
  dartFileContents += "} \n \n";
  dartFileContents += dartRoundList;
  dartFileContents += dartSharpList;

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
  var contents =
    "// ignore_for_file: public_member_api_docs, constant_identifier_names\n";

  // Add imports

  contents += "import 'package:flutter/material.dart'; \n ";
  contents += "\n";

  // Class definition
  contents += "class ZetaIcons { \n";
  contents += "  ZetaIcons._(); \n";

  // Font family definition
  contents += `  static const String _familyRound = '${fontName}-round'; \n`;
  contents += `  static const String _familySharp = '${fontName}-sharp'; \n`;
  contents += `  static const String _package = 'zeta_flutter';\n \n`;
  return contents;
}

function getDartIconDefinition(iconName, unicode, modifier) {
  return `  static const IconData ${iconName}_${modifier} = IconData(0x${unicode}, fontFamily: _family${capitalizeFirstLetter(
    modifier
  )}, fontPackage: _package); \n`;
}

function getIconTypeDefinition(iconName) {
  return `"${iconName}",\n`;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
