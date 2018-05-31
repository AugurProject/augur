"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const {parallel} = require("async");
const {processFeeWindowCreatedLog, processFeeWindowCreatedLogRemoval} = require("../../../build/blockchain/log-processors/fee-window-created");

const getFeeWindow = (db, params, callback) => parallel({
  fee_windows: next => db("fee_windows").first(["feeWindow", "feeWindowId", "endTime"]).where({feeWindow: params.log.feeWindow}).asCallback(next),
  tokens: next => db("tokens").select(["contractAddress", "symbol", "feeWindow"])
    .where("contractAddress", params.log.feeWindow)
    .orWhere("feeWindow", params.log.feeWindow)
    .asCallback(next),
}, callback);

describe("blockchain/log-processors/fee-window-created", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        db.transaction((trx) => {
          processFeeWindowCreatedLog(trx, t.params.augur, t.params.log, (err) => {
            assert.ifError(err);
            getFeeWindow(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processFeeWindowCreatedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                assert.ifError(err);
                getFeeWindow(trx, t.params, (err, records) => {
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
    description: "reporting window created",
    params: {
      log: {
        universe: "0x000000000000000000000000000000000000000b",
        feeWindow: "0xf000000000000000000000000000000000000000",
        startTime: 1510065473,
        endTime: 1512657473,
        id: 40304,
        blockNumber: 160101,
      },
      augur: {
        api: {
          FeeWindow: {
            getFeeToken: (p, callback) => {
              callback(null, "FEE_TOKEN");
            },
          },
        },
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, {
          fee_windows: {
            endTime: 1512657473,
            feeWindow: "0xf000000000000000000000000000000000000000",
            feeWindowId: 40304,
          },
          tokens: [
            {
              contractAddress: "0xf000000000000000000000000000000000000000",
              symbol: "ParticipationToken",
              feeWindow: null,
            },
            {
              contractAddress: "FEE_TOKEN",
              symbol: "FeeToken",
              feeWindow: "0xf000000000000000000000000000000000000000",
            },
          ],
        });
      },
      onRemoved: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, {
          fee_windows: undefined,
          tokens: [],
        });
      },
    },
  });
});
