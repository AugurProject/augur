import { setupTestDb } from 'test/unit/test.database';
import { BigNumber } from 'bignumber.js';
import { processOrderCanceledLog, processOrderCanceledLogRemoval } from './order-canceled';

async function getState(db, log) {
  return {
    order: await db("orders").where("orderId", log.orderId).first(),
    orderCanceled: await db("orders_canceled").where("orderId", log.orderId).first(),
  };
}

describe("blockchain/log-processors/order-canceled", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  const log = {
    universe: "0x000000000000000000000000000000000000000b",
    shareToken: "0x0100000000000000000000000000000000000000",
    sender: "0x0000000000000000000000000000000000000b0b",
    orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
    sharesRefund: "0",
    tokensRefund: "1125000000000000000",
    blockNumber: 1400101,
    transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000B00",
    logIndex: 0,
  };
  test("OrderCanceled log and removal", async () => {
    return db.transaction(async (trx) => {
      await(await processOrderCanceledLog({}, log))(trx);
      await expect(getState(trx, log)).resolves.toEqual({
        order: {
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
        },
        orderCanceled: {
          blockNumber: 1400101,
          logIndex: 0,
          orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000B00",
        },
      });
      await(await processOrderCanceledLogRemoval({}, log))(trx);
      await expect(getState(trx, log)).resolves.toEqual({
        order: {
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
        },
      });
    });
  });

  afterEach(async () => {
    await db.destroy();
  });
});
