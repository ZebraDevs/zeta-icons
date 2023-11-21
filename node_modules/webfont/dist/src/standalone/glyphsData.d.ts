import type { GlyphData, WebfontOptions } from "../types";
declare type GlyphsDataGetter = (files: Array<GlyphData["srcPath"]>, options: WebfontOptions) => unknown;
export declare const getGlyphsData: GlyphsDataGetter;
export {};
