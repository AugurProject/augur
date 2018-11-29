const setupTestDb = require("../../../test.database");
const { processApprovalLog, processApprovalLogRemoval } = require("src/blockchain/log-processors/token/approval");

function getState(db, log) {
  return db("approvals").where({ transactionHash: log.transactionHash, logIndex: log.logIndex });
}

describe("blockchain/log-processors/token/approval", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  const log = {
    transactionHash: "TRANSACTION_HASH",
    logIndex: 0,
    owner: "OWNER_ADDRESS",
    spender: "SPENDER_ADDRESS",
    address: "LEGACY_REP_CONTRACT_ADDRESS",
    value: "9000",
    blockNumber: 1400101,
  };
  it("LegacyReputationToken Approval log and removal", async () => {
    return db.transaction(async (trx) => {
      await(await processApprovalLog({}, log))(trx);
      await expect(getState(trx, log)).resolves.toEqual([{
        transactionHash: "TRANSACTION_HASH",
        logIndex: 0,
        owner: "OWNER_ADDRESS",
        spender: "SPENDER_ADDRESS",
        token: "LEGACY_REP_CONTRACT_ADDRESS",
        value: 9000,
        blockNumber: 1400101,
      }]);

      await(await processApprovalLogRemoval({}, log))(trx);
      await expect(getState(trx, log)).resolves.toEqual([]);
    });
  });

  afterEach(async () => {
    await db.destroy();
  });
});
