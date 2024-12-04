import ts from "typescript";
import { ZDS_ASSETS_FILE_ID } from "../../figmaConfig.js";

/**
 * Generates a figma code connect template for a given icon.
 * @param iconName The name of the icon.
 * @param id The id of the icon .
 * @returns A typescript expression containing a call to figma.connect.
 */
export const generateFigmaConnectCall = (iconName: string, id: string): ts.ExpressionStatement => {
  return ts.factory.createExpressionStatement(
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
  );
};

const getFigmaLink = (id: string) => `https://www.figma.com/design/${ZDS_ASSETS_FILE_ID}?node-id=${id}`;

/**
 * props: { rounded: figma.enum("Style", { Round: true, Sharp: false }) }
 * @returns A typescript property assignment containing the props object.
 */
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

/**
 * example: (props) => html`<zeta-icon rounded={props.rounded}>icon name</zeta-icon>
 * @param iconName The name of the icon.
 * @returns A typescript property assignment containing the template.
 */
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
            ts.factory.createTemplateTail(`>${iconName.toLowerCase().replaceAll(" ", "_")}</zeta-icon>`),
          ),
        ]),
      ),
    ),
  );
