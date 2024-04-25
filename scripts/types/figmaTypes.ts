export type ComponentSets = Map<string, Component>;

export interface DocumentResponse {
  name: string;
  document: FigmaNode;
  componentSets: object;
}

export interface FigmaNode {
  name: string;
  id: string;
  type: string;
  children: FigmaNode[];
}

export interface Component {
  name: string;
  description: string;
}
