import ts from "typescript";

/**
 * Converts a given typescript node into text.
 * @param node The node to convert to text.
 * @returns A string representation of the node.
 */
export const getNodeText = (node: ts.Node): string => {
  return printer.printNode(ts.EmitHint.Unspecified, node, tsFile);
};

const tsFile = ts.createSourceFile("", "", ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
