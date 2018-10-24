const setupTestDb = require("../../test.database");
const { BigNumber } = require("bignumber.js");
const { processTokensTransferredLog, processTokensTransferredLogRemoval } = require("src/blockchain/log-processors/tokens-transferred");

async function getState(db, log) {
  return {
    transfers: await db("transfers").where({
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
    }),
    balances: await db("balances").where({ token: log.token }),
  };
}

describe("blockchain/log-processors/tokens-transferred", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });


  afterEach(async () => {
    await db.destroy();
  });

  const runTest = (t) => {
    test(t.description, async () => {
      return db.transaction(async (trx) => {
        await processTokensTransferredLog(trx, t.params.augur, t.params.log);

        const records = await getState(trx, t.params.log);
        t.assertions.onAdded(records.transfers);
        t.assertions.onInitialBalances(records.balances);
        await processTokensTransferredLogRemoval(trx, t.params.augur, t.params.log);

        const recordsAfterRemoval = await getState(trx, t.params.log);

        t.assertions.onRemoved(recordsAfterRemoval.transfers);
        t.assertions.onRemovedBalances(recordsAfterRemoval.balances);
      });
    });
  };
  runTest({
    description: "TokensTransferred log and removal",
    params: {
      log: {
        transactionHash: "TRANSACTION_HASH",
        logIndex: 0,
        from: "FROM_ADDRESS",
        to: "TO_ADDRESS",
        token: "TOKEN_ADDRESS",
        value: "9000",
        blockNumber: 1400101,
      },
      augur: {
        contracts: {
          addresses: {
            974: {
              LegacyReputationToken: "OTHER_ADDRESS",
            },
          },
        },
        rpc: {
          getNetworkID: () => 974,
        },
      },
    },
    assertions: {
      onAdded: (records) => {

        expect(records).toEqual([{
          transactionHash: "TRANSACTION_HASH",
          logIndex: 0,
          sender: "FROM_ADDRESS",
          recipient: "TO_ADDRESS",
          token: "TOKEN_ADDRESS",
          value: new BigNumber("9000", 10),
          blockNumber: 1400101,
        }]);
      },
      onRemoved: (records) => {

        expect(records).toEqual([]);
      },
      onInitialBalances: (balances) => {

        expect(balances).toEqual([{
          token: "TOKEN_ADDRESS",
          owner: "FROM_ADDRESS",
          balance: new BigNumber("1", 10),
        }, {
          token: "TOKEN_ADDRESS",
          owner: "TO_ADDRESS",
          balance: new BigNumber("9000", 10),
        }]);
      },
      onRemovedBalances: (balances) => {

        expect(balances).toEqual([{
          token: "TOKEN_ADDRESS",
          owner: "FROM_ADDRESS",
          balance: new BigNumber("9001", 10),
        }, {
          token: "TOKEN_ADDRESS",
          owner: "TO_ADDRESS",
          balance: new BigNumber("0", 10),
        }]);
      },
    },
  });
  runTest({
    description: "TokensTransferred log and removal, LegacyReputationToken",
    params: {
      log: {
        transactionHash: "TRANSACTION_HASH",
        logIndex: 0,
        from: "FROM_ADDRESS",
        to: "TO_ADDRESS",
        token: "LEGACY_REPUTATION_ADDRESS",
        value: "9000",
        blockNumber: 1400101,
      },
      augur: {
        contracts: {
          addresses: {
            974: {
              LegacyReputationToken: "LEGACY_REPUTATION_ADDRESS",
            },
          },
        },
        rpc: {
          getNetworkID: () => 974,
        },
      },
    },
    assertions: {
      onAdded: (records) => {

        expect(records).toEqual([{
          transactionHash: "TRANSACTION_HASH",
          logIndex: 0,
          sender: "FROM_ADDRESS",
          recipient: "TO_ADDRESS",
          token: "LEGACY_REPUTATION_ADDRESS",
          value: new BigNumber("9000", 10),
          blockNumber: 1400101,
        }]);
      },
      onRemoved: (records) => {

        expect(records).toEqual([]);
      },
      onInitialBalances: (balances) => {

        expect(balances).toEqual([]);
      },
      onRemovedBalances: (balances) => {

        expect(balances).toEqual([]);
      },
    },
  });
  runTest({
    description: "TokensTransferred for ShareToken log and removal",
    params: {
      log: {
        transactionHash: "TRANSACTION_HASH",
        logIndex: 0,
        from: "FROM_ADDRESS",
        to: "TO_ADDRESS",
        token: "TOKEN_ADDRESS",
        value: new BigNumber("2", 10),
        tokenType: 1,
        market: "0x0000000000000000000000000000000000000002",
        blockNumber: 1400101,
      },
      augur: {
        contracts: {
          addresses: {
            974: {
              LegacyReputationToken: "OTHER_ADDRESS",
            },
          },
        },
        rpc: {
          getNetworkID: () => 974,
        },
        trading: {
          calculateProfitLoss: (p) => {
            expect(typeof p).toBe("object");
            return {
              position: "2",
              realized: "0",
              unrealized: "0",
              meanOpenPrice: "0.75",
              queued: "0",
            };
          },
          normalizePrice: p => p.price,
        },
        utils: {
          convertOnChainPriceToDisplayPrice: (onChainPrice, minDisplayPrice, tickSize) => {
            return onChainPrice.times(tickSize).plus(minDisplayPrice);
          },
        },
      },
    },
    assertions: {
      onAdded: (records) => {

        expect(records).toEqual([{
          transactionHash: "TRANSACTION_HASH",
          logIndex: 0,
          sender: "FROM_ADDRESS",
          recipient: "TO_ADDRESS",
          token: "TOKEN_ADDRESS",
          value: new BigNumber("2", 10),
          blockNumber: 1400101,
        }]);
      },
      onRemoved: (records) => {

        expect(records).toEqual([]);
      },
      onInitialBalances: (balances) => {

        expect(balances).toEqual([
          {
            owner: "FROM_ADDRESS",
            token: "TOKEN_ADDRESS",
            balance: new BigNumber("8999"),
          },
          {
            owner: "TO_ADDRESS",
            token: "TOKEN_ADDRESS",
            balance: new BigNumber("2"),
          },
        ]);
      },
      onRemovedBalances: (balances) => {

      },
    },
  });
});
