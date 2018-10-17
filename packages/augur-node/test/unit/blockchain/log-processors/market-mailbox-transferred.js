"use strict";

const setupTestDb = require("../../test.database");
const {processMarketMailboxTransferredLog, processMarketMailboxTransferredLogRemoval} = require("src/blockchain/log-processors/market-mailbox-transferred");

const getMarket = (db, params, callback) => {
  db.select(["markets.marketId", "markets.marketCreatorMailboxOwner"]).from("markets").where({"markets.marketId": params.log.market}).asCallback(callback);
};

describe("blockchain/log-processors/market-mailbox-transferred", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
const db = await setupTestDb();
      db.transaction((trx) => {
        processMarketMailboxTransferredLog(trx, t.params.augur, t.params.log, (err) => {
          expect(err).toBeFalsy();
          getMarket(trx, t.params, (err, marketRow) => {
            t.assertions.onAdded(err, marketRow);
            processMarketMailboxTransferredLogRemoval(trx, t.params.augur, t.params.log, (err) => {
              expect(err).toBeFalsy();
              getMarket(trx, t.params, (err, marketRow) => {
                t.assertions.onRemoved(err, marketRow);
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
        expect(err).toBeFalsy();
        expect(marketRow).toEqual([
          {
            "marketId": "0x0000000000000000000000000000000000000211",
            "marketCreatorMailboxOwner": "0x000000000000000000000000000000000000d00d",
          },
        ]);
      },
      onRemoved: (err, marketRow) => {
        expect(err).toBeFalsy();
        expect(marketRow).toEqual([
          {
            "marketId": "0x0000000000000000000000000000000000000211",
            "marketCreatorMailboxOwner": "0x0000000000000000000000000000000000000b0b",
          },
        ]);
      },
    },
  });
});
