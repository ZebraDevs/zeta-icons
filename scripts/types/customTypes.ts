export interface IconDefinition {
  name: string;
  searchTerms: string[];
  category: string;
  roundPath: string;
  sharpPath: string;
  roundId: string;
  sharpId: string;
}

export interface ImageDefinition extends IconDefinition {
  roundData: string;
  sharpData: string;
}
export interface FontDefinition extends IconDefinition {
  roundUnicode: string;
  sharpUnicode: string;
}

export interface GenerateFontResult {
  dartRoundTypes: string[];
  dartRoundList: string[];
  dartSharpTypes: string[];
  dartSharpList: string[];
  tsTypes: string[];
}

export type IconManifest = Map<string, IconDefinition>;

export type ImageManifest = Map<string, ImageDefinition>;

export type FontManifest = Map<string, ImageDefinition>;

export type FontType = "round" | "sharp";
