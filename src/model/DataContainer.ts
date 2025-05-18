export interface DataContainer<T> {
  dataType: string;
  version: number;
  data: T;
}
