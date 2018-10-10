"use strict";

const assert = require("chai").assert;
const { fix } = require("speedomatic");
const setupTestDb = require("../../test.database");
const { BigNumber } = require("bignumber.js");
const { processOrderCreatedLog, processOrderCreatedLogRemoval } = require("../../../../src/blockchain/log-processors/order-created");
const Augur = require("augur.js");
const augur = new Augur();

describe("blockchain/log-processors/order-created", () => {
  const test = (t) => {
    const getState = (db, params, callback) => db("orders").where("orderId", params.log.orderId).asCallback(callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        db.transaction((trx) => {
          processOrderCreatedLog(trx, t.params.augur, t.params.log, (err) => {
            assert.ifError(err);
            getState(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processOrderCreatedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
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
    description: "OrderCreated log and removal",
    params: {
      log: {
        orderType: "0",
        shareToken: "0x0100000000000000000000000000000000000000",
        price: "7500",
        amount: augur.utils.convertDisplayAmountToOnChainAmount("3", new BigNumber(1), new BigNumber(10000)).toString(),
        sharesEscrowed: "0",
        moneyEscrowed: fix("2.25", "string"),
        creator: "CREATOR_ADDRESS",
        orderId: "ORDER_ID",
        tradeGroupId: "TRADE_GROUP_ID",
        blockNumber: 1400100,
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000B00",
        logIndex: 0,
      },
      augur: {
        utils: augur.utils,
        api: {
          OrdersFinder: {
            getExistingOrders5: function (data, cb) {
              return cb(null, ["ORDER_ID"]);
            },
          },
        },
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, [{
          orderId: "ORDER_ID",
          blockNumber: 1400100,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000B00",
          logIndex: 0,
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 0,
          shareToken: "0x0100000000000000000000000000000000000000",
          orderType: "buy",
          orderCreator: "CREATOR_ADDRESS",
          orderState: "OPEN",
          fullPrecisionPrice: new BigNumber("0.75", 10),
          fullPrecisionAmount: new BigNumber("3", 10),
          originalFullPrecisionAmount: new BigNumber("3", 10),
          price: new BigNumber("0.75", 10),
          amount: new BigNumber("3", 10),
          originalAmount: new BigNumber("3", 10),
          tokensEscrowed: new BigNumber("2.25", 10),
          sharesEscrowed: new BigNumber("0", 10),
          tradeGroupId: "TRADE_GROUP_ID",
          orphaned: 0,
        }]);
      },
      onRemoved: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, []);
      },
    },
  });
});
