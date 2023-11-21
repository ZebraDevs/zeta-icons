import { GlyphTransformFn } from "./GlyphTransformFn";
import { OptionsBase } from "./OptionsBase";
export declare type InitialOptions = OptionsBase & {
    filePath?: string;
    files: string | Array<string>;
    glyphTransformFn?: GlyphTransformFn;
};
