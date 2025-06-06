// Typer för konceptegenskaper
import { markRaw } from "vue";
import {
  type CalculationProcessor,
  getCalculationProcessor,
} from "@/util/CalculationProcessor.ts";

// Typ för TaxonomyItemType
export type TaxonomyItemType =
  | "string"
  | "enum:enumerationItemType"
  | "num:areaItemType"
  | "nonnum:domainItemType"
  | "nonnum:textBlockItemType"
  | "xbrli:booleanItemType"
  | "xbrli:dateItemType"
  | "xbrli:decimalItemType"
  | "xbrli:gYearMonthItemType"
  | "xbrli:monetaryItemType"
  | "xbrli:pureItemType"
  | "xbrli:sharesItemType"
  | "xbrli:stringItemType"
  | "xsd:anyType"
  | `${string}@anonymousType`
  | "gredor:section";

// Typ för TaxonomyRootName
export enum TaxonomyRootName {
  ALLMAN_INFORMATION = "http://www.taxonomier.se/se/fr/gaap/k2/role/form/allmaninformation",
  BALANSRAKNING = "http://www.taxonomier.se/se/fr/gaap/k2/role/form/balansrakning",
  FORVALTNINGSBERATTELSE = "http://www.taxonomier.se/se/fr/gaap/k2/role/form/forvaltningsberattelse",
  KASSAFLODESANALYS = "http://www.taxonomier.se/se/fr/gaap/k2/role/form/kassaflodesanalys",
  RESULTATRAKNING_KOSTNADSSLAGSINDELAD = "http://www.taxonomier.se/se/fr/gaap/k2/role/form/resultatrakning/kostnadsslagsindelad",
  NOTER = "http://www.taxonomier.se/se/fr/gaap/k2/role/form/noter",
  UNDERTECKNANDE_FORETRADARE_REVISIONSPATECKNING = "http://www.taxonomier.se/se/fr/gaap/k2/role/form/undertecknande/foretradarerevisionspateckning",
}

// Gränssnitt för konceptegenskaper
interface ConceptProperties<T extends TaxonomyItemType = TaxonomyItemType> {
  abstract: "true" | "false";
  balance?: "debit" | "credit";
  documentation?: string;
  facets?: string;
  iD: string;
  label: string;
  name: string;
  namespace: string;
  nillable: "true" | "false";
  periodType?: "duration" | "instant";
  substitutionGroup?: string;
  type: T;
}

// Struktur för presentationsmetadata
interface PresentationLinkRoleMetadata {
  definition: string;
  role: string;
}

interface PresentationConceptMetadata {
  label: string;
  name: string;
}

interface PresentationConceptDetails {
  "pref.Label": string;
  references: string;
  type: string;
}

// Huvudstruktur för taxonomiposter
export interface TaxonomyItem<T extends TaxonomyItemType = TaxonomyItemType> {
  xmlName: string;
  properties: ConceptProperties<T>;
  metadata?: PresentationLinkRoleMetadata;
  additionalData: {
    isTotalItem?: boolean;
    displayLabel?: string;
  };
  rowNumber: number;
  level: number;
  children: TaxonomyItem[];
  childrenFlat: TaxonomyItem[];
  parent?: TaxonomyItem;
}

// JSON-typer
interface ConceptsJson {
  concepts: ConceptsJsonData[];
}

type ConceptsJsonData = [Record<never, never>, ConceptProperties];

interface PresentationJson {
  presentation: PresentationJsonLinkRole[];
}

type PresentationJsonLinkRole = [
  "linkRole",
  PresentationLinkRoleMetadata,
  Record<never, never>,
  ...PresentationJsonConcept[],
];

type PresentationJsonConcept = [
  "concept",
  PresentationConceptMetadata,
  PresentationConceptDetails,
  ...PresentationJsonConcept[],
];

// Hjälpklass för att hantera taxonomiposter
export class TaxonomyManager {
  private readonly rootName: TaxonomyRootName;
  private readonly calculationProcessor: CalculationProcessor;
  private items: Map<string, TaxonomyItem>;
  private hierarchy: TaxonomyItem;

  constructor(
    rootName: TaxonomyRootName,
    conceptsJson: ConceptsJson,
    presentationJson: PresentationJson,
    calculationProcessor: CalculationProcessor,
  ) {
    this.rootName = rootName;
    this.calculationProcessor = calculationProcessor;
    this.items = new Map();

    for (const concept of conceptsJson.concepts) {
      const xmlName = concept[1].iD.replace("_", ":");
      this.items.set(xmlName, {
        xmlName,
        properties: concept[1],
        additionalData: {},
        children: [],
        childrenFlat: [],
        rowNumber: -1,
        level: -1,
      });
    }

    this.hierarchy = this.buildHierarchy(presentationJson.presentation);
  }

  getItem(name: string): TaxonomyItem {
    const result = this.items.get(name);
    if (result === undefined) {
      throw new Error(`Item not found: ${name}`);
    }
    return markRaw(result);
  }

  getRoot(): TaxonomyItem {
    return markRaw(this.hierarchy);
  }

  private buildHierarchy(
    presentationData: PresentationJsonLinkRole[],
  ): TaxonomyItem {
    let numRowsProcessed = 0;

    const processNode = (
      node: PresentationJsonConcept,
      parent: TaxonomyItem,
      level: number,
    ): TaxonomyItem => {
      const [type, metadata, , ...childGroups] = node;

      if (type !== "concept") {
        throw new Error(`Unexpected node type: ${type}`);
      }

      const item = this.getItem(metadata.name);
      if (item === undefined) {
        throw new Error(`Item not found: ${metadata.name}`);
      }

      // Sätt parent
      item.parent = parent;
      item.rowNumber = numRowsProcessed++;
      item.level = level;

      // Sätt extra data
      if (!this.calculationProcessor.isLeafConcept(item.xmlName)) {
        item.additionalData.isTotalItem = true;
      }
      item.additionalData.displayLabel =
        metadata.label || item.properties.label;

      // Sätt barn
      for (const childGroup of childGroups) {
        item.children = (item.children || []).concat(
          processNode(childGroup, item, level + 1),
        );
      }

      item.childrenFlat = item.children
        .map((child) => [child, ...child.childrenFlat])
        .flat();

      // Returnera
      return item;
    };

    // Bearbeta presentationsdata
    for (const section of presentationData) {
      const [type, metadata, , ...childGroups] = section;

      if (type !== "linkRole") {
        throw new Error(`Unexpected section type: ${type}`);
      }
      if (metadata.role !== this.rootName) {
        continue;
      }

      const rootItem: TaxonomyItem<"gredor:section"> = {
        xmlName: metadata.role || "",
        properties: {
          name: metadata.role || "",
          label: metadata.definition || "",
          iD: metadata.role || "",
          type: "gredor:section",
        },
        metadata: {
          definition: metadata.definition,
          role: metadata.role,
        },
        additionalData: {},
        rowNumber: -1,
        level: -1,
        children: [],
        childrenFlat: [],
      };

      rootItem.children = childGroups.map((childGroup) =>
        processNode(childGroup, rootItem, 0),
      );
      rootItem.childrenFlat = rootItem.children
        .map((child) => [child, ...child.childrenFlat])
        .flat();

      return rootItem;
    }

    throw new Error(`Root not found: ${this.rootName}`);
  }
}

export async function getTaxonomyManager(
  rootName: TaxonomyRootName,
): Promise<TaxonomyManager> {
  let taxonomyManager = taxonomyManagerSingletons.get(rootName);
  if (taxonomyManager) {
    return taxonomyManager;
  }

  // Skapa ny TaxonomyManager
  taxonomyManager = new TaxonomyManager(
    rootName,
    (await import(
      "@/data/taxonomy/k2/2021-10-31/concepts.json"
    )) as ConceptsJson,
    (await import(
      "@/data/taxonomy/k2/2021-10-31/presentation.json"
    )) as PresentationJson,
    await getCalculationProcessor(),
  );
  taxonomyManagerSingletons.set(rootName, taxonomyManager);
  return taxonomyManager;
}

const taxonomyManagerSingletons = new Map<TaxonomyRootName, TaxonomyManager>();
