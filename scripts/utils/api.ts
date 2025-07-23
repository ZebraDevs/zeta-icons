import { ImageManifest, IconManifest } from "../../types.js";
import { DocumentResponse } from "../types/figmaTypes.js";

/**
 * Fetches a Figma document.
 *
 * @param {string} fileID - The ID of the Figma file.
 * @param {string} accessToken - The token used to access Figma.
 * @returns {DocumentResponse}
 * @throws A network error if the request fails.
 */
export async function getFigmaDocument(fileID: string, accessToken: string): Promise<DocumentResponse> {
  const response = await fetch(`https://api.figma.com/v1/files/${fileID}`, {
    method: "get",
    headers: {
      "X-Figma-Token": accessToken,
      "Content-Type": "application/json",
    },
  });

  if (response.status != 200) {
    throw new Error(`Failed to fetch Figma document: ${response.statusText}`);
  }
  return (await response.json()) as DocumentResponse;
}

/**
 * Fetches all the images of the icons in `manifest` using the roundId and sharpId of each icon.
 *
 * @param {IconManifest} manifest - The manifest of all the icons to be fetched.
 * @param {string} fileID - The ID of the Figma file.
 * @param {string} accessToken - The token used to access Figma.
 * @returns {ImageManifest} A copy of `manifest` containing the contents of the image files for each icon saved under `roundData` and `sharpData`.
 * @throws A network error if the request fails.
 */
export async function getImageFiles(
  manifest: IconManifest,
  fileID: string,
  accessToken: string,
): Promise<ImageManifest> {
  const ids: string[] = [];
  const allImageFiles: ImageManifest = new Map() as ImageManifest;

  manifest.forEach((d) => ids.push(d.roundId, d.sharpId));

  const apiCalls = [];
  const chunkSize = 100;
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    apiCalls.push(generateAPICall(chunk, fileID, accessToken));
  }

  const response = await Promise.all(apiCalls);

  const json: Map<string, string> = response.reduce((acc, images) => {
    return { ...acc, ...images };
  });

  const svgTextResponse: any[] = await Promise.all(
    Object.entries(json).map(([key, value]) => {
      return fetch(value)
        .then((response: Response) => response.text())
        .then((url: string) => [key, url]);
    }),
  );

  const svgObj: {
    [k: string]: string;
  } = Object.fromEntries(new Map<string, string>(svgTextResponse));

  for (const [iconId, icon] of manifest) {
    allImageFiles.set(iconId, {
      ...icon,
      roundData: svgObj[icon.roundId].replace(/#[0-9A-Fa-f]{6}/g, "#000000"),
      sharpData: svgObj[icon.sharpId].replace(/#[0-9A-Fa-f]{6}/g, "#000000"),
    });
  }

  return allImageFiles;
}

const generateAPICall = (ids: string[], fileID: string, accessToken: string): Promise<Map<string, string>> => {
  return fetch(`https://api.figma.com/v1/images/${fileID}?ids=${ids.join(",")}&format=svg`, {
    method: "get",
    headers: {
      "X-Figma-Token": accessToken,
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    if (response.status != 200) {
      throw new Error("Failed to fetch Figma images: " + response.statusText);
    }

    return (await response.json()).images;
  });
};
