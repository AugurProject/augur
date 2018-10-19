"use strict";

const setupTestDb = require("../../test.database");
const { processMarketParticipantsDisavowedLog, processMarketParticipantsDisavowedLogRemoval } = require("src/blockchain/log-processors/market-participants-disavowed");

describe("blockchain/log-processors/market-participants-disavowed", () => {
  const runTest = (t) => {
    const getMarketCrowdsourcers = (db, params, callback) => db("crowdsourcers").where({ marketId: params.log.market }).asCallback(callback);
    test(t.description, async (done) => {
const db = await setupTestDb();
      db.transaction((trx) => {
        processMarketParticipantsDisavowedLog(trx, t.params.augur, t.params.log, (err) => {
          expect(err).toBeFalsy();
          getMarketCrowdsourcers(trx, t.params, (err, records) => {
            t.assertions.onAdded(err, records);
            processMarketParticipantsDisavowedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
              expect(err).toBeFalsy();
              getMarketCrowdsourcers(trx, t.params, (err, records) => {
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
    description: "Market Participants Disavowed",
    params: {
      log: {
        market: "0x0000000000000000000000000000000000000011",
      },
    },
    assertions: {
      onAdded: (err, records) => {
        expect(err).toBeFalsy();
        expect(records.length).toEqual(3);
        expect(records[0].disavowed).toEqual(1);
        expect(records[1].disavowed).toEqual(1);
        expect(records[2].disavowed).toEqual(1);
      },
      onRemoved: (err, records) => {
        expect(err).toBeFalsy();
        expect(records.length).toEqual(3);
        expect(records[0].disavowed).toEqual(0);
        expect(records[1].disavowed).toEqual(0);
        expect(records[2].disavowed).toEqual(0);
      },
    },
  });
});
