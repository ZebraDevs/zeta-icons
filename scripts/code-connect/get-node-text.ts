import ts from "typescript";

export const getNodeText = (node: ts.Node): string => {
  return printer.printNode(ts.EmitHint.Unspecified, node, tsFile);
};

const tsFile = ts.createSourceFile("", "", ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
