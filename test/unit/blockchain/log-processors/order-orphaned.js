const { fix } = require("speedomatic");
const setupTestDb = require("../../test.database");
const { BigNumber } = require("bignumber.js");
const { processOrderCreatedLog } = require("src/blockchain/log-processors/order-created");
const Augur = require("augur.js");

function getState(db, orderId) {
  return db("orders").where("orderId", orderId).first("orphaned");
}

const augur = {
  utils: new Augur().utils,
  api: {
    OrdersFinder: {
      getExistingOrders5: () => Promise.resolve(["ORDER_ID_1", "ORDER_ID_3"]),
    },
  },
};

describe("order-orphaned", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  const log = {
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
  };
  test("Same OrderCreated 3 times in a row resulting in the second being removed", async () => {
    await db.del().from("orders");

    return db.transaction(async (trx) => {
      await(await processOrderCreatedLog(augur, Object.assign({}, log, {
        logIndex: 0,
        orderId: "ORDER_ID_1",
      })))(trx);

      await(await processOrderCreatedLog(augur, Object.assign({}, log, {
        logIndex: 1,
        orderId: "ORDER_ID_2",
      })))(trx);
      await(await processOrderCreatedLog(augur, Object.assign({}, log, {
        logIndex: 2,
        orderId: "ORDER_ID_3",
      })))(trx);
      expect((await getState(trx, "ORDER_ID_2"))).toEqual({ orphaned: 1 });
    });
  });

  afterEach(async () => {
    await db.destroy();
  });
});
