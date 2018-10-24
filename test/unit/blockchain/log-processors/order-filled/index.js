const { BigNumber } = require("bignumber.js");
const { fix } = require("speedomatic");
const setupTestDb = require("../../../test.database");
const { processOrderFilledLog, processOrderFilledLogRemoval } = require("src/blockchain/log-processors/order-filled");
const Augur = require("augur.js");

async function getState(db, log, aux) {
  return {
    orders: await db("orders").where("orderId", log.orderId),
    trades: await db("trades").where("orderId", log.orderId),
    markets: await db.first("volume", "shareVolume", "sharesOutstanding").from("markets").where("marketId", aux.marketId),
    outcomes: await db.select("price", "volume", "shareVolume").from("outcomes").where({ marketId: aux.marketId }),
    categories: await db.first("popularity").from("categories").where("category", aux.category.toUpperCase()),
  };
}

const augur = {
  api: {
    Orders: {
      getLastOutcomePrice: (p) => {
        expect(p._market).toBe("0x0000000000000000000000000000000000000001");
        if (p._outcome === 0) {
          return Promise.resolve("7000");
        }
        return Promise.resolve("1250");

      },
    },
  },
  trading: {
    calculateProfitLoss: (p) => {
      expect(typeof p).toBe("object");
      return {
        position: "2",
        realized: "0",
        unrealized: "0",
        meanOpenPrice: "0.75",
        queued: "0",
      };
    },
    getPositionInMarket: (p, callback) => {
      expect(p.market).toBe("0x0000000000000000000000000000000000000001");
      expect(["0x0000000000000000000000000000000000000b0b", "FILLER_ADDRESS"].indexOf(p.address)).toBeGreaterThan(-1);
      callback(null, ["2", "0", "0", "0", "0", "0", "0", "0"]);
    },
    normalizePrice: p => p.price,
  },
  utils: new Augur().utils,
};

describe("blockchain/log-processors/order-filled", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  test("OrderFilled full log and removal", async () => {
    const log = {
      shareToken: "0x0100000000000000000000000000000000000000",
      filler: "FILLER_ADDRESS",
      orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
      amountFilled: "100000000000000",
      numCreatorShares: "0",
      numCreatorTokens: fix("1", "string"),
      numFillerShares: augur.utils.convertDisplayAmountToOnChainAmount("2", new BigNumber(1), new BigNumber(10000)).toString(),
      numFillerTokens: "0",
      marketCreatorFees: "0",
      reporterFees: "0",
      tradeGroupId: "TRADE_GROUP_ID",
      blockNumber: 1400101,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000F00",
      logIndex: 0,
    };
    const aux = {
      marketId: "0x0000000000000000000000000000000000000001",
      category: "TEST CATEGORY",
    };
    return db.transaction(async (trx) => {
      await processOrderFilledLog(trx, augur, log);

      const records = await getState(trx, log, aux);
      expect(records.orders).toEqual([{
        orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
        blockNumber: 1400001,
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
        logIndex: 0,
        marketId: "0x0000000000000000000000000000000000000001",
        outcome: 0,
        shareToken: "0x0100000000000000000000000000000000000000",
        orderType: "buy",
        orderCreator: "0x0000000000000000000000000000000000000b0b",
        orderState: "FILLED",
        fullPrecisionPrice: new BigNumber("0.7", 10),
        originalFullPrecisionAmount: new BigNumber("1", 10),
        fullPrecisionAmount: new BigNumber("0", 10),
        price: new BigNumber("0.7", 10),
        amount: new BigNumber("0", 10),
        originalAmount: new BigNumber("1", 10),
        tokensEscrowed: new BigNumber("0.7", 10),
        sharesEscrowed: new BigNumber("0", 10),
        tradeGroupId: null,
        orphaned: 0,
      }]);
      expect(records.trades).toEqual([{
        orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
        blockNumber: 1400101,
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000F00",
        logIndex: 0,
        marketId: "0x0000000000000000000000000000000000000001",
        outcome: 0,
        shareToken: "0x0100000000000000000000000000000000000000",
        orderType: "buy",
        creator: "0x0000000000000000000000000000000000000b0b",
        filler: "FILLER_ADDRESS",
        numCreatorTokens: new BigNumber("1", 10),
        numCreatorShares: new BigNumber("0", 10),
        numFillerTokens: new BigNumber("0", 10),
        numFillerShares: new BigNumber("2", 10),
        marketCreatorFees: new BigNumber("0", 10),
        reporterFees: new BigNumber("0", 10),
        price: new BigNumber("0.7", 10),
        amount: new BigNumber("1", 10),
        tradeGroupId: "TRADE_GROUP_ID",
      }]);
      expect(records.markets).toEqual({
        volume: new BigNumber("0.7", 10),
        shareVolume: new BigNumber("1", 10),
        sharesOutstanding: new BigNumber("2", 10),
      });
      expect(records.outcomes).toEqual([
        {
          price: new BigNumber("0.7", 10),
          volume: new BigNumber("100.7", 10),
          shareVolume: new BigNumber("13.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
      ]);
      expect(records.categories).toEqual({
        popularity: 1,
      });
      await processOrderFilledLogRemoval(trx, augur, log);

      const recordsAfterRemoval = await getState(trx, log, aux);
      expect(recordsAfterRemoval.orders).toEqual([{
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
      }]);
      expect(recordsAfterRemoval.trades).toEqual([]);
      expect(recordsAfterRemoval.markets).toEqual({
        volume: new BigNumber("0", 10),
        shareVolume: new BigNumber("0", 10),
        sharesOutstanding: new BigNumber("2", 10),
      });
      expect(recordsAfterRemoval.outcomes).toEqual([
        { price: new BigNumber("0.7", 10), volume: new BigNumber("100", 10), shareVolume: new BigNumber("12.5", 10) },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
      ]);
      expect(recordsAfterRemoval.categories).toEqual({
        popularity: 0,
      });
    });
  });

  test("OrderFilled partial log and removal", async () => {
    const log = {
      shareToken: "0x0100000000000000000000000000000000000000",
      filler: "FILLER_ADDRESS",
      orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
      amountFilled: "40000000000000",
      numCreatorShares: "0",
      numCreatorTokens: fix("0.4", "string"),
      numFillerShares: augur.utils.convertDisplayAmountToOnChainAmount("2", new BigNumber(1), new BigNumber(10000)).toString(),
      numFillerTokens: "0",
      marketCreatorFees: "0",
      reporterFees: "0",
      tradeGroupId: "TRADE_GROUP_ID",
      blockNumber: 1400101,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000F00",
      logIndex: 0,
    };
    const aux = {
      marketId: "0x0000000000000000000000000000000000000001",
      category: "TEST CATEGORY",
    };
    return db.transaction(async (trx) => {
      await processOrderFilledLog(trx, augur, log);

      const records = await getState(trx, log, aux);

      expect(records.orders).toEqual([{
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
        originalFullPrecisionAmount: new BigNumber("1", 10),
        fullPrecisionAmount: new BigNumber("0.6", 10),
        price: new BigNumber("0.7", 10),
        amount: new BigNumber("0.6", 10),
        originalAmount: new BigNumber("1", 10),
        tokensEscrowed: new BigNumber("0.7", 10),
        sharesEscrowed: new BigNumber("0", 10),
        tradeGroupId: null,
        orphaned: 0,
      }]);
      expect(records.trades).toEqual([{
        orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
        blockNumber: 1400101,
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000F00",
        logIndex: 0,
        marketId: "0x0000000000000000000000000000000000000001",
        outcome: 0,
        shareToken: "0x0100000000000000000000000000000000000000",
        orderType: "buy",
        creator: "0x0000000000000000000000000000000000000b0b",
        filler: "FILLER_ADDRESS",
        numCreatorTokens: new BigNumber("0.4", 10),
        numCreatorShares: new BigNumber("0", 10),
        numFillerTokens: new BigNumber("0", 10),
        numFillerShares: new BigNumber("2", 10),
        marketCreatorFees: new BigNumber("0", 10),
        reporterFees: new BigNumber("0", 10),
        price: new BigNumber("0.7", 10),
        amount: new BigNumber("0.4", 10),
        tradeGroupId: "TRADE_GROUP_ID",
      }]);
      expect(records.markets).toEqual({
        volume: new BigNumber("0.28", 10),
        shareVolume: new BigNumber("0.4", 10),
        sharesOutstanding: new BigNumber("2", 10),
      });
      expect(records.outcomes).toEqual([
        {
          price: new BigNumber("0.7", 10),
          volume: new BigNumber("100.28", 10),
          shareVolume: new BigNumber("12.9", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
      ]);
      expect(records.categories).toEqual({
        popularity: 0.4,
      });

      await processOrderFilledLogRemoval(trx, augur, log);
      const recordsAfterRemoval = await getState(trx, log, aux);
      expect(recordsAfterRemoval.orders).toEqual([{
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
      }]);
      expect(recordsAfterRemoval.trades).toEqual([]);
      expect(recordsAfterRemoval.markets).toEqual({
        volume: new BigNumber("0", 10),
        shareVolume: new BigNumber("0", 10),
        sharesOutstanding: new BigNumber("2", 10),
      });
      expect(recordsAfterRemoval.outcomes).toEqual([
        { price: new BigNumber("0.7", 10), volume: new BigNumber("100", 10), shareVolume: new BigNumber("12.5", 10) },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
        {
          price: new BigNumber("0.125", 10),
          volume: new BigNumber("100", 10),
          shareVolume: new BigNumber("12.5", 10),
        },
      ]);
      expect(recordsAfterRemoval.categories).toEqual({
        popularity: 0,
      });
    });
  });

  afterEach(async () => {
    await db.destroy();
  });
});
