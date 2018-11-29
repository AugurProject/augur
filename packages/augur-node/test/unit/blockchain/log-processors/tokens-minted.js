const setupTestDb = require("../../test.database");
const { BigNumber } = require("bignumber.js");
const { processMintLog, processMintLogRemoval } = require("src/blockchain/log-processors/token/mint");

function getTokenBalances(db, log) {
  return db.select(["balances.owner", "balances.token", "balances.balance", "token_supply.supply"]).from("balances").join("token_supply", "balances.token", "token_supply.token").where("balances.token", log.token);
}

const augur = {
  contracts: {
    addresses: {
      974: {
        LegacyReputationToken: "OTHER_ADDRESS",
      },
    },
  },
  rpc: {
    getNetworkID: () => 974,
  },
};

describe("blockchain/log-processors/tokens-minted", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  const log = {
    transactionHash: "TRANSACTION_HASH",
    logIndex: 0,
    blockNumber: 1400101,
    target: "FROM_ADDRESS",
    token: "TOKEN_ADDRESS",
    amount: new BigNumber("10", 10),
  };
  test("Tokens minted", async () => {
    return db.transaction(async (trx) => {
      await(await processMintLog(augur, log))(trx);

      await expect(getTokenBalances(trx, log)).resolves.toEqual([{
        owner: "FROM_ADDRESS",
        token: "TOKEN_ADDRESS",
        balance: new BigNumber("9011", 10),
        supply: new BigNumber("9011", 10),
      }]);

      await(await processMintLogRemoval(augur, log))(trx);

      await expect(getTokenBalances(trx, log)).resolves.toEqual([{
        owner: "FROM_ADDRESS",
        token: "TOKEN_ADDRESS",
        balance: new BigNumber("9001", 10),
        supply: new BigNumber("9001", 10),
      }]);

    });
  });

  afterEach(async () => {
    await db.destroy();
  });

});
