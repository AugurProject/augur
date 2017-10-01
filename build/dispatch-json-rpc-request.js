"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_market_info_1 = require("./get-market-info");
const get_account_transfer_history_1 = require("./get-account-transfer-history");
function dispatchJsonRpcRequest(db, request, callback) {
    switch (request.method) {
        case "getMarketInfo":
            return get_market_info_1.getMarketInfo(db, request.params.market, callback);
        case "getAccountTransferHistory":
            return get_account_transfer_history_1.getAccountTransferHistory(db, request.params.account, request.params.token, callback);
        default:
            callback(new Error("unknown json rpc method"));
    }
}
exports.dispatchJsonRpcRequest = dispatchJsonRpcRequest;
//# sourceMappingURL=dispatch-json-rpc-request.js.map