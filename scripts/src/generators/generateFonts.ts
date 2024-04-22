import { Result } from "webfont/dist/src/types/Result.js";
import { FontType, GenerateFontResult } from "../types/customTypes.js";
import { webfont } from "webfont";
import { createFolder, getIconFileName } from "../utils/fileUtils.js";
import { writeFileSync } from "fs";

/**
 * Generates font files from optimized SVGs.
 *
 * This function returns data needed to create Dart / TS output files,
 * as this data needs to link up to unicode values generated in this step.
 *
 * @param {string} inputDir - Location of temporary directory containing optimized SVG files.
 * @param {String} fontOutputDir - Location of font output directory.
 * @returns {Promise<GenerateFontResult>} Object containing body lines for generating definition files.
 * @throws If any font file was not generated.
 */
export const generateFonts = async (inputDir: string, fontOutputDir: string): Promise<GenerateFontResult> => {
  const fontResult: GenerateFontResult = {
    dartRoundTypes: [],
    dartRoundList: [],
    dartSharpTypes: [],
    dartSharpList: [],
    tsTypes: [],
  } as GenerateFontResult;

  const fontName = "zeta-icons";

  const roundFonts = await buildFontFile("round", fontResult, inputDir);
  const sharpFonts = await buildFontFile("sharp", fontResult, inputDir);

  if (roundFonts.ttf && roundFonts.woff2 && sharpFonts.ttf && sharpFonts.woff2) {
    const baseFontPath = `${fontOutputDir}/${fontName}`;
    createFolder(fontOutputDir);

    writeFileSync(`${baseFontPath}-round.ttf`, roundFonts.ttf);
    writeFileSync(`${baseFontPath}-round.woff2`, roundFonts.woff2);
    writeFileSync(`${baseFontPath}-sharp.ttf`, sharpFonts.ttf);
    writeFileSync(`${baseFontPath}-sharp.woff2`, sharpFonts.woff2);
  } else {
    let errorStringBuilder = [];
    if (!roundFonts.ttf) errorStringBuilder.push("round ttf");
    if (!sharpFonts.ttf) errorStringBuilder.push("sharp ttf");
    if (!roundFonts.woff2) errorStringBuilder.push("round woff2");
    if (!sharpFonts.woff2) errorStringBuilder.push("sharp woff2");
    const str = `Font${errorStringBuilder.length > 1 ? "s" : ""} not created: ${errorStringBuilder.join(", ")} `;

    throw new Error(str);
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

        const dartIconName = getIconFileName(obj.name, type);

        const strUnicode = Number(unicodeAcc).toString(16);

        if (type === "round") {
          fontResult.dartRoundTypes.push(getDartIconDefinition(dartIconName, strUnicode, "round"));
          fontResult.dartRoundList.push(getDartIconListItem(dartIconName));

          fontResult.tsTypes.push(obj.name);
        } else if (type === "sharp") {
          fontResult.dartSharpTypes.push(getDartIconDefinition(dartIconName, strUnicode, "sharp"));
          fontResult.dartSharpList.push(getDartIconListItem(dartIconName));
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
 * @returns {string} Dart definition line used in body of `Icons.dart`.
 */
function getDartIconDefinition(iconName: string, unicode: string, type: FontType): string {
  return `  static const IconData ${iconName} = IconData(0x${unicode}, fontFamily: _family${capitalizeFirstLetter(
    type
  )}, fontPackage: _package);`;
}

/**
 * Generates line in dart icons list for an icon.
 *
 * * Does not contain new line characters, or commas.
 * * Does contain spaces for formatting.
 *
 * @param {string} iconName - snake_case formatted name for icon.
 * @returns {string} Dart map item used for list of icons.
 */
function getDartIconListItem(iconName: string): string {
  return `   '${iconName}': ZetaIcons.${iconName}`;
}

/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} string - String to capitalized.
 * @returns {string} Capitalized string.
 */
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
