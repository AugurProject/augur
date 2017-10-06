"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getTopics(db, universe, callback) {
    db.all(`SELECT topic, popularity FROM topics WHERE universe = ? ORDER BY popularity DESC`, [universe], (err, topicsInfo) => {
        if (err)
            return callback(err);
        if (!topicsInfo || !topicsInfo.length)
            return callback(null);
        callback(null, topicsInfo);
    });
}
exports.getTopics = getTopics;
//# sourceMappingURL=get-topics.js.map