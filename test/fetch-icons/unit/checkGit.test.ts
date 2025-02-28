import { ChangedFilesDetails, GitChangeType, parseFilesChanged } from "../../../scripts/utils/checkGit";

describe("parseFilesChange test", () => {
  const filesChanged: ChangedFilesDetails[] = [
    { type: GitChangeType.M, path: ".github/fetch_icons/action.yml" },
    { type: GitChangeType.M, path: ".github/fetch_icons/hash.txt" },
    { type: GitChangeType.M, path: ".github/fetch_icons/index.js" },
    { type: GitChangeType.M, path: ".github/workflows/build.yml" },
    { type: GitChangeType.A, path: "outputs/android/ic_mr_worldwide_round.xml" },
    { type: GitChangeType.A, path: "outputs/android/ic_mr_worldwide_sharp.xml" },
    { type: GitChangeType.D, path: "outputs/android/ic_place_maps_round.xml" },
    { type: GitChangeType.D, path: "outputs/android/ic_place_maps_sharp.xml" },
    { type: GitChangeType.M, path: "outputs/android/ic_ppt_attach_sharp.xml" },
    { type: GitChangeType.M, path: "outputs/flutter/assets/zeta-icons-round.ttf" },
    { type: GitChangeType.M, path: "outputs/flutter/assets/zeta-icons-sharp.ttf" },
    { type: GitChangeType.M, path: "outputs/flutter/icons.g.dart" },
    { type: GitChangeType.M, path: "outputs/icon-manifest.json" },
    { type: GitChangeType.M, path: "outputs/icons/file/ppt_attach_round.svg" },
    { type: GitChangeType.M, path: "outputs/icons/file/ppt_attach_sharp.svg" },
    { type: GitChangeType.A, path: "outputs/icons/maps/mr_worldwide_round.svg" },
    { type: GitChangeType.A, path: "outputs/icons/maps/mr_worldwide_sharp.svg" },
    { type: GitChangeType.D, path: "outputs/icons/maps/place_maps_round.svg" },
    { type: GitChangeType.D, path: "outputs/icons/maps/place_maps_sharp.svg" },
    { type: GitChangeType.A, path: "outputs/png/mr_worldwide_round.png" },
    { type: GitChangeType.A, path: "outputs/png/mr_worldwide_sharp.png" },
    { type: GitChangeType.D, path: "outputs/png/place_maps_round.png" },
    { type: GitChangeType.D, path: "outputs/png/place_maps_sharp.png" },
    { type: GitChangeType.M, path: "outputs/png/ppt_attach_round.png" },
    { type: GitChangeType.M, path: "outputs/png/ppt_attach_sharp.png" },
    { type: GitChangeType.M, path: "outputs/web/icon-types.ts" },
    { type: GitChangeType.M, path: "outputs/web/zeta-icons-round.woff2" },
    { type: GitChangeType.M, path: "outputs/web/zeta-icons-sharp.woff2" },
    { type: GitChangeType.M, path: "package.json" },
    { type: GitChangeType.M, path: "scripts/utils/checkGit.ts" },
  ];

  const output = parseFilesChanged(filesChanged);
  console.log(output);
});
