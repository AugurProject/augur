"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { processMarketParticipantsDisavowedLog, processMarketParticipantsDisavowedLogRemoval } = require("../../../build/blockchain/log-processors/market-participants-disavowed");

describe("blockchain/log-processors/market-participants-disavowed", () => {
  const test = (t) => {
    const getMarketCrowdsourcers = (db, params, callback) => db("crowdsourcers").where({ marketId: params.log.market }).asCallback(callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        db.transaction((trx) => {
          processMarketParticipantsDisavowedLog(trx, t.params.augur, t.params.log, (err) => {
            assert.ifError(err);
            getMarketCrowdsourcers(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processMarketParticipantsDisavowedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                assert.ifError(err);
                getMarketCrowdsourcers(trx, t.params, (err, records) => {
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
    description: "Market Participants Disavowed",
    params: {
      log: {
        market: "0x0000000000000000000000000000000000000011",
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.ifError(err);
        assert.equal(records.length, 3);
        assert.equal(records[0].disavowed, 1);
        assert.equal(records[1].disavowed, 1);
        assert.equal(records[2].disavowed, 1);
      },
      onRemoved: (err, records) => {
        assert.ifError(err);
        assert.equal(records.length, 3);
        assert.equal(records[0].disavowed, 0);
        assert.equal(records[1].disavowed, 0);
        assert.equal(records[2].disavowed, 0);
      },
    },
  });
});
