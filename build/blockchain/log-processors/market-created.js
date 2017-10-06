"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function processMarketCreatedLog(db, log, callback) {
    const dataToInsert = [
        log.market, log.address, log.marketType, log.numOutcomes, log.minPrice, log.maxPrice, log.marketCreator, log.creationTime, log.blockNumber, log.creationFee, log.marketCreatorFeeRate, log.topic, log.tag1, log.tag2, log.reportingWindow, log.endTime, log.shortDescription, log.designatedReporter, log.resolutionSource
    ];
    db.run(`INSERT INTO markets
    (market_id, universe, market_type, num_outcomes, min_price, max_price, market_creator, creation_time, creation_block_number, creation_fee, market_creator_fee_rate, topic, tag1, tag2, reporting_window, end_time, short_description, designated_reporter, resolution_source)
    VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, (err) => {
        if (err)
            return callback(err);
        db.get(`SELECT popularity FROM topics WHERE name = ?`, [log.topic], (err, row) => {
            if (err)
                return callback(err);
            if (row)
                return callback(null);
            db.run(`INSERT INTO topics (name, universe) VALUES (?, ?)`, [log.topic, log.address], callback);
        });
    });
}
exports.processMarketCreatedLog = processMarketCreatedLog;
//# sourceMappingURL=market-created.js.map