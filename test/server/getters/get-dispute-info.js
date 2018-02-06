"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getDisputeInfo } = require("../../../build/server/getters/get-dispute-info");


describe("server/getters/get-dispute-info", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        getDisputeInfo(db, t.params.marketIDs, (err, disputeInfo) => {
          t.assertions(err, disputeInfo);
          done();
        });
      });
    });
  };
  test({
    description: "get dispute info from 2 markets",
    params: {
      marketIDs: [
        "0x0000000000000000000000000000000000000211",
        "0x0000000000000000000000000000000000000011",
      ],
    },
    assertions: (err, disputeInfo) => {
      assert.isNull(err);
      assert.deepEqual(disputeInfo, [
        {
          marketID: "0x0000000000000000000000000000000000000211",
          stakes: [
            {
              isInvalid: false,
              payout: [
                0,
                10000,
              ],
              totalStaked: 122,
              size: 204,
              amountStaked: 20,
            },
          ],
        },
        {
          marketID: "0x0000000000000000000000000000000000000011",
          stakes: [
            {
              isInvalid: false,
              payout: [
                0,
                2,
              ],
              totalStaked: 20000,
              size: 20000,
              amountStaked: 20000,
            },
            {
              isInvalid: true,
              payout: [
                1,
                1,
              ],
              totalStaked: 20000,
              size: 40000,
              amountStaked: 20000,
            },
          ],
        },
      ]);
    },
  });
  test({
    description: "get dispute info by specifying market IDs, with a missing market",
    params: {
      marketIDs: [
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
          marketID: "0x0000000000000000000000000000000000000211",
          stakes: [
            {
              isInvalid: false,
              payout: [
                0,
                10000,
              ],
              totalStaked: 122,
              size: 204,
              amountStaked: 20,
            },
          ],
        },
        null,
      ]);
    },
  });
  test({
    description: "get dispute info by specifying market IDs, reversed",
    params: {
      marketIDs: [
        "0x0000000000000000000000000000000000000011",
        "0x0000000000000000000000000000000000000211",
      ],
    },
    assertions: (err, disputeInfo) => {
      assert.isNull(err);
      assert.deepEqual(disputeInfo, [
        {
          marketID: "0x0000000000000000000000000000000000000011",
          stakes: [
            {
              isInvalid: false,
              payout: [
                0,
                2,
              ],
              totalStaked: 20000,
              size: 20000,
              amountStaked: 20000,
            },
            {
              isInvalid: true,
              payout: [
                1,
                1,
              ],
              totalStaked: 20000,
              size: 40000,
              amountStaked: 20000,
            },
          ],
        },
        {
          marketID: "0x0000000000000000000000000000000000000211",
          stakes: [
            {
              isInvalid: false,
              payout: [
                0,
                10000,
              ],
              totalStaked: 122,
              size: 204,
              amountStaked: 20,
            },
          ],
        },
      ]);
    },
  });
  test({
    description: "market does not exist",
    params: {
      marketIDs: ["0x1010101010101010101010101010101010101010"],
    },
    assertions: (err, disputeInfo) => {
      assert.isNull(err);
      assert.deepEqual(disputeInfo, [null]);
    },
  });
  test({
    description: "Empty marketIDs array",
    params: {
      marketIDs: [],
    },
    assertions: (err, disputeInfo) => {
      assert.isNull(err);
      assert.deepEqual(disputeInfo, []);
    },
  });
});
