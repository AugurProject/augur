"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const {processMarketMailboxTransferredLog, processMarketMailboxTransferredLogRemoval} = require("../../../build/blockchain/log-processors/market-mailbox-transferred");

const getMarket = (db, params, callback) => {
  db.select(["markets.marketId", "markets.marketCreatorMailboxOwner"]).from("markets").where({"markets.marketId": params.log.market}).asCallback(callback);
};

describe("blockchain/log-processors/market-mailbox-transferred", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        db.transaction((trx) => {
          processMarketMailboxTransferredLog(trx, t.params.augur, t.params.log, (err) => {
            assert.ifError(err);
            getMarket(trx, t.params, (err, marketRow) => {
              t.assertions.onAdded(err, marketRow);
              processMarketMailboxTransferredLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                assert.ifError(err);
                getMarket(trx, t.params, (err, marketRow) => {
                  t.assertions.onRemoved(err, marketRow);
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
    description: "Transfer MarketMailbox log and removal",
    params: {
      log: {
        market: "0x0000000000000000000000000000000000000211",
        blockNumber: 1400001,
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
        logIndex: 0,
        from: "0x0000000000000000000000000000000000000b0b",
        to: "0x000000000000000000000000000000000000d00d",
      },
    },
    assertions: {
      onAdded: (err, marketRow) => {
        assert.ifError(err);
        assert.deepEqual(marketRow, [
          {
            "marketId": "0x0000000000000000000000000000000000000211",
            "marketCreatorMailboxOwner": "0x000000000000000000000000000000000000d00d",
          },
        ]);
      },
      onRemoved: (err, marketRow) => {
        assert.ifError(err);
        assert.deepEqual(marketRow, [
          {
            "marketId": "0x0000000000000000000000000000000000000211",
            "marketCreatorMailboxOwner": "0x0000000000000000000000000000000000000b0b",
          },
        ]);
      },
    },
  });
});
