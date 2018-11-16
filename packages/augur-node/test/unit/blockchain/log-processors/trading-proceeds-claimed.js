"use strict";

const { BigNumber } = require("bignumber.js");
const setupTestDb = require("../../test.database");
const { processTradingProceedsClaimedLog, processTradingProceedsClaimedLogRemoval } = require("src/blockchain/log-processors/trading-proceeds-claimed");

describe("blockchain/log-processors/trading-proceeds-claimed", () => {
  const runTest = (t) => {
    const getTradingProceeds = (db, params, callback) => db.select(["marketId", "shareToken", "account", "numShares", "numPayoutTokens"]).from("trading_proceeds").asCallback(callback);
    test(t.description, async (done) => {
const db = await setupTestDb();
      db.transaction((trx) => {
        processTradingProceedsClaimedLog(trx, t.params.augur, t.params.log, (err) => {
          expect(err).toBeFalsy();
          getTradingProceeds(trx, t.params, (err, records) => {
            t.assertions.onAdded(err, records);
            processTradingProceedsClaimedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
              expect(err).toBeFalsy();
              getTradingProceeds(trx, t.params, (err, records) => {
                t.assertions.onRemoved(err, records);
                db.destroy();
                done();
              });
            });
          });
        });
      });
    })
  };
  runTest({
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
        expect(err).toBeFalsy();
        expect(records).toEqual([{
          account: "FROM_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000001",
          numShares: new BigNumber("140", 10),
          numPayoutTokens: new BigNumber("9000", 10),
          shareToken: "SHARE_TOKEN_ADDRESS",
        }]);
      },
      onRemoved: (err, records) => {
        expect(err).toBeFalsy();
        expect(records).toEqual([]);
      },
    },
  });
});
