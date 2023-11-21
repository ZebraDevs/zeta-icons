export declare type Format = "eot" | "woff" | "woff2" | "svg" | "ttf";
export declare type Formats = Array<Format>;
declare type FormatOption = {
    copyright: null;
    ts: null;
    version: null;
};
export declare type FormatsOptions = Partial<Record<Format, FormatOption>>;
export {};
