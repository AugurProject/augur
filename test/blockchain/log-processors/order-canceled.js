"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { processOrderCanceledLog, processOrderCanceledLogRemoval } = require("../../../build/blockchain/log-processors/order-canceled");

describe("blockchain/log-processors/order-canceled", () => {
  const test = (t) => {
    const getState = (db, params, callback) => db("orders").where("orderId", params.log.orderId).asCallback(callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          processOrderCanceledLog(db, t.params.augur, trx, t.params.log, (err) => {
            assert.isNull(err);
            getState(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processOrderCanceledLogRemoval(db, t.params.augur, trx, t.params.log, (err) => {
                getState(trx, t.params, (err, records) => {
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
    description: "OrderCanceled log and removal",
    params: {
      log: {
        universe: "0x000000000000000000000000000000000000000b",
        shareToken: "0x1000000000000000000000000000000000000000",
        sender: "0x0000000000000000000000000000000000000b0b",
        orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
        sharesRefund: "0",
        tokensRefund: "1125000000000000000",
        blockNumber: 1400101,
      },
      augur: {},
    },
    assertions: {
      onAdded: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, [{
          orderID: "0x1000000000000000000000000000000000000000000000000000000000000000",
          marketID: "0x0000000000000000000000000000000000000001",
          outcome: 0,
          shareToken: "0x1000000000000000000000000000000000000000",
          orderType: "buy",
          orderCreator: "0x0000000000000000000000000000000000000b0b",
          creationBlockNumber: 1400001,
          fullPrecisionPrice: 0.7,
          fullPrecisionAmount: 1,
          price: 0.7,
          amount: 1,
          tokensEscrowed: 0.7,
          sharesEscrowed: 0,
          tradeGroupID: null,
          isRemoved: 1,
        }]);
      },
      onRemoved: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, [{
          orderID: "0x1000000000000000000000000000000000000000000000000000000000000000",
          marketID: "0x0000000000000000000000000000000000000001",
          outcome: 0,
          shareToken: "0x1000000000000000000000000000000000000000",
          orderType: "buy",
          orderCreator: "0x0000000000000000000000000000000000000b0b",
          creationBlockNumber: 1400001,
          fullPrecisionPrice: 0.7,
          fullPrecisionAmount: 1,
          price: 0.7,
          amount: 1,
          tokensEscrowed: 0.7,
          sharesEscrowed: 0,
          tradeGroupID: null,
          isRemoved: null,
        }]);
      },
    },
  });
});
