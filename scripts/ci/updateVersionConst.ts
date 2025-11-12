import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import packageJson from "../../package.json" with { type: "json" };

interface FileConfig {
  path: string;
  regex: RegExp;
  replacement: string;
}

const updateFile = (config: FileConfig): void => {
  const path = resolve(config.path);

  if (!existsSync(path)) {
    throw new Error(`File not found: ${config.path}`);
  }

  const content = readFileSync(path, "utf-8");

  if (!config.regex.test(content)) {
    throw new Error(`Version pattern not found in ${config.path}`);
  }

  writeFileSync(path, content.replace(config.regex, config.replacement), "utf-8");
};

const updateVersionConst = (): void => {
  try {
    const version = packageJson.version;
    if (!version || !/^\d+\.\d+\.\d+/.test(version)) {
      throw new Error(`Invalid version: ${version}`);
    }

    const configs: FileConfig[] = [
      {
        path: "./index.ts",
        regex: /const\s+version\s*=\s*['"`][^'"`]+['"`]/,
        replacement: `const version = '${version}'`,
      },
      {
        path: "./scripts/fetch-icons/templates/icons.dart.template",
        regex: /const\s+zetaIconsVersion\s*=\s*['"`][^'"`]+['"`];/,
        replacement: `const zetaIconsVersion = '${version}';`,
      },
      {
        path: "./outputs/flutter/icons.g.dart",
        regex: /const\s+zetaIconsVersion\s*=\s*['"`][^'"`]+['"`];/,
        replacement: `const zetaIconsVersion = '${version}';`,
      },
    ];

    configs.forEach(updateFile);
    console.log(`✓ Updated version to ${version}`);
  } catch (error) {
    console.error(`❌ ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};

updateVersionConst();

export default updateVersionConst;
