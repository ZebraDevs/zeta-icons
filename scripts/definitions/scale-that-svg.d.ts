declare module "scale-that-svg" {
  import { Buffer } from "buffer";
  export function scale(input: string | Buffer, scaleOptions: {}): Promise<string>;
}
