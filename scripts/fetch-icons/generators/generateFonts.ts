import { Result } from "webfont/dist/src/types/Result.js";
import { FontType, GenerateFontResult } from "../../types/customTypes.js";
import { webfont } from "webfont";
import { writeFileSync } from "fs";
import { createFolder, getIconFileName, toSnakeCase } from "../../utils/fileUtils.js";

const GITHUB_URL = "https://raw.githubusercontent.com/ZebraDevs/zeta-icons/main/outputs/png/";
/**
 * Generates font files from optimized SVGs.
 *
 * This function returns data needed to create Dart / TS output files,
 * as this data needs to link up to unicode values generated in this step.
 *
 * @param {string} inputDir - Location of temporary directory containing optimized SVG files.
 * @param {string} fontName - Name of font to be generated.
 * @param {string} ttfDir - Location to save TTF font files.
 * @param {string} woff2Dir - Location to save WOFF2 font files.
 * @returns {Promise<GenerateFontResult>} Object containing body lines for generating definition files.
 * @throws If any font file was not generated.
 */
export const generateFonts = async (
  inputDir: string,
  fontName: string,
  ttfDir: string,
  woff2Dir: string,
): Promise<GenerateFontResult> => {
  const fontResult: GenerateFontResult = {
    dartDefinitions: [],
    dartRoundDefinitions: [],
    dartSharpDefinitions: [],
    iconNames: [],
  };

  const ttfPath = `${ttfDir}/${fontName}`;
  const woff2Path = `${woff2Dir}/${fontName}`;
  createFolder(ttfDir);
  createFolder(woff2Dir);
  const roundFonts = await buildFontFile("round", fontResult, inputDir);

  if (roundFonts.ttf && roundFonts.woff2) {
    writeFileSync(`${ttfPath}-round.ttf`, roundFonts.ttf);
    writeFileSync(`${woff2Path}-round.woff2`, roundFonts.woff2);
  } else {
    throw new Error(
      "Failed to build round fonts: " + (!roundFonts.ttf ? "ttf " : "") + !roundFonts.woff2 ? "woff2" : "",
    );
  }

  const sharpFonts = await buildFontFile("sharp", fontResult, inputDir);
  if (sharpFonts.ttf && sharpFonts.woff2) {
    writeFileSync(`${ttfPath}-sharp.ttf`, sharpFonts.ttf);
    writeFileSync(`${woff2Path}-sharp.woff2`, sharpFonts.woff2);
  } else {
    throw new Error(
      "Failed to build sharp fonts: " + (!sharpFonts.ttf ? "ttf " : "") + !sharpFonts.woff2 ? "woff2" : "",
    );
  }
  return fontResult;
};

/**
 * Builds font files for either `round` or `sharp` variant using {@link https://github.com/itgalaxy/webfont | webfont}.
 *
 *  This function returns data needed to create Dart / TS output files,
 *  as this data needs to link up to unicode values generated in this step.
 *
 * @param {FontType} type - Round or sharp.
 * @param {GenerateFontResult} fontResult - Object containing body lines for generating definition files.
 * @param {string} inputDir - Location of temporary directory containing optimized SVG files.
 * @returns {Promise<Result>} Object containing built font files.
 */
const buildFontFile = async (type: FontType, fontResult: GenerateFontResult, inputDir: string): Promise<Result> => {
  let unicodeAcc = 0xe001;

  return webfont({
    files: `${inputDir}/*_${type}.svg`,
    fontName: "zeta-icons",
    formats: ["woff2", "ttf"],
    fontId: "zeta-icons",
    glyphTransformFn: (obj) => {
      if (obj.unicode) {
        obj.unicode[0] = String.fromCharCode(unicodeAcc);
        obj.name = obj.unicode[1] = obj.name.replace("_round", "").replace("_sharp", "");

        const strUnicode = Number(unicodeAcc).toString(16);

        if (type === "round") {
          fontResult.dartDefinitions.push(getDartIconDefinition(obj.name, strUnicode, undefined));
          fontResult.dartRoundDefinitions.push(getDartIconDefinition(obj.name, strUnicode, "round"));

          fontResult.iconNames.push(obj.name);
        } else if (type === "sharp") {
          fontResult.dartSharpDefinitions.push(getDartIconDefinition(obj.name, strUnicode, "sharp"));
        }

        unicodeAcc++;
      }
      return obj;
    },
  });
};

/**
 * Generates Dart Icon definition.
 *
 * * Does not contain newline characters.
 * * Does contain spaces for formatting and semi-colons.
 *
 * @param {string} iconName - snake_case formatted name for icon.
 * @param {string} unicode - Unicode value to link icon to font.
 * @param {FontType} type - Round or sharp.
 * @returns {string} Dart definition line used in body of `icons.g.dart`.
 */
function getDartIconDefinition(iconName: string, unicode: string, type: FontType | undefined): string {
  const iconPreview = getIconPreview(iconName, type);

  if (type == undefined) {
    iconName = toSnakeCase(iconName);
  } else {
    iconName = getIconFileName(iconName, type);
  }

  return `${iconPreview}
  static const IconData ${iconName} = IconData(0x${unicode}, fontFamily: family${
    type?.capitalize() ?? ""
  }, fontPackage: package);`;
}

function getIconPreview(iconName: string, type: FontType | undefined) {
  const name_link = `${iconName}_${type === undefined ? "round" : type}`;
  const readableName = iconName
    .split("_")
    .map((e) => e.capitalize())
    .join(" ");
  return `  /// <i> <img width='48' src="${GITHUB_URL}${name_link}.png"></br>${readableName} icon ${
    type != undefined ? `(${type})` : ""
  }</i>`;
}
