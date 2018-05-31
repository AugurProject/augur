"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getAccountTransferHistory } = require("../../../build/server/getters/get-account-transfer-history");

describe("server/getters/get-account-transfer-history", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        getAccountTransferHistory(db, t.params.account, t.params.token, t.params.earliestCreationTime, t.params.latestCreationTime, t.params.sortBy, t.params.isSortDescending, t.params.limit, t.params.offset, (err, accountTransferHistory) => {
          t.assertions(err, accountTransferHistory);
          db.destroy();
          done();
        });
      });
    });
  };
  test({
    description: "get account transfer history for all tokens",
    params: {
      account: "0x0000000000000000000000000000000000000b0b",
      token: null,
      isSortDescending: false,
    },
    assertions: (err, accountTransferHistory) => {
      assert.ifError(err);
      assert.deepEqual(accountTransferHistory, [{
        transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadbeef",
        logIndex: 0,
        creationBlockNumber: 1400000,
        blockHash: "0x1400000",
        creationTime: 1506473474,
        sender: "0x0000000000000000000000000000000000000b0b",
        recipient: "0x000000000000000000000000000000000000d00d",
        token: "0x0100000000000000000000000000000000000000",
        value: "10",
        symbol: "shares",
        marketId: "0x0000000000000000000000000000000000000001",
        outcome: 0,
      }, {
        transactionHash: "0x00000000000000000000000000000000000000000000000000000000d3adb33f",
        logIndex: 0,
        creationBlockNumber: 1400001,
        blockHash: "0x1400001",
        creationTime: 1506473500,
        sender: "0x000000000000000000000000000000000000d00d",
        recipient: "0x0000000000000000000000000000000000000b0b",
        token: "0x0100000000000000000000000000000000000000",
        value: "2",
        symbol: "shares",
        marketId: "0x0000000000000000000000000000000000000001",
        outcome: 0,
      }, {
        transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadb33f",
        logIndex: 1,
        creationBlockNumber: 1400001,
        blockHash: "0x1400001",
        creationTime: 1506473500,
        sender: "0x0000000000000000000000000000000000000b0b",
        recipient: "0x000000000000000000000000000000000000d00d",
        token: "0x7a305d9b681fb164dc5ad628b5992177dc66aec8",
        value: "47",
        symbol: "REP",
        marketId: null,
        outcome: null,
      }]);
    },
  });
  test({
    description: "get account transfer history for all tokens, filtered to date",
    params: {
      account: "0x0000000000000000000000000000000000000b0b",
      token: null,
      isSortDescending: false,
      earliestCreationTime: 1506473473,
      latestCreationTime: 1506473474,
    },
    assertions: (err, accountTransferHistory) => {
      assert.ifError(err);
      assert.deepEqual(accountTransferHistory, [{
        transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadbeef",
        logIndex: 0,
        creationBlockNumber: 1400000,
        blockHash: "0x1400000",
        creationTime: 1506473474,
        sender: "0x0000000000000000000000000000000000000b0b",
        recipient: "0x000000000000000000000000000000000000d00d",
        token: "0x0100000000000000000000000000000000000000",
        value: "10",
        symbol: "shares",
        marketId: "0x0000000000000000000000000000000000000001",
        outcome: 0,
      }]);
    },
  });
  test({
    description: "get account transfer history for REP tokens only",
    params: {
      account: "0x0000000000000000000000000000000000000b0b",
      token: "0x7a305d9b681fb164dc5ad628b5992177dc66aec8",
      isSortDescending: false,
    },
    assertions: (err, accountTransferHistory) => {
      assert.ifError(err);
      assert.deepEqual(accountTransferHistory, [{
        transactionHash: "0x00000000000000000000000000000000000000000000000000000000deadb33f",
        creationBlockNumber: 1400001,
        blockHash: "0x1400001",
        creationTime: 1506473500,
        logIndex: 1,
        sender: "0x0000000000000000000000000000000000000b0b",
        recipient: "0x000000000000000000000000000000000000d00d",
        token: "0x7a305d9b681fb164dc5ad628b5992177dc66aec8",
        value: "47",
        symbol: "REP",
        marketId: null,
        outcome: null,
      }]);
    },
  });
  test({
    description: "get account transfer history for nonexistent token",
    params: {
      account: "0x0000000000000000000000000000000000000b0b",
      token: "0x000000000000000000000000000000000000000e",
    },
    assertions: (err, accountTransferHistory) => {
      assert.ifError(err);
      assert.deepEqual(accountTransferHistory, []);
    },
  });
  test({
    description: "get account transfer history for nonexistent account",
    params: {
      account: "0x0000000000000000000000000000000000000bbb",
      token: null,
    },
    assertions: (err, accountTransferHistory) => {
      assert.ifError(err);
      assert.deepEqual(accountTransferHistory, []);
    },
  });
});
