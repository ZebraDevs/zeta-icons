import { assert } from "chai";
import { FontType, IconManifest } from "../../scripts/types/customTypes.js";
import { existsSync } from "fs";

export function checkIconsExist(manifest: IconManifest) {
  manifest.forEach((definition) => {
    assert.equal(existsSync(definition.roundPath), true);
    assert.equal(existsSync(definition.sharpPath), true);
  });
}

export function checkFontsExist(fontName: string, dartDir: string, tsDir: string) {
  assert.equal(fontExists("ttf", "round", fontName, dartDir), true);
  assert.equal(fontExists("ttf", "sharp", fontName, dartDir), true);
  assert.equal(fontExists("woff2", "round", fontName, tsDir), true);
  assert.equal(fontExists("woff2", "sharp", fontName, tsDir), true);
}

function fontExists(format: string, type: FontType, fontName: string, dir: string): boolean {
  return existsSync(`${dir}/${fontName}-${type}.${format}`);
}
