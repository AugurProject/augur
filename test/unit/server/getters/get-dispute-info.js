const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-dispute-info", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  afterEach(async () => {
    await db.destroy();
  });

  const runTest = (t) => {
    test(t.description, async () => {
      t.method = "getDisputeInfo";
      const disputeInfo = await dispatchJsonRpcRequest(db, t, null);
      t.assertions(disputeInfo);
    });
  };
  runTest({
    description: "get dispute info from 2 markets for user 0xb0b (an initial reporter)",
    params: {
      marketIds: [
        "0x0000000000000000000000000000000000000211",
        "0x0000000000000000000000000000000000000011",
      ],
      account: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (disputeInfo) => {
      expect(disputeInfo).toEqual([
        {
          marketId: "0x0000000000000000000000000000000000000211",
          stakeCompletedTotal: "102",
          bondSizeOfNewStake: "204",
          stakes: [
            {
              payout: [
                "10000",
                "0",
              ],
              isInvalid: false,
              bondSizeCurrent: "204",
              stakeCurrent: "0",
              accountStakeCurrent: "0",
              accountStakeTotal: "0",
              stakeRemaining: "204",
              bondSizeTotal: "204",
              accountStakeCompleted: "0",
              stakeCompleted: "0",
              tentativeWinning: false,
            },
            {
              payout: [
                "0",
                "10000",
              ],
              isInvalid: false,
              accountStakeCompleted: "102",
              stakeCurrent: "0",
              stakeCompleted: "102",
              tentativeWinning: true,
            },
            {
              payout: [
                "5000",
                "5000",
              ],
              isInvalid: true,
              bondSizeCurrent: "204",
              stakeCurrent: "20",
              accountStakeCurrent: "0",
              accountStakeTotal: "0",
              stakeRemaining: "184",
              bondSizeTotal: "204",
              accountStakeCompleted: "0",
              stakeCompleted: "0",
              tentativeWinning: false,
            },
          ],
          disputeRound: 1,
        },
        {
          marketId: "0x0000000000000000000000000000000000000011",
          stakeCompletedTotal: "30102",
          bondSizeOfNewStake: "60204",
          stakes: [
            {
              payout: [
                "0",
                "2",
              ],
              isInvalid: false,
              bondSizeCurrent: "30000",
              stakeCurrent: "30000",
              accountStakeCurrent: "102",
              accountStakeTotal: "204",
              stakeRemaining: "0",
              bondSizeTotal: "40102",
              accountStakeCompleted: "102",
              stakeCompleted: "10102",
              tentativeWinning: false,
            },
            {
              payout: [
                "1",
                "1",
              ],
              isInvalid: true,
              accountStakeCompleted: "0",
              stakeCurrent: "0",
              stakeCompleted: "20000",
              tentativeWinning: true,
            },
          ],
          disputeRound: 3,
        },
      ]);
    },
  });
  runTest({
    description: "get dispute info from 2 markets for user 0x21",
    params: {
      marketIds: [
        "0x0000000000000000000000000000000000000211",
        "0x0000000000000000000000000000000000000011",
      ],
      account: "0x0000000000000000000000000000000000000021",
    },
    assertions: (disputeInfo) => {
      expect(disputeInfo).toEqual([
        {
          marketId: "0x0000000000000000000000000000000000000211",
          stakeCompletedTotal: "102",
          bondSizeOfNewStake: "204",
          stakes: [
            {
              payout: [
                "10000",
                "0",
              ],
              isInvalid: false,
              bondSizeCurrent: "204",
              stakeCurrent: "0",
              accountStakeCurrent: "0",
              accountStakeTotal: "0",
              stakeRemaining: "204",
              bondSizeTotal: "204",
              accountStakeCompleted: "0",
              stakeCompleted: "0",
              tentativeWinning: false,
            },
            {
              payout: [
                "0",
                "10000",
              ],
              isInvalid: false,
              accountStakeCompleted: "0",
              stakeCurrent: "0",
              stakeCompleted: "102",
              tentativeWinning: true,
            },
            {
              payout: [
                "5000",
                "5000",
              ],
              isInvalid: true,
              bondSizeCurrent: "204",
              stakeCurrent: "20",
              accountStakeCurrent: "0",
              accountStakeTotal: "0",
              stakeRemaining: "184",
              bondSizeTotal: "204",
              accountStakeCompleted: "0",
              stakeCompleted: "0",
              tentativeWinning: false,
            },
          ],
          disputeRound: 1,
        },
        {
          marketId: "0x0000000000000000000000000000000000000011",
          stakeCompletedTotal: "30102",
          bondSizeOfNewStake: "60204",
          stakes: [
            {
              payout: [
                "0",
                "2",
              ],
              isInvalid: false,
              bondSizeCurrent: "30000",
              stakeCurrent: "30000",
              accountStakeCurrent: "0",
              accountStakeTotal: "17",
              stakeRemaining: "0",
              bondSizeTotal: "40102",
              accountStakeCompleted: "17",
              stakeCompleted: "10102",
              tentativeWinning: false,
            },
            {
              payout: [
                "1",
                "1",
              ],
              isInvalid: true,
              accountStakeCompleted: "500",
              stakeCurrent: "0",
              stakeCompleted: "20000",
              tentativeWinning: true,
            },
          ],
          disputeRound: 3,
        },
      ]);
    },
  });
  runTest({
    description: "get dispute info by specifying market IDs, with a missing market",
    params: {
      marketIds: [
        "0x0000000000000000000000088888888888888888",
        "0x0000000000000000000000000000000000000211",
        "0x0000000000000000000000077777777777777777",
      ],
    },
    assertions: (disputeInfo) => {
      expect(disputeInfo).toEqual([
        null,
        {
          marketId: "0x0000000000000000000000000000000000000211",
          stakeCompletedTotal: "102",
          bondSizeOfNewStake: "204",
          stakes: [
            {
              payout: [
                "10000",
                "0",
              ],
              isInvalid: false,
              bondSizeCurrent: "204",
              stakeCurrent: "0",
              accountStakeCurrent: "0",
              accountStakeTotal: "0",
              stakeRemaining: "204",
              bondSizeTotal: "204",
              accountStakeCompleted: "0",
              stakeCompleted: "0",
              tentativeWinning: false,
            },
            {
              payout: [
                "0",
                "10000",
              ],
              isInvalid: false,
              accountStakeCompleted: "0",
              stakeCurrent: "0",
              stakeCompleted: "102",
              tentativeWinning: true,
            },
            {
              payout: [
                "5000",
                "5000",
              ],
              isInvalid: true,
              bondSizeCurrent: "204",
              stakeCurrent: "20",
              accountStakeCurrent: "0",
              accountStakeTotal: "0",
              stakeRemaining: "184",
              bondSizeTotal: "204",
              accountStakeCompleted: "0",
              stakeCompleted: "0",
              tentativeWinning: false,
            },
          ],
          disputeRound: 1,
        },
        null,
      ]);
    },
  });
  runTest({
    description: "get dispute info by specifying market IDs, reversed",
    params: {
      marketIds: [
        "0x0000000000000000000000000000000000000011",
        "0x0000000000000000000000000000000000000211",
      ],
    },
    assertions: (disputeInfo) => {
      expect(disputeInfo).toEqual([
        {
          marketId: "0x0000000000000000000000000000000000000011",
          stakeCompletedTotal: "30102",
          bondSizeOfNewStake: "60204",
          stakes: [
            {
              payout: [
                "0",
                "2",
              ],
              isInvalid: false,
              bondSizeCurrent: "30000",
              stakeCurrent: "30000",
              accountStakeCurrent: "0",
              accountStakeTotal: "0",
              stakeRemaining: "0",
              bondSizeTotal: "40102",
              accountStakeCompleted: "0",
              stakeCompleted: "10102",
              tentativeWinning: false,
            },
            {
              payout: [
                "1",
                "1",
              ],
              isInvalid: true,
              accountStakeCompleted: "0",
              stakeCurrent: "0",
              stakeCompleted: "20000",
              tentativeWinning: true,
            },
          ],
          disputeRound: 3,
        },
        {
          marketId: "0x0000000000000000000000000000000000000211",
          stakeCompletedTotal: "102",
          bondSizeOfNewStake: "204",
          stakes: [
            {
              payout: [
                "10000",
                "0",
              ],
              isInvalid: false,
              bondSizeCurrent: "204",
              stakeCurrent: "0",
              accountStakeCurrent: "0",
              accountStakeTotal: "0",
              stakeRemaining: "204",
              bondSizeTotal: "204",
              accountStakeCompleted: "0",
              stakeCompleted: "0",
              tentativeWinning: false,
            },
            {
              payout: [
                "0",
                "10000",
              ],
              isInvalid: false,
              accountStakeCompleted: "0",
              stakeCurrent: "0",
              stakeCompleted: "102",
              tentativeWinning: true,
            },
            {
              payout: [
                "5000",
                "5000",
              ],
              isInvalid: true,
              bondSizeCurrent: "204",
              stakeCurrent: "20",
              accountStakeCurrent: "0",
              accountStakeTotal: "0",
              stakeRemaining: "184",
              bondSizeTotal: "204",
              accountStakeCompleted: "0",
              stakeCompleted: "0",
              tentativeWinning: false,
            },
          ],
          disputeRound: 1,
        },
      ]);
    },
  });
  runTest({
    description: "market does not exist",
    params: {
      marketIds: ["0x1010101010101010101010101010101010101010"],
    },
    assertions: (disputeInfo) => {
      expect(disputeInfo).toEqual([null]);
    },
  });
  runTest({
    description: "Empty marketIds array",
    params: {
      marketIds: [],
    },
    assertions: (disputeInfo) => {
      expect(disputeInfo).toEqual([]);
    },
  });

  test("marketIds array with null, expect error", async () => {
    const params = {
      marketIds: [undefined],
      account: "0x0000000000000000000000000000000000000b0b",
    };
    try {
      await expect(dispatchJsonRpcRequest(db, { method: "getDisputeInfo", params }, null));
      throw new Error("Did not fail");
    } catch (err) {
      expect(err.message).toMatch("Invalid request object");
    }
  });
});
