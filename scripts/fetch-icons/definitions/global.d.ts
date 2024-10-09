export {};

declare global {
  interface String {
    capitalize(): string;
  }
  interface SVGFixer {
    fix(): any;
  }
}
