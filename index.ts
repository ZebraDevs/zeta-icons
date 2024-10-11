import iconManifest from "./outputs/icon-manifest.json";
import { type IconManifest } from "./scripts/types/customTypes.js";
export { ZetaIconNameList } from "./outputs/web/icon-types.js";

const convertedIconManifest = new Map(Object.entries(iconManifest)) as IconManifest;

export { convertedIconManifest as iconManifest };

export type { ZetaIconName } from "./outputs/web/icon-types.js";
export type * from "./scripts/types/customTypes.js";

// x-release-please-start-version
export const version = "0.6.2";
// x-release-please-end
