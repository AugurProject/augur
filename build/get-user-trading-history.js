"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Look up a user's trading history (should not include open orders, which will have their own endpoint). Should take market, outcome, and orderType as optional parameters. In addition to the "normal" trade data (i.e., the stuff stored in the OrderFilled log on-chain), the response should include the user's position after the trade, in both "raw" and "adjusted-for-user-intention" formats -- the latter meaning that short positions are shown as negative, rather than as positive positions in the other outcomes), realized and unrealized profit/loss, and max possible gain/loss (at market resolution).
function getUserTradingHistory(db, account, market, outcome, orderType, callback) {
}
exports.getUserTradingHistory = getUserTradingHistory;
//# sourceMappingURL=get-user-trading-history.js.map