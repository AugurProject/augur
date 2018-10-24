const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-account-transfer-history", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
      const db = await setupTestDb();
      t.method = "getAccountTransferHistory";
      const accountTransferHistory = await dispatchJsonRpcRequest(db, t, null);
      t.assertions(accountTransferHistory);
      db.destroy();
      done();
    });
  };
  runTest({
    description: "get account transfer history for all tokens",
    params: {
      account: "0x0000000000000000000000000000000000000b0b",
      token: null,
      isSortDescending: false,
    },
    assertions: (accountTransferHistory) => {
            expect(accountTransferHistory).toEqual([{
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
        isInternalTransfer: 0,
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
        isInternalTransfer: 1,
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
        isInternalTransfer: 0,
      }]);
    },
  });
  runTest({
    description: "get account transfer history for all tokens, excluding trades",
    params: {
      account: "0x0000000000000000000000000000000000000b0b",
      isInternalTransfer: false,
      token: null,
      isSortDescending: false,
    },
    assertions: (accountTransferHistory) => {
            expect(accountTransferHistory).toEqual([{
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
        isInternalTransfer: 0,
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
        isInternalTransfer: 0,
      }]);
    },
  });
  runTest({
    description: "get account transfer history for all tokens, filtered to date",
    params: {
      account: "0x0000000000000000000000000000000000000b0b",
      token: null,
      isSortDescending: false,
      earliestCreationTime: 1506473473,
      latestCreationTime: 1506473474,
    },
    assertions: (accountTransferHistory) => {
            expect(accountTransferHistory).toEqual([{
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
        isInternalTransfer: 0,
      }]);
    },
  });
  runTest({
    description: "get account transfer history for REP tokens only",
    params: {
      account: "0x0000000000000000000000000000000000000b0b",
      token: "0x7a305d9b681fb164dc5ad628b5992177dc66aec8",
      isSortDescending: false,
    },
    assertions: (accountTransferHistory) => {
            expect(accountTransferHistory).toEqual([{
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
        isInternalTransfer: 0,
      }]);
    },
  });
  runTest({
    description: "get account transfer history for nonexistent token",
    params: {
      account: "0x0000000000000000000000000000000000000b0b",
      token: "0x000000000000000000000000000000000000000e",
    },
    assertions: (accountTransferHistory) => {
            expect(accountTransferHistory).toEqual([]);
    },
  });
  runTest({
    description: "get account transfer history for nonexistent account",
    params: {
      account: "0x0000000000000000000000000000000000000bbb",
      token: null,
    },
    assertions: (accountTransferHistory) => {
            expect(accountTransferHistory).toEqual([]);
    },
  });
});
