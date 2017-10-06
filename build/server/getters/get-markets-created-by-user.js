"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Should return the total amount of fees earned so far by the market creator.
function getMarketsCreatedByUser(db, creator, callback) {
    db.all(`SELECT market_id FROM markets WHERE market_creator = ?`, [creator], (err, rows) => {
        if (err)
            return callback(err);
        if (!rows || !rows.length)
            return callback(null);
        callback(null, rows.map((row) => row.market_id));
    });
}
exports.getMarketsCreatedByUser = getMarketsCreatedByUser;
//# sourceMappingURL=get-markets-created-by-user.js.map