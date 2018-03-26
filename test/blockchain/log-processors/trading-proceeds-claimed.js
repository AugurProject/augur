"use strict";

const assert = require("chai").assert;
const { BigNumber } = require("bignumber.js");
const setupTestDb = require("../../test.database");
const { processTradingProceedsClaimedLog, processTradingProceedsClaimedLogRemoval } = require("../../../build/blockchain/log-processors/trading-proceeds-claimed");

describe("blockchain/log-processors/trading-proceeds-claimed", () => {
  const test = (t) => {
    const getTradingProceeds = (db, params, callback) => db.select(["marketId", "shareToken", "account", "numShares", "numPayoutTokens"]).from("trading_proceeds").asCallback(callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          processTradingProceedsClaimedLog(trx, t.params.augur, t.params.log, (err) => {
            assert.isNull(err);
            getTradingProceeds(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processTradingProceedsClaimedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                assert.isNull(err);
                getTradingProceeds(trx, t.params, (err, records) => {
                  t.assertions.onRemoved(err, records);
                  done();
                });
              });
            });
          });
        });
      });
    });
  };
  test({
    description: "Claim Trading Proceeds",
    params: {
      log: {
        transactionHash: "TRANSACTION_HASH",
        logIndex: 0,
        blockNumber: 1400101,
        market: "MARKET_ADDRESS",
        shareToken: "SHARE_TOKEN_ADDRESS",
        sender: "FROM_ADDRESS",
        numShares: new BigNumber("140", 10),
        numPayoutTokens: new BigNumber("9000", 10),
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, [{
          account: "FROM_ADDRESS",
          marketId: "MARKET_ADDRESS",
          numShares: new BigNumber("140", 10),
          numPayoutTokens: new BigNumber("9000", 10),
          shareToken: "SHARE_TOKEN_ADDRESS",
        }]);
      },
      onRemoved: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, []);
      },
    },
  });
});
