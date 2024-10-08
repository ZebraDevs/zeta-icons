import ts from "typescript";

export const figmaConnectFile = ts.factory.createExpressionStatement(
  ts.factory.createCallExpression(
    ts.factory.createPropertyAccessExpression(
      ts.factory.createIdentifier("figma"),
      ts.factory.createIdentifier("connect"),
    ),
    undefined,
    [
      ts.factory.createStringLiteral("https://www.figma.com/design/VQ7Aa3rDYB7mgpToI3bZ4D?node-id=123"),
      ts.factory.createObjectLiteralExpression([
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
        ),
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
                  ts.factory.createTemplateTail(">star</zeta-icon>"),
                ),
              ]),
            ),
          ),
        ),
      ]),
    ],
  ),
);
