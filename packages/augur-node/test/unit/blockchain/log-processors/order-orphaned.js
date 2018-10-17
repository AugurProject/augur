"use strict";

const { fix } = require("speedomatic");
const setupTestDb = require("../../test.database");
const { BigNumber } = require("bignumber.js");
const { processOrderCreatedLog } = require("src/blockchain/log-processors/order-created");
const Augur = require("augur.js");
const augur = new Augur();

describe("order-orphaned", () => {
  const runTest = (t) => {
    const getState = (db, orderId, callback) => db("orders").where("orderId", orderId).asCallback(callback);
    test(t.description, async (done) => {
const db = await setupTestDb();
      db.del().from("orders").asCallback((err) => {
        expect(err).toBeFalsy();
        db.transaction((trx) => {
          processOrderCreatedLog(trx, t.params.augur, Object.assign({}, t.params.log, {
            logIndex: 0,
            orderId: "ORDER_ID_1"
          }), (err) => {
            expect(err).toBeFalsy();
            processOrderCreatedLog(trx, t.params.augur, Object.assign({}, t.params.log, {
              logIndex: 1,
              orderId: "ORDER_ID_2"
            }), (err) => {
              expect(err).toBeFalsy();
              processOrderCreatedLog(trx, t.params.augur, Object.assign({}, t.params.log, {
                logIndex: 2,
                orderId: "ORDER_ID_3"
              }), (err) => {
                expect(err).toBeFalsy();
                getState(trx, "ORDER_ID_2", (err, records) => {
                  t.assertions.onAdded(err, records);
                  db.destroy();
                  done();
                });
              });
            });
          });
        });
      });
    })
  };
  runTest({
    description: "Same OrderCreated 3 times in a row resulting in the second being removed",
    params: {
      log: {
        orderType: "0",
        shareToken: "0x0100000000000000000000000000000000000000",
        price: "7500",
        amount: augur.utils.convertDisplayAmountToOnChainAmount("3", new BigNumber(1), new BigNumber(10000)).toString(),
        sharesEscrowed: "0",
        moneyEscrowed: fix("2.25", "string"),
        creator: "CREATOR_ADDRESS",
        tradeGroupId: "TRADE_GROUP_ID",
        blockNumber: 1400100,
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000B00",
      },
      augur: {
        utils: augur.utils,
        api: {
          OrdersFinder: {
            getExistingOrders5: function(data, cb) {
              return cb(null, ["ORDER_ID_1", "ORDER_ID_3"]);
            },
          },
        },
      },
    },
    assertions: {
      onAdded: (err, records) => {
        expect(err).toBeFalsy();
        expect(records[0].orphaned).toEqual(1);
      },
      onRemoved: (err, records) => {
        expect(err).toBeFalsy();
        expect(records[0].orphaned).toEqual(0);
      },
    },
  });
});
