"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("../../../../build/server/dispatch-json-rpc-request");


describe("server/getters/get-dispute-info", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        t.method = "getDisputeInfo";
        dispatchJsonRpcRequest(db, t, null, (err, disputeInfo) => {
          t.assertions(disputeInfo);
          done(err);
          db.destroy();
        })
      });
    });
  };
  test({
    description: "get dispute info from 2 markets for user 0xb0b (an initial reporter)",
    params: {
      marketIds: [
        "0x0000000000000000000000000000000000000211",
        "0x0000000000000000000000000000000000000011",
      ],
      account: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (disputeInfo) => {
      assert.deepEqual(disputeInfo, [
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
          disputeRound: 0,
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
          disputeRound: 2,
        },
      ]);
    },
  });
  test({
    description: "get dispute info from 2 markets for user 0x21",
    params: {
      marketIds: [
        "0x0000000000000000000000000000000000000211",
        "0x0000000000000000000000000000000000000011",
      ],
      account: "0x0000000000000000000000000000000000000021",
    },
    assertions: (disputeInfo) => {
      assert.deepEqual(disputeInfo, [
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
          disputeRound: 0,
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
          disputeRound: 2,
        },
      ]);
    },
  });
  test({
    description: "get dispute info by specifying market IDs, with a missing market",
    params: {
      marketIds: [
        "0x0000000000000000000000088888888888888888",
        "0x0000000000000000000000000000000000000211",
        "0x0000000000000000000000077777777777777777",
      ],
    },
    assertions: (disputeInfo) => {
      assert.deepEqual(disputeInfo, [
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
          disputeRound: 0,
        },
        null,
      ]);
    },
  });
  test({
    description: "get dispute info by specifying market IDs, reversed",
    params: {
      marketIds: [
        "0x0000000000000000000000000000000000000011",
        "0x0000000000000000000000000000000000000211",
      ],
    },
    assertions: (disputeInfo) => {
      assert.deepEqual(disputeInfo, [
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
          disputeRound: 2,
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
          disputeRound: 0,
        },
      ]);
    },
  });
  test({
    description: "market does not exist",
    params: {
      marketIds: ["0x1010101010101010101010101010101010101010"],
    },
    assertions: (disputeInfo) => {
      assert.deepEqual(disputeInfo, [null]);
    },
  });
  test({
    description: "marketIds array with null",
    params: {
      marketIds: [undefined],
      account: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (disputeInfo) => {
      assert.deepEqual(disputeInfo, []);
    },
  });
  test({
    description: "Empty marketIds array",
    params: {
      marketIds: [],
    },
    assertions: (disputeInfo) => {
      assert.deepEqual(disputeInfo, []);
    },
  });
});
