import * as t from "io-ts";

export const SortLimit = t.partial({
  sortBy: t.string,
  isSortDescending: t.boolean,
  limit: t.number,
  offset: t.number,
});

export interface JsonRpcRequest {
  id: string | number | null;
  jsonrpc: string;
  method: string;
  params: any;
}

export interface EndpointSettings {
  httpPort: number;
  httpsPort: number;
  wsPort: number;
  wssPort: number;
  certificateFile: string;
  certificateKeyFile: string;
}
