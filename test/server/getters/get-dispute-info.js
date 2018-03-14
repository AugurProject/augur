"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getDisputeInfo } = require("../../../build/server/getters/get-dispute-info");


describe("server/getters/get-dispute-info", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        getDisputeInfo(db, t.params.marketIds, t.params.account, (err, disputeInfo) => {
          t.assertions(err, disputeInfo);
          done();
        });
      });
    });
  };
  test({
    description: "get dispute info from 2 markets for user 0x21",
    params: {
      marketIds: [
        "0x0000000000000000000000000000000000000211",
        "0x0000000000000000000000000000000000000011",
      ],
      account: "0x0000000000000000000000000000000000000021",
    },
    assertions: (err, disputeInfo) => {
      assert.isNull(err);
      assert.deepEqual(disputeInfo, [
        {
          marketId: "0x0000000000000000000000000000000000000211",
          stakeCompletedTotal: "102",
          stakes: [
            {
              payout: [
                10000,
                0,
              ],
              isInvalid: false,
              size: "204",
              stakeCurrent: "0",
              stakeRemaining: "204",
              accountStakeCurrent: "0",
              accountStakeCompleted: "0",
              stakeCompleted: "0",
              tentativeWinning: false,
            },
            {
              payout: [
                0,
                10000,
              ],
              isInvalid: false,
              accountStakeCompleted: "0",
              stakeCurrent: "0",
              stakeCompleted: "102",
              tentativeWinning: true,
            },
            {
              payout: [
                5000,
                5000,
              ],
              isInvalid: true,
              size: "204",
              stakeCurrent: "20",
              stakeRemaining: "184",
              accountStakeCurrent: "0",
              accountStakeCompleted: "0",
              stakeCompleted: "0",
              tentativeWinning: false,
            },
          ],
          disputeRound: 0,
        },
        {
          marketId: "0x0000000000000000000000000000000000000011",
          stakeCompletedTotal: "20102",
          stakes: [
            {
              payout: [
                0,
                2,
              ],
              isInvalid: false,
              size: "60000",
              stakeCurrent: "40000",
              stakeRemaining: "20000",
              accountStakeCurrent: "17",
              accountStakeCompleted: "0",
              stakeCompleted: "102",
              tentativeWinning: false,
            },
            {
              payout: [
                1,
                1,
              ],
              isInvalid: true,
              accountStakeCompleted: "500",
              stakeCurrent: "0",
              stakeCompleted: "20000",
              tentativeWinning: true,
            },
          ],
          disputeRound: 1,
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
    assertions: (err, disputeInfo) => {
      assert.isNull(err);
      assert.deepEqual(disputeInfo, [
        null,
        {
          marketId: "0x0000000000000000000000000000000000000211",
          stakeCompletedTotal: "102",
          stakes: [
            {
              payout: [
                10000,
                0,
              ],
              isInvalid: false,
              size: "204",
              stakeCurrent: "0",
              stakeRemaining: "204",
              accountStakeCurrent: "0",
              accountStakeCompleted: "0",
              stakeCompleted: "0",
              tentativeWinning: false,
            },
            {
              payout: [
                0,
                10000,
              ],
              isInvalid: false,
              accountStakeCompleted: "0",
              stakeCurrent: "0",
              stakeCompleted: "102",
              tentativeWinning: true,
            },
            {
              payout: [
                5000,
                5000,
              ],
              isInvalid: true,
              size: "204",
              stakeCurrent: "20",
              stakeRemaining: "184",
              accountStakeCurrent: "0",
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
    assertions: (err, disputeInfo) => {
      assert.isNull(err);
      assert.deepEqual(disputeInfo, [
        {
          marketId: "0x0000000000000000000000000000000000000011",
          stakeCompletedTotal: "20102",
          stakes: [
            {
              payout: [
                0,
                2,
              ],
              isInvalid: false,
              size: "60000",
              stakeCurrent: "40000",
              stakeRemaining: "20000",
              accountStakeCurrent: "0",
              accountStakeCompleted: "0",
              stakeCompleted: "102",
              tentativeWinning: false,
            },
            {
              payout: [
                1,
                1,
              ],
              isInvalid: true,
              accountStakeCompleted: "0",
              stakeCurrent: "0",
              stakeCompleted: "20000",
              tentativeWinning: true,
            },
          ],
          disputeRound: 1,
        },
        {
          marketId: "0x0000000000000000000000000000000000000211",
          stakeCompletedTotal: "102",
          stakes: [
            {
              payout: [
                10000,
                0,
              ],
              isInvalid: false,
              size: "204",
              stakeCurrent: "0",
              stakeRemaining: "204",
              accountStakeCurrent: "0",
              accountStakeCompleted: "0",
              stakeCompleted: "0",
              tentativeWinning: false,
            },
            {
              payout: [
                0,
                10000,
              ],
              isInvalid: false,
              accountStakeCompleted: "0",
              stakeCurrent: "0",
              stakeCompleted: "102",
              tentativeWinning: true,
            },
            {
              payout: [
                5000,
                5000,
              ],
              isInvalid: true,
              size: "204",
              stakeCurrent: "20",
              stakeRemaining: "184",
              accountStakeCurrent: "0",
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
    assertions: (err, disputeInfo) => {
      assert.isNull(err);
      assert.deepEqual(disputeInfo, [null]);
    },
  });
  test({
    description: "Empty marketIds array",
    params: {
      marketIds: [],
    },
    assertions: (err, disputeInfo) => {
      assert.isNull(err);
      assert.deepEqual(disputeInfo, []);
    },
  });
});
