import { expect } from "chai";
import { parseFilesChanged } from "../../../scripts/utils/checkGit";

describe("parseFilesChange test", () => {
  it("should return icon changes correctly", () => {
    const filesChanged: Object[] = [
      { type: "M", path: ".github/fetch_icons/action.yml" },
      { type: "M", path: ".github/fetch_icons/hash.txt" },
      { type: "M", path: ".github/fetch_icons/index.js" },
      { type: "M", path: ".github/workflows/build.yml" },
      { type: "A", path: "outputs/android/ic_mr_worldwide_round.xml" },
      { type: "A", path: "outputs/android/ic_mr_worldwide_sharp.xml" },
      { type: "D", path: "outputs/android/ic_place_maps_round.xml" },
      { type: "D", path: "outputs/android/ic_place_maps_sharp.xml" },
      { type: "M", path: "outputs/android/ic_ppt_attach_sharp.xml" },
      { type: "M", path: "outputs/flutter/assets/zeta-icons-round.ttf" },
      { type: "M", path: "outputs/flutter/assets/zeta-icons-sharp.ttf" },
      { type: "M", path: "outputs/flutter/icons.g.dart" },
      { type: "M", path: "outputs/icon-manifest.json" },
      { type: "M", path: "outputs/icons/file/ppt_attach_round.svg" },
      { type: "M", path: "outputs/icons/file/ppt_attach_sharp.svg" },
      { type: "A", path: "outputs/icons/maps/mr_worldwide_round.svg" },
      { type: "A", path: "outputs/icons/maps/mr_worldwide_sharp.svg" },
      { type: "D", path: "outputs/icons/maps/place_maps_round.svg" },
      { type: "D", path: "outputs/icons/maps/place_maps_sharp.svg" },
      { type: "A", path: "outputs/png/mr_worldwide_round.png" },
      { type: "A", path: "outputs/png/mr_worldwide_sharp.png" },
      { type: "D", path: "outputs/png/place_maps_round.png" },
      { type: "D", path: "outputs/png/place_maps_sharp.png" },
      { type: "M", path: "outputs/png/ppt_attach_round.png" },
      { type: "M", path: "outputs/png/ppt_attach_sharp.png" },
      { type: "M", path: "outputs/web/icon-types.ts" },
      { type: "M", path: "outputs/web/zeta-icons-round.woff2" },
      { type: "M", path: "outputs/web/zeta-icons-sharp.woff2" },
      { type: "M", path: "package.json" },
      { type: "M", path: "scripts/utils/checkGit.ts" },
    ];

    const output = parseFilesChanged(filesChanged as []);

    expect(output.trim()).to.equal(
      `<h2>Icons added:</h2> <ul><li>Maps / Mr Worldwide / Round</li><li>Maps / Mr Worldwide / Sharp</li></ul><h2>Icons updated:</h2> <ul><li>File / Ppt Attach / Round</li><li>File / Ppt Attach / Sharp</li></ul><h2>Icons deleted:</h2> <ul><li>Maps / Place Maps / Round</li><li>Maps / Place Maps / Sharp</li></ul>
iconadd(Maps): Mr Worldwide (round)
iconadd(Maps): Mr Worldwide (sharp)
iconupdate(File): Ppt Attach (round)
iconupdate(File): Ppt Attach (sharp)
iconremove(Maps): Place Maps (round)
iconremove(Maps): Place Maps (sharp)`,
    );
  });
});
