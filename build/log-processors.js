"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logProcessors = {
    Augur: {
        MarketCreated: (db, log, callback) => {
            const dataToInsert = [
                log.market, log.address, log.marketType, log.numOutcomes, log.minPrice, log.maxPrice, log.marketCreator, log.creationTime, log.blockNumber, log.creationFee, log.marketCreatorFeeRate, log.topic, log.tag1, log.tag2, log.reportingWindow, log.endTime, log.shortDescription, log.designatedReporter, log.resolutionSource
            ];
            db.run(`INSERT INTO markets
        (contract_address, universe, market_type, num_outcomes, min_price, max_price, market_creator, creation_time, creation_block_number, creation_fee, market_creator_fee_rate, topic, tag1, tag2, reporting_window, end_time, short_description, designated_reporter, resolution_source)
        VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
        },
        TokensTransferred: (db, log, callback) => {
            const dataToInsert = [
                log.transactionHash, log.logIndex, log.from, log.to, log.token, log.value, log.blockNumber
            ];
            db.run(`INSERT INTO transfers
        (transaction_hash, log_index, sender, recipient, token, value, block_number)
        VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
        },
        OrderCanceled: (db, log, callback) => {
            db.run(`DELETE FROM orders WHERE order_id = ?`, [log.orderId], callback);
        },
        OrderCreated: (db, log, callback) => {
            db.get(`SELECT block_timestamp FROM blocks WHERE block_number = ?`, [log.blockNumber], (err, blocksRow) => {
                if (err)
                    return callback(err);
                if (!blocksRow)
                    return callback(new Error("block timestamp not found"));
                db.get(`SELECT market, outcome FROM tokens WHERE contract_address = ?`, [log.shareToken], (err, tokensRow) => {
                    if (err)
                        return callback(err);
                    if (!tokensRow)
                        return callback(new Error("market and outcome not found"));
                    const dataToInsert = [
                        log.orderId, tokensRow.market, tokensRow.outcome, log.shareToken, log.orderType, log.creator, blocksRow.block_timestamp, log.blockNumber, log.price, log.amount, log.tokensEscrowed, log.sharesEscrowed, log.tradeGroupId
                    ];
                    db.run(`INSERT INTO orders
            (order_id, market, outcome, share_token, order_type, order_creator, creation_time, creation_block_number, price, amount, tokens_escrowed, shares_escrowed, trade_group_id)
            VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
                });
            });
        },
        OrderFilled: (db, log, callback) => {
            const dataToInsert = [];
            db.run(`INSERT INTO 
        ()
        VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
        },
        ProceedsClaimed: (db, log, callback) => {
            const dataToInsert = [];
            db.run(`INSERT INTO 
        ()
        VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
        }
        // ReporterRegistered: (db: Database, log: FormattedLog, callback: ErrorCallback): void => {
        //   const dataToInsert: (string|number)[] = [];
        //   db.run(`INSERT INTO 
        //     ()
        //     VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
        // },
        // DesignatedReportSubmitted: (db: Database, log: FormattedLog, callback: ErrorCallback): void => {
        //   const dataToInsert: (string|number)[] = [];
        //   db.run(`INSERT INTO 
        //     ()
        //     VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
        // },
        // ReportSubmitted: (db: Database, log: FormattedLog, callback: ErrorCallback): void => {
        //   const dataToInsert: (string|number)[] = [];
        //   db.run(`INSERT INTO 
        //     ()
        //     VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
        // },
        // WinningTokensRedeemed: (db: Database, log: FormattedLog, callback: ErrorCallback): void => {
        //   const dataToInsert: (string|number)[] = [];
        //   db.run(`INSERT INTO 
        //     ()
        //     VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
        // },
        // ReportsDisputed: (db: Database, log: FormattedLog, callback: ErrorCallback): void => {
        //   const dataToInsert: (string|number)[] = [];
        //   db.run(`INSERT INTO 
        //     ()
        //     VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
        // },
        // MarketFinalized: (db: Database, log: FormattedLog, callback: ErrorCallback): void => {
        //   const dataToInsert: (string|number)[] = [];
        //   db.run(`INSERT INTO 
        //     ()
        //     VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
        // },
        // UniverseForked: (db: Database, log: FormattedLog, callback: ErrorCallback): void => {
        //   const dataToInsert: (string|number)[] = [];
        //   db.run(`INSERT INTO 
        //     ()
        //     VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
        // }
    },
    LegacyRepContract: {
        Transfer: (db, log, callback) => {
            const dataToInsert = [
                log.transactionHash, log.logIndex, log.from, log.to, log.address, log.value, log.blockNumber
            ];
            db.run(`INSERT INTO transfers
        (transaction_hash, log_index, sender, recipient, token, value, block_number)
        VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
        },
        Approval: (db, log, callback) => {
            const dataToInsert = [
                log.transactionHash, log.logIndex, log.owner, log.spender, log.address, log.value, log.blockNumber
            ];
            db.run(`INSERT INTO approvals
        (transaction_hash, log_index, owner, spender, token, value, block_number)
        VALUES (${dataToInsert.map(() => '?').join(',')})`, dataToInsert, callback);
        }
    }
};
//# sourceMappingURL=log-processors.js.map