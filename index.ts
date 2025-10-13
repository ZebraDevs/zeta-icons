import iconManifest from "./outputs/icon-manifest.json" with { type: "json" };
import { type IconManifest } from "./types.js";
export { ZetaIconNameList } from "./outputs/web/icon-types.js";

const convertedIconManifest = new Map(Object.entries(iconManifest)) as IconManifest;

export { convertedIconManifest as iconManifest };

export type { ZetaIconName } from "./outputs/web/icon-types.js";
export type * from "./types.js";

// x-release-please-start-version
export const version = "1.3.0";
// x-release-please-end
