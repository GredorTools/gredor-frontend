// Typer för konceptegenskaper
import { markRaw } from "vue";
import { type CalculationProcessor, createNewCalculationProcessor } from "@/util/CalculationProcessor.ts";

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

export type LabelType =
  | "periodEndLabel"
  | "periodStartLabel"
  | "terseLabel"
  | "totalLabel"
  | "verboseLabel"
  | undefined;

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
  "pref.Label": LabelType;
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
    labelType?: string;
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
  public readonly calculationProcessor: CalculationProcessor;
  public readonly rootName: TaxonomyRootName;
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
      // Använd en tom sträng som standard för pref.Label
      const key = this.generateKey(xmlName);
      this.items.set(key, {
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

  getItem(name: string, labelType: string = ""): TaxonomyItem {
    const key = this.generateKey(name, labelType);
    const result = this.items.get(key);
    if (result === undefined) {
      throw new Error(
        `Item not found: "${name}" with labelType: "${labelType}"`,
      );
    }
    return markRaw(result);
  }

  getRoot(): TaxonomyItem {
    return markRaw(this.hierarchy);
  }

  private generateKey(xmlName: string, labelType: string = ""): string {
    return `${xmlName}|${labelType}`;
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
      const [type, metadata, details, ...childGroups] = node;

      if (type !== "concept") {
        throw new Error(`Unexpected node type: ${type}`);
      }

      const labelType = details["pref.Label"] || "";
      let item: TaxonomyItem;
      try {
        item = this.getItem(metadata.name, labelType);
      } catch {
        // Posten finns inte redan sparad, eller i alla fall inte med samma pref.Label
        const originalItem = this.getItem(metadata.name); // Variant av posten utan pref.Label
        item = {
          xmlName: originalItem.xmlName,
          properties: originalItem.properties,
          additionalData: {},
          children: originalItem.children,
          childrenFlat: originalItem.childrenFlat,
          rowNumber: -1,
          level: -1,
        };
        const key = this.generateKey(metadata.name, labelType);
        this.items.set(key, item);
      }

      // Sätt parent
      if (item.parent != null) {
        // TODO: Kasta fel efter fixat
        if (item.parent === parent) {
          console.log(
            `Item already has a parent: ${this.rootName} -- ${item.xmlName}`,
          );
        } else {
          console.warn(
            `Item already has a parent: ${this.rootName} -- ${item.xmlName} -- ${item.parent.xmlName} -> ${parent.xmlName}`,
          );
        }
      }
      item.parent = parent;
      item.rowNumber = numRowsProcessed++;
      item.level = level;

      // Sätt extra data
      if (!this.calculationProcessor.isLeafConcept(item.xmlName)) {
        item.additionalData.isTotalItem = true;
      }
      item.additionalData.displayLabel =
        metadata.label || item.properties.label;
      item.additionalData.labelType = details["pref.Label"];

      // Sätt barn
      for (const childGroup of childGroups) {
        item.children.push(processNode(childGroup, item, level + 1));
      }

      for (const child of item.children) {
        item.childrenFlat.push(child);
        item.childrenFlat.push(...child.childrenFlat);
      }

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
    await createNewCalculationProcessor(rootName),
  );
  taxonomyManagerSingletons.set(rootName, taxonomyManager);
  return taxonomyManager;
}

const taxonomyManagerSingletons = new Map<TaxonomyRootName, TaxonomyManager>();
