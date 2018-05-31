"use strict";

const { BigNumber } = require("bignumber.js");
const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getWinningBalance } = require("../../../build/server/getters/get-winning-balance");


describe("server/getters/get-winning-balance", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        getWinningBalance(db, t.params.augur, t.params.marketIds, t.params.account, (err, winningBalance) => {
          t.assertions(err, winningBalance);
          db.destroy();
          done();
        });
      });
    });
  };
  test({
    description: "get winning balances that exist",
    params: {
      marketIds: ["0x0000000000000000000000000000000000000019"],
      account: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (err, winningBalance) => {
      assert.ifError(err);
      assert.deepEqual(winningBalance, [
        {
          marketId: "0x0000000000000000000000000000000000000019",
          winnings: new BigNumber("100000000000"),
        },
      ]);
    },
  });
  test({
    description: "get winning balances that do not exist",
    params: {
      marketIds: ["0xf0f0f0f0f0f0f0f0b0b0b0b0b0b0b0f0f0f0f0b0"],
      account: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (err, winningBalance) => {
      assert.ifError(err);
      assert.deepEqual(winningBalance, []);
    },
  });
});
