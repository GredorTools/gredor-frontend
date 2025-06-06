export interface CalculationNode {
  concept: {
    name: string;
    label: string;
  };
  weight?: string;
  balance?: "credit" | "debit";
  children?: CalculationNode[];
}

export interface CalculationConceptValue {
  conceptName: string;
  value: number;
}

export class CalculationProcessor {
  private readonly calculationTree: CalculationNode[];

  constructor(calculationJson: { calculation: unknown[][] }) {
    this.calculationTree = CalculationParser.parse(calculationJson);
  }

  calculateForConcept(
    conceptName: string,
    values: CalculationConceptValue[],
  ): number {
    const valueMap = new Map(values.map((v) => [v.conceptName, v.value]));
    const node = this.findNodeByConceptName(conceptName, this.calculationTree);
    if (!node) {
      throw new Error(`Concept ${conceptName} not found in calculation tree`);
    }
    return this.calculateNode(node, valueMap);
  }

  isLeafConcept(conceptName: string): boolean {
    const node = this.findNodeByConceptName(conceptName, this.calculationTree);
    return !node || !node.children || node.children.length === 0;
  }

  private findNodeByConceptName(
    conceptName: string,
    nodes: CalculationNode[],
  ): CalculationNode | null {
    for (const node of nodes) {
      if (node.concept.name === conceptName) {
        return node;
      }
      if (node.children) {
        const found = this.findNodeByConceptName(conceptName, node.children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  private calculateNode(
    node: CalculationNode,
    valueMap: Map<string, number>,
  ): number {
    // If it's a leaf node, return its value from the value map
    if (!node.children || node.children.length === 0) {
      return valueMap.get(node.concept.name) || 0;
    }

    // Calculate sum of children
    let sum = 0;
    for (const child of node.children) {
      const childValue = this.calculateNode(child, valueMap);
      const weight = parseFloat(child.weight || "1");
      sum += childValue * weight;
    }

    return sum;
  }
}

class CalculationParser {
  static parse(jsonData: { calculation: unknown[][] }): CalculationNode[] {
    const result: CalculationNode[] = [];
    for (const calculationArray of jsonData.calculation) {
      if (!Array.isArray(calculationArray)) {
        throw new Error("Invalid calculation data");
      }

      // Find the "concept" nodes which are the roots
      let foundRoot = false;
      for (const item of calculationArray) {
        if (Array.isArray(item) && item[0] === "concept") {
          result.push(this.parseNode(item as unknown[]));
          foundRoot = true;
        }
      }

      if (!foundRoot) {
        throw new Error("No root concept found in calculation");
      }
    }
    return result;
  }

  private static parseNode(nodeArray: unknown[]): CalculationNode {
    if (!Array.isArray(nodeArray) || nodeArray[0] !== "concept") {
      throw new Error("Invalid node format");
    }

    const conceptInfo = nodeArray[1] as { name: string; label: string };
    const attributes = nodeArray[2] as {
      weight?: string;
      balance?: "credit" | "debit";
    };

    const node: CalculationNode = {
      concept: {
        name: conceptInfo.name,
        label: conceptInfo.label,
      },
    };

    if (attributes.weight) {
      node.weight = attributes.weight;
    }

    if (attributes.balance) {
      node.balance = attributes.balance;
    }

    // Process children (everything after the first 3 elements)
    const children = nodeArray
      .slice(3)
      .filter(
        (item): item is unknown[] =>
          Array.isArray(item) && item[0] === "concept",
      )
      .map((childArray) => this.parseNode(childArray));

    if (children.length > 0) {
      node.children = children;
    }

    return node;
  }
}

export async function getCalculationProcessor(): Promise<CalculationProcessor> {
  if (calculationProcessorSingleton !== undefined) {
    return calculationProcessorSingleton;
  }

  const calculationJson = await import(
    "@/data/taxonomy/k2/2021-10-31/calculation.json"
  );
  calculationProcessorSingleton = new CalculationProcessor(calculationJson);
  return calculationProcessorSingleton;
}

let calculationProcessorSingleton: CalculationProcessor | undefined;
