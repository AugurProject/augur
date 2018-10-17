"use strict";

const { BigNumber } = require("bignumber.js");
const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-winning-balance", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
      const db = await setupTestDb();
      t.method = "getWinningBalance";
      dispatchJsonRpcRequest(db, t, {}, (err, winningBalance) => {
        t.assertions(err, winningBalance);
        db.destroy();
        done();
      });
    })
  };
  runTest({
    description: "get winning balances that exist",
    params: {
      marketIds: ["0x0000000000000000000000000000000000000019"],
      account: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (err, winningBalance) => {
      expect(err).toBeFalsy();
      expect(winningBalance).toEqual([
        {
          marketId: "0x0000000000000000000000000000000000000019",
          winnings: new BigNumber("100000000000"),
        },
      ]);
    },
  });
  runTest({
    description: "get winning balances that do not exist",
    params: {
      marketIds: ["0xf0f0f0f0f0f0f0f0b0b0b0b0b0b0b0f0f0f0f0b0"],
      account: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (err, winningBalance) => {
      expect(err).toBeFalsy();
      expect(winningBalance).toEqual([]);
    },
  });
});
