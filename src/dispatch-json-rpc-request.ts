import { SqlLiteDb, JsonRpcRequest } from "./types";
import { getMarketInfo } from "./get-market-info";
import { getAccountTransferHistory } from "./get-account-transfer-history";

export function dispatchJsonRpcRequest(db: SqlLiteDb, request: JsonRpcRequest, callback: (err?: Error|null, result?: any) => void) {
  switch (request.method) {
    case "getMarketInfo":
      return getMarketInfo(db, request.params.market, callback);
    case "getAccountTransferHistory":
      return getAccountTransferHistory(db, request.params.account, request.params.token, callback);
    default:
      callback(new Error("unknown json rpc method"));
  }
}
