import iconManifest from "./outputs/icon-manifest.json";
export { ZetaIconNameList } from "./outputs/definitions/icon-types.js";
const convertedIconManifest = new Map(Object.entries(iconManifest));
export { convertedIconManifest as iconManifest };
