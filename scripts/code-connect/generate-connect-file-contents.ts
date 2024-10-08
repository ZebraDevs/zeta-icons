import ts from "typescript";
import { ZDS_ASSETS_FILE_ID } from "../../figmaConfig.js";

export const generateConnectFileContents = (iconName: string, id: string) => {
  return ts.factory.createSourceFile(
    [
      getImportStatement(),
      ts.factory.createExpressionStatement(
        ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier("figma"),
            ts.factory.createIdentifier("connect"),
          ),
          undefined,
          [
            ts.factory.createStringLiteral(getFigmaLink(id)),
            ts.factory.createObjectLiteralExpression([getPropsObject(), getTemplate(iconName)]),
          ],
        ),
      ),
    ],
    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None,
  );
};

const getFigmaLink = (id: string) => `https://www.figma.com/design/${ZDS_ASSETS_FILE_ID}?node-id=${id}`;

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

const getPropsObject = () =>
  ts.factory.createPropertyAssignment(
    "props",
    ts.factory.createObjectLiteralExpression([
      ts.factory.createPropertyAssignment(
        "rounded",
        ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier("figma"),
            ts.factory.createIdentifier("enum"),
          ),
          undefined,
          [
            ts.factory.createStringLiteral("Style"),
            ts.factory.createObjectLiteralExpression([
              ts.factory.createPropertyAssignment("Round", ts.factory.createTrue()),
              ts.factory.createPropertyAssignment("Sharp", ts.factory.createFalse()),
            ]),
          ],
        ),
      ),
    ]),
  );

const getTemplate = (iconName: string) =>
  ts.factory.createPropertyAssignment(
    "example",
    ts.factory.createArrowFunction(
      undefined,
      undefined,
      [ts.factory.createParameterDeclaration(undefined, undefined, "props")],
      undefined,
      undefined,
      ts.factory.createTaggedTemplateExpression(
        ts.factory.createIdentifier("html"),
        undefined,
        ts.factory.createTemplateExpression(ts.factory.createTemplateHead("<zeta-icon rounded="), [
          ts.factory.createTemplateSpan(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createIdentifier("props"),
              ts.factory.createIdentifier("rounded"),
            ),
            ts.factory.createTemplateTail(`>${iconName.toLowerCase().replace(" ", "-")}</zeta-icon>`),
          ),
        ]),
      ),
    ),
  );
