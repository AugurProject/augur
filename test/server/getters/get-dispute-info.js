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
          stakes: [
            {
              isInvalid: false,
              payout: [
                10000,
                0,
              ],
              accountStakeComplete: "0",
              accountStakeIncomplete: "0",
              totalStake: "0",
              completedStake: "0",
              size: "204",
              currentStake: "0",
              tentativeWinning: false,
            },
            {
              isInvalid: false,
              payout: [
                0,
                10000,
              ],
              accountStakeComplete: "0",
              totalStake: "102",
              completedStake: "102",
              tentativeWinning: true,
            },
            {
              isInvalid: true,
              payout: [
                5000,
                5000,
              ],
              accountStakeComplete: "0",
              accountStakeIncomplete: "0",
              totalStake: "20",
              completedStake: "0",
              size: "204",
              currentStake: "20",
              tentativeWinning: false,
            },
          ],
          disputeRound: 0,
        },
        {
          marketId: "0x0000000000000000000000000000000000000011",
          stakes: [
            {
              isInvalid: false,
              payout: [
                0,
                2,
              ],
              accountStakeComplete: "0",
              accountStakeIncomplete: "17",
              totalStake: "40102",
              completedStake: "102",
              size: "60000",
              currentStake: "40000",
              tentativeWinning: false,
            },
            {
              isInvalid: true,
              payout: [
                1,
                1,
              ],
              accountStakeComplete: "500",
              totalStake: "20000",
              completedStake: "20000",
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
          stakes: [
            {
              isInvalid: false,
              payout: [
                10000,
                0,
              ],
              accountStakeComplete: "0",
              accountStakeIncomplete: "0",
              totalStake: "0",
              completedStake: "0",
              size: "204",
              currentStake: "0",
              tentativeWinning: false,
            },
            {
              isInvalid: false,
              payout: [
                0,
                10000,
              ],
              accountStakeComplete: "0",
              totalStake: "102",
              completedStake: "102",
              tentativeWinning: true,
            },
            {
              isInvalid: true,
              payout: [
                5000,
                5000,
              ],
              accountStakeComplete: "0",
              accountStakeIncomplete: "0",
              totalStake: "20",
              completedStake: "0",
              size: "204",
              currentStake: "20",
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
          stakes: [
            {
              isInvalid: false,
              payout: [
                0,
                2,
              ],
              accountStakeComplete: "0",
              accountStakeIncomplete: "0",
              totalStake: "40102",
              completedStake: "102",
              size: "60000",
              currentStake: "40000",
              tentativeWinning: false,
            },
            {
              isInvalid: true,
              payout: [
                1,
                1,
              ],
              accountStakeComplete: "0",
              totalStake: "20000",
              completedStake: "20000",
              tentativeWinning: true,
            },
          ],
          disputeRound: 1,
        },
        {
          marketId: "0x0000000000000000000000000000000000000211",
          stakes: [
            {
              isInvalid: false,
              payout: [
                10000,
                0,
              ],
              accountStakeComplete: "0",
              accountStakeIncomplete: "0",
              totalStake: "0",
              completedStake: "0",
              size: "204",
              currentStake: "0",
              tentativeWinning: false,
            },
            {
              isInvalid: false,
              payout: [
                0,
                10000,
              ],
              accountStakeComplete: "0",
              totalStake: "102",
              completedStake: "102",
              tentativeWinning: true,
            },
            {
              isInvalid: true,
              payout: [
                5000,
                5000,
              ],
              accountStakeComplete: "0",
              accountStakeIncomplete: "0",
              totalStake: "20",
              completedStake: "0",
              size: "204",
              currentStake: "20",
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
