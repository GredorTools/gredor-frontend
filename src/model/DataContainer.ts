export type DataType = "arsredovisning_utkast" | "arsredovisning_fardig";

export interface DataContainer<T> {
  dataType: DataType;
  version: number;
  data: T;
}
