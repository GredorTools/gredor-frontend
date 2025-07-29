import { TaxonomyRootName } from "@/model/taxonomy/TaxonomyItem.ts";

export interface CalculationNode {
  concept: {
    name: string;
    label: string;
  };
  weight?: string;
  balance?: "credit" | "debit";
  children: CalculationNode[];
  childrenFlat: CalculationNode[];
}

export interface CalculationConceptValue {
  conceptName: string;
  value: number;
}

export class CalculationProcessor {
  private readonly calculationTree: CalculationNode[];
  private readonly nodes: Map<string, CalculationNode>; // <conceptName, node>

  constructor(
    rootName: TaxonomyRootName,
    calculationJson: {
      calculation: unknown[][];
    },
  ) {
    this.calculationTree = CalculationParser.parse(rootName, calculationJson);

    this.nodes = new Map<string, CalculationNode>();
    this.buildNodeMap(this.calculationTree, this.nodes);
  }

  /**
   * Beräknar värdet för en given konceptnamn baserat på angivna värden.
   *
   * @param conceptName - Namnet på det koncept som ska beräknas.
   * @param values - En lista med värden för respektive koncept.
   * @returns Det beräknade värdet för det angivna konceptet.
   */
  public calculateForConcept(
    conceptName: string,
    values: CalculationConceptValue[],
  ): number {
    const valueMap = new Map(values.map((v) => [v.conceptName, v.value]));
    const node = this.nodes.get(conceptName);
    if (!node) {
      throw new Error(`Concept ${conceptName} not found in calculation tree`);
    }
    return this.calculateNode(node, valueMap);
  }

  /**
   * Avgör om ett koncept är ett lövnod.
   *
   * @param conceptName - Namnet på det koncept som ska kontrolleras.
   * @returns Sant om konceptet är ett lövnod, annars falskt.
   */
  public isLeafConcept(conceptName: string): boolean {
    const node = this.nodes.get(conceptName);
    return !node || !node.children || node.children.length === 0;
  }

  /**
   * Avgör om ett koncept ingår i beräkningen av ett annat koncepts värde.
   *
   * @param conceptNames - Namnet på det koncept eller de koncept som man vill
   * veta huruvida det/de ingår i summakonceptet `sumConceptName`
   * @param sumConceptName - Namnet på summakonceptet
   * @returns Huruvida något `conceptName` ingår i beräkningen av
   * `sumConceptName`
   */
  public isConceptIncludedInSum(
    conceptNames: string | string[],
    sumConceptName: string,
  ): boolean {
    if (!Array.isArray(conceptNames)) {
      conceptNames = [conceptNames];
    }

    const sumNode = this.nodes.get(sumConceptName);
    for (const sumNodeChild of sumNode?.childrenFlat ?? []) {
      if (conceptNames.includes(sumNodeChild.concept.name)) {
        return true;
      }
    }

    return false;
  }

  private calculateNode(
    node: CalculationNode,
    valueMap: Map<string, number>,
  ): number {
    // Om det är en leaf-nod, returnera dess värde från värdemappningen
    if (!node.children || node.children.length === 0) {
      return valueMap.get(node.concept.name) || 0;
    }

    // Beräkna summan av barnen
    let sum = 0;
    for (const child of node.children) {
      const childValue = this.calculateNode(child, valueMap);
      const weight = parseFloat(child.weight || "1");
      sum += childValue * weight;
    }

    return sum;
  }

  private buildNodeMap(
    nodes: CalculationNode[],
    map: Map<string, CalculationNode>,
  ): void {
    for (const node of nodes) {
      this.nodes.set(node.concept.name, node);
      if (node.children) {
        this.buildNodeMap(node.children, map);
      }
    }
  }
}

class CalculationParser {
  static parse(
    rootName: TaxonomyRootName,
    jsonData: { calculation: unknown[][] },
  ): CalculationNode[] {
    const result: CalculationNode[] = [];
    for (const calculationArray of jsonData.calculation) {
      if (
        !Array.isArray(calculationArray) ||
        calculationArray[0] !== "linkRole"
      ) {
        throw new Error("Invalid calculation data");
      }

      const linkRoleData = calculationArray[1] as { role: string };
      if (linkRoleData.role !== rootName) {
        continue;
      }

      // Hitta "concept"-noder som är rötterna
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
      children: [],
      childrenFlat: [],
    };

    if (attributes.weight) {
      node.weight = attributes.weight;
    }

    if (attributes.balance) {
      node.balance = attributes.balance;
    }

    // Bearbeta barn (allt efter de första 3 elementen)
    const children = nodeArray
      .slice(3)
      .filter(
        (item): item is unknown[] =>
          Array.isArray(item) && item[0] === "concept",
      )
      .map((childArray) => this.parseNode(childArray));

    if (children.length > 0) {
      node.children = children;
      node.childrenFlat = node.children
        .map((child) => [child, ...child.childrenFlat])
        .flat();
    }

    return node;
  }
}

export async function createNewCalculationProcessor(
  rootName: TaxonomyRootName,
): Promise<CalculationProcessor> {
  const calculationJson = await import(
    "@/data/taxonomy/k2/2021-10-31/calculation.json"
  );
  return new CalculationProcessor(rootName, calculationJson);
}
