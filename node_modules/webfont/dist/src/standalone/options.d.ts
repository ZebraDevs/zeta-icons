import type { InitialOptions } from "../types/InitialOptions";
import { WebfontOptions } from "../types/WebfontOptions";
declare type OptionsGetter = (initialOptions?: InitialOptions) => WebfontOptions;
export declare const getOptions: OptionsGetter;
export {};
