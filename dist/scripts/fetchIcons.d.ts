/**
 * Main function to run icons action. For slightly more information, see {@link https://miro.com/app/board/uXjVKUMv1ME=/?share_link_id=952145602435 | Miro }
 *
 * @param {string} figmaToken - Figma authentication token. See {@link https://www.figma.com/developers/api#authentication | Figma API documentation}.
 * @param {string} figmaFileId - Figma file ID to retrieve icons from.
 * @param {string} iconPageName - The name of the icon page from the given Figma file that the icons will be extracted from.
 * @param {string} oldHash - Hash of icons from cache.
 * @param {string} outputDir - Directory to (potentially) save icons to.
 * @param {boolean} verboseLogs - Logs more verbose outputs for testing.
 *
 * @returns {string | undefined} Hash of updated icons. If undefined, icons have not changed.
 */
export default function main(figmaToken: string, figmaFileId: string, iconPageName: string, oldHash: string, outputDir: string, verboseLogs: boolean): Promise<string | undefined>;
