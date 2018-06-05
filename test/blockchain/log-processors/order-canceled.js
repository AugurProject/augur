"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const {BigNumber} = require("bignumber.js");
const {parallel} = require("async");
const {processOrderCanceledLog, processOrderCanceledLogRemoval} = require("../../../build/blockchain/log-processors/order-canceled");

describe("blockchain/log-processors/order-canceled", () => {
  const test = (t) => {
    const getState = (db, params, callback) => {

      parallel({
        order: (next) => db("orders").where("orderId", params.log.orderId).first().asCallback(next),
        orderCanceled: (next) => db("orders_canceled").where("orderId", params.log.orderId).first().asCallback(next),
      }, callback);

    };
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        db.transaction((trx) => {
          processOrderCanceledLog(trx, t.params.augur, t.params.log, (err) => {
            assert.ifError(err);
            getState(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processOrderCanceledLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                assert.ifError(err);
                getState(trx, t.params, (err, records) => {
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
    description: "OrderCanceled log and removal",
    params: {
      log: {
        universe: "0x000000000000000000000000000000000000000b",
        shareToken: "0x0100000000000000000000000000000000000000",
        sender: "0x0000000000000000000000000000000000000b0b",
        orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
        sharesRefund: "0",
        tokensRefund: "1125000000000000000",
        blockNumber: 1400101,
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000B00",
        logIndex: 0,
      },
      augur: {},
    },
    assertions: {
      onAdded: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records.order, {
          orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
          blockNumber: 1400001,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
          logIndex: 0,
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 0,
          shareToken: "0x0100000000000000000000000000000000000000",
          orderType: "buy",
          orderCreator: "0x0000000000000000000000000000000000000b0b",
          orderState: "CANCELED",
          fullPrecisionPrice: new BigNumber("0.7", 10),
          fullPrecisionAmount: new BigNumber("1", 10),
          price: new BigNumber("0.7", 10),
          amount: new BigNumber("1", 10),
          tokensEscrowed: new BigNumber("0.7", 10),
          sharesEscrowed: new BigNumber("0", 10),
          tradeGroupId: null,
          isRemoved: null,
        });
        assert.deepEqual(records.orderCanceled, {
          blockNumber: 1400101,
          logIndex: 0,
          orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000B00",
        });
      },
      onRemoved: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records.order, {
          orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
          blockNumber: 1400001,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
          logIndex: 0,
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 0,
          shareToken: "0x0100000000000000000000000000000000000000",
          orderType: "buy",
          orderCreator: "0x0000000000000000000000000000000000000b0b",
          orderState: "OPEN",
          fullPrecisionPrice: new BigNumber("0.7", 10),
          fullPrecisionAmount: new BigNumber("1", 10),
          price: new BigNumber("0.7", 10),
          amount: new BigNumber("1", 10),
          tokensEscrowed: new BigNumber("0.7", 10),
          sharesEscrowed: new BigNumber("0", 10),
          tradeGroupId: null,
          isRemoved: null,
        });
        assert.isUndefined(records.orderCanceled);
      },
    },
  });
});
