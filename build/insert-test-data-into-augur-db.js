"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function insertTestDataIntoAugurDb(db, callback) {
    db.parallelize(() => {
        db.run(`INSERT INTO markets
            (contractAddress, universe, marketType, numOutcomes, minPrice, maxPrice, marketCreator, creationTime, creationBlockNumber, creationFee, marketCreatorFeeRate, topic, tag1, tag2, reportingWindow, endTime, shortDescription, designatedReporter, resolutionSource)
            VALUES (
              '0x0000000000000000000000000000000000000001',
              '0x000000000000000000000000000000000000000b',
              'categorical',
              8,
              0,
              1000000000000000000,
              '0x0000000000000000000000000000000000000b0b',
              1506473474,
              1400000,
              1000000000000000000,
              1,
              'test topic',
              'test tag 1',
              'test tag 2',
              '0x1000000000000000000000000000000000000000',
              1506573474,
              'This is a test market created by the augur-node.',
              '0x0000000000000000000000000000000000000b0b',
              'http://www.trusted-third-party.com'
            )`)
            .run(`INSERT INTO orders
            (orderId, market, outcome, orderType, orderCreator, creationTime, creationBlockNumber, price, amount, moneyEscrowed, sharesEscrowed, betterOrderId, worseOrderId)
            VALUES (
              '0x1000000000000000000000000000000000000000000000000000000000000000',
              '0x0000000000000000000000000000000000000001',
              0,
              0,
              '0x0000000000000000000000000000000000000b0b',
              1506473500,
              1400001,
              700000000000000000,
              1000000000000000000,
              700000000000000000,
              0,
              '0x2000000000000000000000000000000000000000000000000000000000000000',
              NULL
            ), (
              '0x2000000000000000000000000000000000000000000000000000000000000000',
              '0x0000000000000000000000000000000000000001',
              0,
              0,
              '0x000000000000000000000000000000000000d00d',
              1506473515,
              1400002,
              600000000000000000,
              2000000000000000000,
              1200000000000000000,
              0,
              NULL,
              '0x1000000000000000000000000000000000000000000000000000000000000000'
            )`)
            .run(`INSERT INTO balances
            (owner, token, balance)
            VALUES
            ('0x0000000000000000000000000000000000000b0b', 'REP', 1000000000000000000),
            ('0x0000000000000000000000000000000000000b0b', 'ETH', 7000000000000000000)`);
        callback(null);
    });
}
exports.insertTestDataIntoAugurDb = insertTestDataIntoAugurDb;
//# sourceMappingURL=insert-test-data-into-augur-db.js.map