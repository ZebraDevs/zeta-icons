import core from "@actions/core";
import * as fs from "fs";
import {
  getDartIconName,
  getScssIconName,
  readFile,
  writeToFile,
} from "../utils/file-utils.mjs";
import { webfont } from 'webfont';

const fontName = "zeta-icons";


const buildFontFile = async (woff2Url, ttfUrl, type) => {
  let unicodeAcc = 0xe001;

  const font = await webfont({
    files: `./public/assets/**/*_${type}.svg`,
    fontName: "zeta-icons",
    formats: ['woff2', 'ttf'],
    fontId: "zeta-icons",
    height: 2400,
    centerHorizontally: true,
    centerVertically: true,
    normalize: true,
    glyphTransformFn: (obj) => {
      obj.unicode[0] = String.fromCharCode(unicodeAcc);
      unicodeAcc++;
      return obj;
    },
  });

  writeFileSync(woff2Url, font.woff2);
  writeFileSync(ttfUrl, font.ttf);
}

try {
  const baseUrl = process.cwd();

  const ttfRoundFontUrl = `${baseUrl}/public/build_files/${fontName}_round.ttf`;
  const ttfSharpFontUrl = `${baseUrl}/public/build_files/${fontName}_sharp.ttf`;
  const woff2RoundFontUrl = `${baseUrl}/public/build_files/${fontName}_round.woff2`;
  const woff2SharpFontUrl = `${baseUrl}/public/build_files/${fontName}_sharp.woff2`;

  await buildFontFile(woff2RoundFontUrl, ttfRoundFontUrl, 'round');
  await buildFontFile(woff2SharpFontUrl, ttfSharpFontUrl, 'sharp');

  const assets = JSON.parse(await readFile(core.getInput("assets_path")));

  const baseIconUrl = `${baseUrl}/public`;


  var dartFileContents = createDartFile();
  var scssFileContents = "";
  var typesFileContents = "export type IconName = \n";

  for (const category in assets) {
    const icons = assets[category];
    for (const icon of icons) {
      try {
        const glyph = fs.createReadStream(`${baseIconUrl}/${icon.roundPath}`);

        const unicode = unicodeAcc++;

        const dartIconName = getDartIconName(icon.name);
        const scssIconName = getScssIconName(icon.name);

        const strUnicode = Number(unicode).toString(16);

        dartFileContents += getDartIconDefinition(dartIconName, strUnicode);

        scssFileContents += getScssIconDefinition(scssIconName, strUnicode);

        typesFileContents += getIconTypeDefinition(scssIconName);

        glyph.metadata = {
          unicode: [String.fromCharCode(unicode)],
          name: dartIconName,
        };
        fontStream.write(glyph);
      } catch (e) {
        console.error(`error creating ${icon.name}`);
      }
    }
  }

  fontStream.end();

  dartFileContents += "} \n";

  typesFileContents = typesFileContents.trim();
  typesFileContents += "; \n";

  const dartFilePath = `${baseUrl}/public/build_files/icons.dart`;
  writeToFile(dartFilePath, dartFileContents);

  const scssPath = `${baseUrl}/public/build_files/icons.scss`;
  writeToFile(scssPath, scssFileContents);

  const typesPath = `${baseUrl}/public/build_files/icon-types.ts`;
  writeToFile(typesPath, typesFileContents);

  core.setOutput("ttf_path", ttfFontUrl);
  core.setOutput("woff2_path", woff2FontUrl);
  core.setOutput("dart_path", dartFilePath);
  core.setOutput("scss_path", scssPath);
  core.setOutput("types_path", typesPath);
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

function getScssIconDefinition(iconName, unicode) {
  var def = `.icon-${iconName}::before { \n`;
  def += `  content: "\\${unicode}"; \n`;
  def += `} \n \n`;
  return def;
}

function getIconTypeDefinition(iconName) {
  return `  | "${iconName}" \n`;
}
