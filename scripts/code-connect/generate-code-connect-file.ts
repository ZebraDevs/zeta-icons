import { mkdirSync, writeFileSync } from "fs";
import prettier from "prettier";
import { IconManifest } from "../types/customTypes.js";
import { generateFigmaConnectCall } from "./generate-code-connect-call.js";
import ts from "typescript";
import { getNodeText } from "./get-node-text.js";

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
