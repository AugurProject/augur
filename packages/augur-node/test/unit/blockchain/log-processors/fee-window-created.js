"use strict";

const setupTestDb = require("../../test.database");
const {series} = require("async");
const {processFeeWindowCreatedLog, processFeeWindowCreatedLogRemoval} = require("src/blockchain/log-processors/fee-window-created");

const getFeeWindow = (db, params, callback) => series({
  fee_windows: next => db("fee_windows").first(["feeWindow", "feeWindowId", "endTime"]).where({feeWindow: params.log.feeWindow}).asCallback(next),
  tokens: next => db("tokens").select(["contractAddress", "symbol", "feeWindow"])
    .where("contractAddress", params.log.feeWindow)
    .orWhere("feeWindow", params.log.feeWindow)
    .asCallback(next),
}, callback);

describe("blockchain/log-processors/fee-window-created", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
const db = await setupTestDb();
      db.transaction((trx) => {
        processFeeWindowCreatedLog(trx, t.params.augur, t.params.log, (err) => {
          expect(err).toBeFalsy();
          getFeeWindow(trx, t.params, (err, records) => {
            t.assertions.onAdded(err, records);
            processFeeWindowCreatedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
              expect(err).toBeFalsy();
              getFeeWindow(trx, t.params, (err, records) => {
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
        expect(err).toBeFalsy();
        expect(records).toEqual({
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
        expect(err).toBeFalsy();
        expect(records).toEqual({
          fee_windows: undefined,
          tokens: [],
        });
      },
    },
  });
});
