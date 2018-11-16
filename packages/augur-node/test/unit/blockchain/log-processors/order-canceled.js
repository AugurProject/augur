"use strict";

const setupTestDb = require("../../test.database");
const {BigNumber} = require("bignumber.js");
const {series} = require("async");
const {processOrderCanceledLog, processOrderCanceledLogRemoval} = require("src/blockchain/log-processors/order-canceled");

describe("blockchain/log-processors/order-canceled", () => {
  const runTest = (t) => {
    const getState = (db, params, callback) => {

      series({
        order: (next) => db("orders").where("orderId", params.log.orderId).first().asCallback(next),
        orderCanceled: (next) => db("orders_canceled").where("orderId", params.log.orderId).first().asCallback(next),
      }, callback);

    };
    test(t.description, async (done) => {
const db = await setupTestDb();
      db.transaction((trx) => {
        processOrderCanceledLog(trx, t.params.augur, t.params.log, (err) => {
          expect(err).toBeFalsy();
          getState(trx, t.params, (err, records) => {
            t.assertions.onAdded(err, records);
            processOrderCanceledLogRemoval(trx, t.params.augur, t.params.log, (err) => {
              expect(err).toBeFalsy();
              getState(trx, t.params, (err, records) => {
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
        expect(err).toBeFalsy();
        expect(records.order).toEqual({
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
          originalFullPrecisionAmount: new BigNumber("1", 10),
          price: new BigNumber("0.7", 10),
          amount: new BigNumber("1", 10),
          originalAmount: new BigNumber("1", 10),
          tokensEscrowed: new BigNumber("0.7", 10),
          sharesEscrowed: new BigNumber("0", 10),
          tradeGroupId: null,
          orphaned: 0,
        });
        expect(records.orderCanceled).toEqual({
          blockNumber: 1400101,
          logIndex: 0,
          orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000B00",
        });
      },
      onRemoved: (err, records) => {
        expect(err).toBeFalsy();
        expect(records.order).toEqual({
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
          originalFullPrecisionAmount: new BigNumber("1", 10),
          price: new BigNumber("0.7", 10),
          amount: new BigNumber("1", 10),
          originalAmount: new BigNumber("1", 10),
          tokensEscrowed: new BigNumber("0.7", 10),
          sharesEscrowed: new BigNumber("0", 10),
          tradeGroupId: null,
          orphaned: 0,
        });
        expect(records.orderCanceled).not.toBeDefined();
      },
    },
  });
});
