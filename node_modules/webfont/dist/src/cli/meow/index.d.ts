import meow from "meow";
declare const meowCLI: meow.Result<{
    ascent: {
        type: "string";
    };
    centerHorizontally: {
        type: "boolean";
    };
    config: {
        default: any;
    };
    descent: {
        type: "string";
    };
    dest: {
        alias: string;
        default: string;
        type: "string";
    };
    destCreate: {
        alias: string;
        default: false;
        type: "boolean";
    };
    destTemplate: {
        alias: string;
        type: "string";
    };
    fixedWidth: {
        type: "boolean";
    };
    fontHeight: {
        type: "string";
    };
    fontId: {
        type: "string";
    };
    fontName: {
        alias: string;
        type: "string";
    };
    fontStyle: {
        type: "string";
    };
    fontWeight: {
        type: "string";
    };
    formats: {
        alias: string;
    };
    help: {
        alias: string;
        type: "boolean";
    };
    normalize: {
        type: "boolean";
    };
    prependUnicode: {
        type: "boolean";
    };
    round: {
        type: "string";
    };
    sort: {
        default: true;
        type: "boolean";
    };
    startUnicode: {
        type: "string";
    };
    template: {
        alias: string;
        type: "string";
    };
    templateClassName: {
        alias: string;
        type: "string";
    };
    templateFontName: {
        alias: string;
        type: "string";
    };
    addHashInFontUrl: {
        default: false;
        type: "boolean";
    };
    templateFontPath: {
        alias: string;
        type: "string";
    };
    templateCacheString: {
        default: string;
        type: "string";
    };
    verbose: {
        default: false;
        type: "boolean";
    };
    version: {
        alias: string;
        type: "boolean";
    };
}>;
export default meowCLI;
