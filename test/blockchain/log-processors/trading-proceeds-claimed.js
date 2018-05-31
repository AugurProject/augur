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
        assert.ifError(err);
        db.transaction((trx) => {
          processTradingProceedsClaimedLog(trx, t.params.augur, t.params.log, (err) => {
            assert.ifError(err);
            getTradingProceeds(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processTradingProceedsClaimedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                assert.ifError(err);
                getTradingProceeds(trx, t.params, (err, records) => {
                  t.assertions.onRemoved(err, records);
                  db.destroy();
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
      augur: {
        api: {
          Orders: {
            getLastOutcomePrice: (p, callback) => {
              if (p._outcome === 0) {
                callback(null, "7000");
              } else {
                callback(null, "1250");
              }
            },
          },
        },
        utils: {
          convertOnChainPriceToDisplayPrice: (onChainPrice, minDisplayPrice, tickSize) => {
            return onChainPrice.times(tickSize).plus(minDisplayPrice);
          },
        },
        trading: {
          getPositionInMarket: (p, callback) => {
            callback(null, ["2", "0", "0", "0", "0", "0", "0", "0"]);
          },
        },
      },
      log: {
        transactionHash: "TRANSACTION_HASH",
        logIndex: 0,
        blockNumber: 1400101,
        market: "0x0000000000000000000000000000000000000001",
        shareToken: "SHARE_TOKEN_ADDRESS",
        sender: "FROM_ADDRESS",
        numShares: new BigNumber("140", 10),
        numPayoutTokens: new BigNumber("9000", 10),
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, [{
          account: "FROM_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000001",
          numShares: new BigNumber("140", 10),
          numPayoutTokens: new BigNumber("9000", 10),
          shareToken: "SHARE_TOKEN_ADDRESS",
        }]);
      },
      onRemoved: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, []);
      },
    },
  });
});
