/**
 * Fetches a Figma document.
 *
 * @param {string} fileID - The ID of the Figma file.
 * @param {string} accessToken - The token used to access Figma.
 * @returns {DocumentResponse}
 * @throws A network error if the request fails.
 */
export async function getFigmaDocument(fileID, accessToken) {
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
    return (await response.json());
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
export async function getImageFiles(manifest, fileID, accessToken) {
    const ids = [];
    const allImageFiles = new Map();
    manifest.forEach((d) => ids.push(d.roundId, d.sharpId));
    const apiCalls = [];
    const chunkSize = 100;
    for (let i = 0; i < ids.length; i += chunkSize) {
        const chunk = ids.slice(i, i + chunkSize);
        apiCalls.push(generateAPICall(chunk, fileID, accessToken));
    }
    const response = await Promise.all(apiCalls);
    const json = response.reduce((acc, images) => {
        return { ...acc, ...images };
    });
    const svgTextResponse = await Promise.all(Object.entries(json).map(([key, value]) => {
        return fetch(value)
            .then((response) => response.text())
            .then((url) => [key, url]);
    }));
    const svgObj = Object.fromEntries(new Map(svgTextResponse));
    for (const [iconId, icon] of manifest) {
        allImageFiles.set(iconId, { ...icon, roundData: svgObj[icon.roundId], sharpData: svgObj[icon.sharpId] });
    }
    return allImageFiles;
}
const generateAPICall = (ids, fileID, accessToken) => {
    return fetch(`https://api.figma.com/v1/images/${fileID}?ids=${ids.join(",")}&format=svg`, {
        method: "get",
        headers: {
            "X-Figma-Token": accessToken,
            "Content-Type": "application/json",
        },
    }).then(async (response) => {
        if (response.status != 200) {
            console.log(`https://api.figma.com/v1/images/${fileID}?ids=${ids.join(",")}&format=svg`);
            throw new Error("Failed to fetch Figma images: " + response.statusText);
        }
        return (await response.json()).images;
    });
};