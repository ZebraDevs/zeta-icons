import fetch from "node-fetch";
import core from "@actions/core";

const fileID = "VQ7Aa3rDYB7mgpToI3bZ4D";

export async function getImageApi(id) {
  const result = await fetch(
    `https://api.figma.com/v1/images/${fileID}?ids=${id}&format=svg`,
    {
      method: "get",
      headers: {
        "X-Figma-Token": core.getInput("figma-access-token"),
        "Content-Type": "application/json",
      },
    }
  );
  const body = await result.json();
  await delay(100);
  try {
    const imageUrl = body.images[id];
    const svgResponse = await fetch(imageUrl);
    return svgResponse.body;
  } catch (error) {
    return "";
  }
}

export async function getDocumentApi() {
  return fetch(`https://api.figma.com/v1/files/${fileID}`, {
    method: "get",
    headers: {
      "X-Figma-Token": core.getInput("figma-access-token"),
      "Content-Type": "application/json",
    },
  });
}

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
