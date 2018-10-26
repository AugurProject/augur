const { BigNumber } = require("bignumber.js");
const setupTestDb = require("../../test.database");
const { processTradingProceedsClaimedLog, processTradingProceedsClaimedLogRemoval } = require("src/blockchain/log-processors/trading-proceeds-claimed");

function getTradingProceeds(db) {
  return db.select(["marketId", "shareToken", "account", "numShares", "numPayoutTokens"]).from("trading_proceeds");
}

const augur =       {
  utils: {
    convertOnChainPriceToDisplayPrice: (onChainPrice, minDisplayPrice, tickSize) => {
      return onChainPrice.times(tickSize).plus(minDisplayPrice);
    },
  },
  trading: {
    getPositionInMarket: (p, callback) => {
      callback(null, ["2", "0", "0", "0", "0", "0", "0", "0"]);
    },
  },
};

describe("blockchain/log-processors/trading-proceeds-claimed", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  const log =        {
    transactionHash: "TRANSACTION_HASH",
    logIndex: 0,
    blockNumber: 1400101,
    market: "0x0000000000000000000000000000000000000001",
    shareToken: "SHARE_TOKEN_ADDRESS",
    sender: "FROM_ADDRESS",
    numShares: new BigNumber("140", 10),
    numPayoutTokens: new BigNumber("9000", 10),
  };

  test("Claim Trading Proceeds", async () => {
    return db.transaction(async (trx) => {
      await(await processTradingProceedsClaimedLog(augur, log))(trx);
      await expect(getTradingProceeds(trx)).resolves.toEqual([{
        account: "FROM_ADDRESS",
        marketId: "0x0000000000000000000000000000000000000001",
        numShares: new BigNumber("140", 10),
        numPayoutTokens: new BigNumber("9000", 10),
        shareToken: "SHARE_TOKEN_ADDRESS",
      }]);
      await(await processTradingProceedsClaimedLogRemoval(augur, log))(trx);
      await expect(getTradingProceeds(trx)).resolves.toEqual([]);
    });
  });

  afterEach(async () => {
    await db.destroy();
  });
});
