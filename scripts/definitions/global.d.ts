export {};

declare global {
  interface String {
    toSnakeCase(separator?: string): string;
    capitalize(): string;
  }
  interface SVGFixer {
    fix(): any;
  }
}
