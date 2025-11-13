import { ImageManifest, IconManifest } from "../../types.js";
import { DocumentResponse } from "../types/figmaTypes.js";

// Helper to add timeout to fetch
function fetchWithTimeout(resource: RequestInfo, options: RequestInit = {}, timeout = 10000): Promise<Response> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Request timed out"));
    }, timeout);
    fetch(resource, options)
      .then((response) => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

const COLOR_REGEX = /#[0-9A-Fa-f]{6}(?<!000000)/g;
const COLOR_REPLACE_BLACK = "#000000";

/**
 * Fetches a Figma document.
 *
 * @param {string} fileID - The ID of the Figma file.
 * @param {string} accessToken - The token used to access Figma.
 * @returns {DocumentResponse}
 * @throws A network error if the request fails.
 */
export async function getFigmaDocument(fileID: string, accessToken: string): Promise<DocumentResponse> {
  const response = await fetchWithTimeout(
    `https://api.figma.com/v1/files/${fileID}`,
    {
      method: "get",
      headers: {
        "X-Figma-Token": accessToken,
        "Content-Type": "application/json",
      },
    },
    10000,
  );

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
      return (async () => {
        try {
          const response = await fetchWithTimeout(value, {}, 10000);
          const url = await response.text();
          return [key, url];
        } catch (error) {
          console.error(`Error fetching SVG for key ${key}:`, error);
          return [key, ""];
        }
      })();
    }),
  );

  const svgObj: {
    [k: string]: string;
  } = Object.fromEntries(new Map<string, string>(svgTextResponse));

  for (const [iconId, icon] of manifest) {
    allImageFiles.set(iconId, {
      ...icon,
      roundData: svgObj[icon.roundId].replace(COLOR_REGEX, COLOR_REPLACE_BLACK) || "",
      sharpData: svgObj[icon.sharpId].replace(COLOR_REGEX, COLOR_REPLACE_BLACK) || "",
    });
  }

  return allImageFiles;
}

const generateAPICall = (ids: string[], fileID: string, accessToken: string): Promise<Map<string, string>> => {
  return fetchWithTimeout(
    `https://api.figma.com/v1/images/${fileID}?ids=${ids.join(",")}&format=svg`,
    {
      method: "get",
      headers: {
        "X-Figma-Token": accessToken,
        "Content-Type": "application/json",
      },
    },
    10000,
  ).then(async (response) => {
    if (response.status != 200) {
      throw new Error("Failed to fetch Figma images: " + response.statusText);
    }

    return (await response.json()).images;
  });
};
