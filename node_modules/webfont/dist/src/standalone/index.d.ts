import type { InitialOptions } from "../types";
import type { Result } from "../types/Result";
declare type Webfont = (initialOptions?: InitialOptions) => Promise<Result>;
export declare const webfont: Webfont;
export default webfont;
