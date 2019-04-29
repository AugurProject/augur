import { setupTestDb } from 'test/unit/test.database';
import { BigNumber } from "../../types";

import { processBurnLog, processBurnLogRemoval } from './token/burn';

function getTokenBalances(db, log) {
  return db.select(["balances.owner", "balances.token", "balances.balance", "token_supply.supply"])
    .from("balances")
    .join("token_supply", "balances.token", "token_supply.token")
    .where("balances.token", log.token);
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

describe("blockchain/log-processors/tokens-burned", () => {
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
    amount: new BigNumber("9000"),
  };
  test("Tokens burned", async () => {
    return db.transaction(async (trx) => {
      await(await processBurnLog(augur, log))(trx);

      await expect(getTokenBalances(trx, log)).resolves.toEqual([{
        owner: "FROM_ADDRESS",
        token: "TOKEN_ADDRESS",
        balance: new BigNumber("1"),
        supply: new BigNumber("1"),
      }]);
      await(await processBurnLogRemoval(augur, log))(trx);

      await expect(getTokenBalances(trx, log)).resolves.toEqual([{
        owner: "FROM_ADDRESS",
        token: "TOKEN_ADDRESS",
        balance: new BigNumber("9001"),
        supply: new BigNumber("9001"),
      }]);
    });
  });

  afterEach(async () => {
    await db.destroy();
  });
});
