"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Input: Date Range
// Output: Markets Closing in Range
function getMarketsClosingInDateRange(db, earliestClosingTime, latestClosingTime, universe, limit, callback) {
    let query = `SELECT market_id FROM markets WHERE end_time >= ? AND end_time <= ? AND universe = ? ORDER BY end_time DESC`;
    const queryParams = [earliestClosingTime, latestClosingTime, universe];
    if (limit) {
        query = `${query} LIMIT ?`;
        queryParams.push(limit);
    }
    db.all(query, queryParams, (err, rows) => {
        if (err)
            return callback(err);
        if (!rows || !rows.length)
            return callback(null);
        callback(null, rows.map((row) => row.market_id));
    });
}
exports.getMarketsClosingInDateRange = getMarketsClosingInDateRange;
//# sourceMappingURL=get-markets-closing-in-date-range.js.map