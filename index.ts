import iconManifest from "./outputs/icon-manifest.json";
import { IconManifest } from "./scripts/types/customTypes.js";
export { ZetaIconNameList } from "./outputs/definitions/icon-types.js";

const convertedIconManifest = new Map(Object.entries(iconManifest)) as IconManifest;

export { convertedIconManifest as iconManifest };

export type { ZetaIconName } from "./outputs/definitions/icon-types.js";
export type * from "./scripts/types/customTypes.js";
