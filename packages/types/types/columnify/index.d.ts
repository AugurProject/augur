declare module "columnify" {
  declare function columnify(data: { [key: string]: any } | any[], options?: columnify.GlobalOptions): string;

  export interface Options {
    align?: string;
    minWidth?: number;
    maxWidth?: number;
    paddingChr?: string;
    preserveNewLines?: boolean;
    truncateMarker?: string;
    showHeaders?: boolean;
    dataTransform?: (data: string) => string;
    headingTransform?: (data: string) => string;
  }

  export interface GlobalOptions extends Options {
    columns?: string[];
    columnSplitter?: string;
    config?: {
      [columnName: string]: Options;
    }
  }

  export = columnify;
}
