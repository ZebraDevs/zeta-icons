import { mkdirSync, writeFileSync } from "fs";
import prettier from "prettier";
import { IconManifest } from "../types/customTypes.js";
import { generateFigmaConnectCall } from "./generate-code-connect-call.js";
import ts from "typescript";
import { getNodeText } from "./get-node-text.js";

/**
 * Generates a code connect file with code connect calls for each icon in the given icon manifest.
 * @param outputDir The directory to write the code connect file to.
 * @param iconManifest The icon manifest to generate code connect calls for.
 */
export const generateCodeConnectFile = async (outputDir: string, iconManifest: IconManifest) => {
  mkdirSync(outputDir, { recursive: true });

  const codeConnectCalls: ts.ExpressionStatement[] = [];
  iconManifest.forEach((definition, id) => {
    codeConnectCalls.push(generateFigmaConnectCall(definition.name, id));
  });

  const sourceFile = ts.factory.createSourceFile(
    [getImportStatement(), ...codeConnectCalls],
    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None,
  );
  const codeConnectFile = await prettier.format(getNodeText(sourceFile), { parser: "typescript" });

  writeFileSync(`${outputDir}/code-connect.figma.ts`, codeConnectFile);
};

/**
 * import { figma, html } from "@figma/code-connect/html";
 * @returns An import statement for the figma and html modules.
 */
const getImportStatement = () =>
  ts.factory.createImportDeclaration(
    undefined,
    ts.factory.createImportClause(
      false,
      undefined,
      ts.factory.createNamedImports([
        ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier("figma")),
        ts.factory.createImportSpecifier(false, undefined, ts.factory.createIdentifier("html")),
      ]),
    ),
    ts.factory.createStringLiteral("@figma/code-connect/html"),
  );
