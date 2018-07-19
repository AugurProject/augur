"use strict";

const assert = require("chai").assert;
const { fix } = require("speedomatic");
const setupTestDb = require("../../test.database");
const { BigNumber } = require("bignumber.js");
const { processOrderCreatedLog, processOrderCreatedLogRemoval } = require("../../../../build/blockchain/log-processors/order-created");
const Augur = require("augur.js");
const augur = new Augur();

describe("order-orphaned", () => {
  const test = (t) => {
    const getState = (db, orderId, callback) => db("orders").where("orderId", orderId).asCallback(callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        db.del().from("orders").asCallback((err) => {
          assert.ifError(err);
          db.transaction((trx) => {
            processOrderCreatedLog(trx, t.params.augur, Object.assign({}, t.params.log, {logIndex: 0, orderId: "ORDER_ID_1"}), (err) => {
              assert.ifError(err);
              processOrderCreatedLog(trx, t.params.augur, Object.assign({}, t.params.log, {logIndex: 1, orderId: "ORDER_ID_2" }), (err) => {
                assert.ifError(err);
                processOrderCreatedLog(trx, t.params.augur, Object.assign({}, t.params.log, {logIndex: 2, orderId: "ORDER_ID_3"}), (err) => {
                  assert.ifError(err);
                  getState(trx, "ORDER_ID_2", (err, records) => {
                    t.assertions.onAdded(err, records);
                    done();
                  });
                });
              });
            });
          });
        });
      });
    });
  };
  test({
    description: "Same OrderCreated 3 times in a row resulting in the second being removed",
    params: {
      log: {
        orderType: "0",
        shareToken: "0x0100000000000000000000000000000000000000",
        price: "7500",
        amount: augur.utils.convertDisplayAmountToOnChainAmount("3", new BigNumber(1), new BigNumber(10000)).toFixed(),
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
            getExistingOrders5: function (data, cb) {
              return cb(null, ["ORDER_ID_1", "ORDER_ID_3"]);
            },
          },
        },
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.ifError(err);
        assert.equal(records[0].orphaned, 1);
      },
      onRemoved: (err, records) => {
        assert.ifError(err);
        assert.equal(records[0].orphaned, 0);
      },
    },
  });
});
