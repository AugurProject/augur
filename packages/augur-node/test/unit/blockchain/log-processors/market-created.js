const Augur = require("augur.js");
const { BigNumber } = require("bignumber.js");
const setupTestDb = require("../../test.database");
const { processMarketCreatedLog, processMarketCreatedLogRemoval } = require("src/blockchain/log-processors/market-created");
const { getMarketsWithReportingState } = require("src/server/getters/database");

async function getState(db, log) {
  return {
    markets: await getMarketsWithReportingState(db).where({ "markets.marketId": log.market }),
    categories: await db("categories").where({ category: log.topic }),
    outcomes: await db("outcomes").where({ marketId: log.market }),
    tokens: await db("tokens").select(["contractAddress", "symbol", "marketId", "outcome"]).where({ marketId: log.market }),
    search: await db("search_en").where({ marketId: log.market }),
    transfers: await db("transfers").where({ recipient: log.market }),
  };
}

describe("blockchain/log-processors/market-created", () => {
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
        await(await processMarketCreatedLog(t.params.augur, t.params.log))(trx);
        t.assertions.onAdded(await getState(trx, t.params.log), false);
        await(await processMarketCreatedLogRemoval(t.params.augur, t.params.log))(trx);
        t.assertions.onRemoved(await getState(trx, t.params.log));
        await(await processMarketCreatedLog(t.params.augur, t.params.log))(trx);
        t.assertions.onAdded(await getState(trx, t.params.log), true);
        await(await processMarketCreatedLogRemoval(t.params.augur, t.params.log))(trx);
        t.assertions.onRemoved(await getState(trx, t.params.log));
      });
    });
  };
  const constants = new Augur().constants;
  runTest({
    description: "yesNo market MarketCreated log and removal",
    params: {
      log: {
        blockNumber: 7,
        transactionHash: "0x000000000000000000000000000000000000000000000000000000000000A000",
        logIndex: 0,
        universe: "0x000000000000000000000000000000000000000b",
        market: "0x1111111111111111111111111111111111111111",
        marketCreator: "0x0000000000000000000000000000000000000b0b",
        marketCreationFee: "0.1",
        topic: "TEST_CATEGORY",
        marketType: "0",
        minPrice: (new BigNumber("0", 10)).toString(),
        maxPrice: "1",
        description: "this is a test market",
        extraInfo: {
          tags: ["TEST_TAG_1", "TEST_TAG_2"],
          longDescription: "this is the long description of a test market",
          resolutionSource: "https://www.trusted-third-party-co.com",
        },
      },
      augur: {
        api: {
          Market: {
            getDisputeWindow: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111111");
              return Promise.resolve("0x1000000000000000000000000000000000000001");
            },
            getEndTime: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111111");
              return Promise.resolve("4886718345");
            },
            getDesignatedReporter: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111111");
              return Promise.resolve("0x000000000000000000000000000000000000b0b2");
            },
            getNumTicks: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111111");
              return Promise.resolve("10000");
            },
            getMarketCreatorSettlementFeeDivisor: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111111");
              return Promise.resolve("100");
            },
            getMarketCreatorMailbox: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111111");
              return Promise.resolve("0xbbb1111111111111111111111111111111111111");
            },
            getShareToken: (p) => {
              return Promise.resolve(`SHARE_TOKEN_${p._outcome}`);
            },
            getValidityBondAttoEth: (p) => {
              return Promise.resolve("800");
            },
          },
          Universe: {
            getOrCacheReportingFeeDivisor: (p) => {
              expect(p.tx.to).toBe("0x000000000000000000000000000000000000000b");
              return Promise.resolve("1000");
            },
          },
        },
        constants,
      },
    },
    assertions: {
      onAdded: (records, isReAdded) => {

        expect(records).toEqual({
          markets: [{
            marketId: "0x1111111111111111111111111111111111111111",
            universe: "0x000000000000000000000000000000000000000b",
            marketType: "yesNo",
            numOutcomes: 3,
            minPrice: new BigNumber("0", 10),
            maxPrice: new BigNumber("1", 10),
            marketCreator: "0x0000000000000000000000000000000000000b0b",
            transactionHash: "0x000000000000000000000000000000000000000000000000000000000000A000",
            logIndex: 0,
            creationBlockNumber: 7,
            creationFee: new BigNumber("0.1", 10),
            creationTime: 10000000,
            reportingFeeRate: new BigNumber("0.001", 10),
            disputeRounds: null,
            marketCreatorFeeRate: new BigNumber("0.01", 10),
            marketCreatorFeesBalance: new BigNumber("0", 10),
            marketCreatorMailbox: "0xbbb1111111111111111111111111111111111111",
            marketCreatorMailboxOwner: "0x0000000000000000000000000000000000000b0b",
            initialReportSize: null,
            validityBondSize: new BigNumber("800", 10),
            category: "TEST_CATEGORY",
            tag1: "TEST_TAG_1",
            tag2: "TEST_TAG_2",
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            sharesOutstanding: new BigNumber("0", 10),
            openInterest: new BigNumber("0", 10),
            reportingState: "PRE_REPORTING",
            disputeWindow: "0x1000000000000000000000000000000000000001",
            endTime: 4886718345,
            finalizationBlockNumber: null,
            lastTradeBlockNumber: null,
            marketStateId: isReAdded ? 19 : 18,
            shortDescription: "this is a test market",
            longDescription: "this is the long description of a test market",
            scalarDenomination: null,
            designatedReporter: "0x000000000000000000000000000000000000b0b2",
            designatedReportStake: new BigNumber("16777216", 10),
            resolutionSource: "https://www.trusted-third-party-co.com",
            numTicks: new BigNumber("10000", 10),
            consensusPayoutId: null,
            isInvalid: null,
            forking: 0,
            needsMigration: 0,
            needsDisavowal: 0,
          }],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [{
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 0,
            price: new BigNumber("0.33333333333333333333", 10),
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            description: "Invalid",
          }, {
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 1,
            price: new BigNumber("0.33333333333333333333", 10),
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            description: null,
          }, {
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 2,
            price: new BigNumber("0.33333333333333333333", 10),
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            description: null,
          }],
          search: [{
            category: "TEST_CATEGORY",
            longDescription: "this is the long description of a test market",
            resolutionSource: "https://www.trusted-third-party-co.com",
            scalarDenomination: "",
            shortDescription: "this is a test market",
            tags: "TEST_TAG_1 TEST_TAG_2",
            marketId: "0x1111111111111111111111111111111111111111",
          }],
          tokens: [{
            contractAddress: "SHARE_TOKEN_0",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 0,
          }, {
            contractAddress: "SHARE_TOKEN_1",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 1,
          }, {
            contractAddress: "SHARE_TOKEN_2",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 2,
          }],
          transfers: [{
            blockNumber: 7,
            logIndex: 0,
            recipient: "0x1111111111111111111111111111111111111111",
            sender: "0x0000000000000000000000000000000000000b0b",
            token: "ether",
            transactionHash: "0x000000000000000000000000000000000000000000000000000000000000A000",
            value: new BigNumber("800", 10),
          }],
        });
      },
      onRemoved: (records) => {

        expect(records).toEqual({
          markets: [],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [],
          search: [],
          tokens: [],
          transfers: [],
        });
      },
    },
  });
  runTest({
    description: "categorical market MarketCreated log and removal",
    params: {
      log: {
        blockNumber: 7,
        transactionHash: "0x000000000000000000000000000000000000000000000000000000000000A001",
        logIndex: 0,
        universe: "0x000000000000000000000000000000000000000b",
        market: "0x1111111111111111111111111111111111111112",
        marketCreator: "0x0000000000000000000000000000000000000b0b",
        marketCreationFee: "0.1",
        topic: "TEST_CATEGORY",
        marketType: "1",
        minPrice: (new BigNumber("0", 10)).toString(),
        maxPrice: (new BigNumber("1", 10)).toString(),
        description: "this is a test market",
        outcomes: ["test outcome 0", "test outcome 1", "test outcome 2", "test outcome 3"],
        extraInfo: {
          tags: ["TEST_TAG_1", "TEST_TAG_2"],
          longDescription: "this is the long description of a test market",
          resolutionSource: "https://www.trusted-third-party-co.com",
        },
      },
      augur: {
        api: {
          Market: {
            getDisputeWindow: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111112");
              return Promise.resolve("0x1000000000000000000000000000000000000001");
            },
            getEndTime: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111112");
              return Promise.resolve("4886718345");
            },
            getDesignatedReporter: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111112");
              return Promise.resolve("0x000000000000000000000000000000000000b0b2");
            },
            getNumTicks: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111112");
              return Promise.resolve("10000");
            },
            getMarketCreatorSettlementFeeDivisor: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111112");
              return Promise.resolve("100");
            },
            getMarketCreatorMailbox: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111112");
              return Promise.resolve("0xbbb1111111111111111111111111111111111112");
            },
            getShareToken: (p) => {
              return Promise.resolve(`SHARE_TOKEN_${p._outcome}`);
            },
            getValidityBondAttoEth: (p) => {
              return Promise.resolve("800");
            },
          },
          Universe: {
            getOrCacheReportingFeeDivisor: (p) => {
              expect(p.tx.to).toBe("0x000000000000000000000000000000000000000b");
              return Promise.resolve("1000");
            },
          },
        },
        constants,
      },
    },
    assertions: {
      onAdded: (records, isReAdded) => {

        expect(records).toEqual({
          markets: [{
            marketId: "0x1111111111111111111111111111111111111112",
            universe: "0x000000000000000000000000000000000000000b",
            marketType: "categorical",
            numOutcomes: 5,
            minPrice: new BigNumber("0", 10),
            maxPrice: new BigNumber("1", 10),
            marketCreator: "0x0000000000000000000000000000000000000b0b",
            transactionHash: "0x000000000000000000000000000000000000000000000000000000000000A001",
            logIndex: 0,
            creationBlockNumber: 7,
            creationFee: new BigNumber("0.1", 10),
            creationTime: 10000000,
            reportingFeeRate: new BigNumber("0.001", 10),
            disputeRounds: null,
            marketCreatorFeeRate: new BigNumber("0.01", 10),
            marketCreatorFeesBalance: new BigNumber("0", 10),
            marketCreatorMailbox: "0xbbb1111111111111111111111111111111111112",
            marketCreatorMailboxOwner: "0x0000000000000000000000000000000000000b0b",
            initialReportSize: null,
            validityBondSize: new BigNumber("800", 10),
            category: "TEST_CATEGORY",
            tag1: "TEST_TAG_1",
            tag2: "TEST_TAG_2",
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            sharesOutstanding: new BigNumber("0", 10),
            openInterest: new BigNumber("0", 10),
            reportingState: "PRE_REPORTING",
            disputeWindow: "0x1000000000000000000000000000000000000001",
            endTime: 4886718345,
            finalizationBlockNumber: null,
            lastTradeBlockNumber: null,
            marketStateId: isReAdded ? 19 : 18,
            shortDescription: "this is a test market",
            longDescription: "this is the long description of a test market",
            scalarDenomination: null,
            designatedReporter: "0x000000000000000000000000000000000000b0b2",
            designatedReportStake: new BigNumber("16777216", 10),
            resolutionSource: "https://www.trusted-third-party-co.com",
            numTicks: new BigNumber("10000", 10),
            consensusPayoutId: null,
            isInvalid: null,
            forking: 0,
            needsMigration: 0,
            needsDisavowal: 0,
          }],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [{
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 0,
            price: new BigNumber("0.2", 10),
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            description: "Invalid",
          }, {
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 1,
            price: new BigNumber("0.2", 10),
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            description: "test outcome 0",
          }, {
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 2,
            price: new BigNumber("0.2", 10),
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            description: "test outcome 1",
          }, {
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 3,
            price: new BigNumber("0.2", 10),
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            description: "test outcome 2",
          }, {
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 4,
            price: new BigNumber("0.2", 10),
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            description: "test outcome 3",
          }],
          search: [{
            category: "TEST_CATEGORY",
            longDescription: "this is the long description of a test market",
            resolutionSource: "https://www.trusted-third-party-co.com",
            scalarDenomination: "",
            shortDescription: "this is a test market",
            tags: "TEST_TAG_1 TEST_TAG_2",
            marketId: "0x1111111111111111111111111111111111111112",
          }],
          tokens: [{
            contractAddress: "SHARE_TOKEN_0",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 0,
          }, {
            contractAddress: "SHARE_TOKEN_1",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 1,
          }, {
            contractAddress: "SHARE_TOKEN_2",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 2,
          }, {
            contractAddress: "SHARE_TOKEN_3",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 3,
          }, {
            contractAddress: "SHARE_TOKEN_4",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 4,
          }],
          transfers: [{
            blockNumber: 7,
            logIndex: 0,
            recipient: "0x1111111111111111111111111111111111111112",
            sender: "0x0000000000000000000000000000000000000b0b",
            token: "ether",
            transactionHash: "0x000000000000000000000000000000000000000000000000000000000000A001",
            value: new BigNumber("800", 10),
          }],
        });
      },
      onRemoved: (records) => {

        expect(records).toEqual({
          markets: [],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [],
          search: [],
          tokens: [],
          transfers: [],
        });
      },
    },
  });
  runTest({
    description: "scalar market MarketCreated log and removal",
    params: {
      log: {
        blockNumber: 7,
        transactionHash: "0x000000000000000000000000000000000000000000000000000000000000A002",
        logIndex: 0,
        universe: "0x000000000000000000000000000000000000000b",
        market: "0x1111111111111111111111111111111111111113",
        marketCreator: "0x0000000000000000000000000000000000000b0b",
        marketCreationFee: "0.1",
        topic: "TEST_CATEGORY",
        marketType: "2",
        minPrice: (new BigNumber("-3", 10)).toString(),
        maxPrice: (new BigNumber("15.2", 10)).toString(),
        description: "this is a test market",
        extraInfo: {
          tags: ["TEST_TAG_1", "TEST_TAG_2"],
          longDescription: "this is the long description of a test market",
          resolutionSource: "https://www.trusted-third-party-co.com",
        },
      },
      augur: {
        api: {
          Market: {
            getDisputeWindow: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111113");
              return Promise.resolve("0x1000000000000000000000000000000000000001");
            },
            getEndTime: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111113");
              return Promise.resolve("4886718345");
            },
            getDesignatedReporter: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111113");
              return Promise.resolve("0x000000000000000000000000000000000000b0b2");
            },
            getNumTicks: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111113");
              return Promise.resolve("10000");
            },
            getMarketCreatorSettlementFeeDivisor: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111113");
              return Promise.resolve("100");
            },
            getMarketCreatorMailbox: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111113");
              return Promise.resolve("0xbbb1111111111111111111111111111111111113");
            },
            getShareToken: (p) => {
              return Promise.resolve(`SHARE_TOKEN_${p._outcome}`);
            },
            getValidityBondAttoEth: (p) => {
              return Promise.resolve("800");
            },
          },
          Universe: {
            getOrCacheReportingFeeDivisor: (p) => {
              expect(p.tx.to).toBe("0x000000000000000000000000000000000000000b");
              return Promise.resolve("1000");
            },
          },
        },
        constants,
      },
    },
    assertions: {
      onAdded: (records, isReAdded) => {

        expect(records).toEqual({
          markets: [{
            marketId: "0x1111111111111111111111111111111111111113",
            universe: "0x000000000000000000000000000000000000000b",
            marketType: "scalar",
            numOutcomes: 3,
            minPrice: new BigNumber("-3", 10),
            maxPrice: new BigNumber("15.2", 10),
            marketCreator: "0x0000000000000000000000000000000000000b0b",
            transactionHash: "0x000000000000000000000000000000000000000000000000000000000000A002",
            logIndex: 0,
            creationBlockNumber: 7,
            creationFee: new BigNumber("0.1", 10),
            creationTime: 10000000,
            reportingFeeRate: new BigNumber("0.001", 10),
            disputeRounds: null,
            marketCreatorFeeRate: new BigNumber("0.01", 10),
            marketCreatorFeesBalance: new BigNumber("0", 10),
            marketCreatorMailbox: "0xbbb1111111111111111111111111111111111113",
            marketCreatorMailboxOwner: "0x0000000000000000000000000000000000000b0b",
            initialReportSize: null,
            validityBondSize: new BigNumber("800", 10),
            category: "TEST_CATEGORY",
            tag1: "TEST_TAG_1",
            tag2: "TEST_TAG_2",
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            sharesOutstanding: new BigNumber("0", 10),
            openInterest: new BigNumber("0", 10),
            reportingState: "PRE_REPORTING",
            disputeWindow: "0x1000000000000000000000000000000000000001",
            endTime: 4886718345,
            finalizationBlockNumber: null,
            lastTradeBlockNumber: null,
            marketStateId: isReAdded ? 19 : 18,
            shortDescription: "this is a test market",
            longDescription: "this is the long description of a test market",
            scalarDenomination: null,
            designatedReporter: "0x000000000000000000000000000000000000b0b2",
            designatedReportStake: new BigNumber("16777216", 10),
            resolutionSource: "https://www.trusted-third-party-co.com",
            numTicks: new BigNumber("10000", 10),
            consensusPayoutId: null,
            isInvalid: null,
            forking: 0,
            needsMigration: 0,
            needsDisavowal: 0,
          }],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [{
            marketId: "0x1111111111111111111111111111111111111113",
            outcome: 0,
            price: new BigNumber("4.06666666666666666667", 10),
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            description: "Invalid",
          }, {
            marketId: "0x1111111111111111111111111111111111111113",
            outcome: 1,
            price: new BigNumber("4.06666666666666666667", 10),
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            description: null,
          }, {
            marketId: "0x1111111111111111111111111111111111111113",
            outcome: 2,
            price: new BigNumber("4.06666666666666666667", 10),
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            description: null,
          }],
          search: [{
            category: "TEST_CATEGORY",
            longDescription: "this is the long description of a test market",
            resolutionSource: "https://www.trusted-third-party-co.com",
            scalarDenomination: "",
            shortDescription: "this is a test market",
            tags: "TEST_TAG_1 TEST_TAG_2",
            marketId: "0x1111111111111111111111111111111111111113",
          }],
          tokens: [{
            contractAddress: "SHARE_TOKEN_0",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111113",
            outcome: 0,
          }, {
            contractAddress: "SHARE_TOKEN_1",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111113",
            outcome: 1,
          }, {
            contractAddress: "SHARE_TOKEN_2",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111113",
            outcome: 2,
          }],
          transfers: [{
            blockNumber: 7,
            logIndex: 0,
            recipient: "0x1111111111111111111111111111111111111113",
            sender: "0x0000000000000000000000000000000000000b0b",
            token: "ether",
            transactionHash: "0x000000000000000000000000000000000000000000000000000000000000A002",
            value: new BigNumber("800", 10),
          }],
        });
      },
      onRemoved: (records) => {

        expect(records).toEqual({
          markets: [],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [],
          search: [],
          tokens: [],
          transfers: [],
        });
      },
    },
  });
  runTest({
    description: "yesNo market MarketCreated log and removal, with NULL extraInfo",
    params: {
      log: {
        blockNumber: 7,
        transactionHash: "0x000000000000000000000000000000000000000000000000000000000000A003",
        logIndex: 0,
        universe: "0x000000000000000000000000000000000000000b",
        market: "0x1111111111111111111111111111111111111111",
        marketCreator: "0x0000000000000000000000000000000000000b0b",
        marketCreationFee: "0.1",
        topic: "TEST_CATEGORY",
        marketType: "0",
        minPrice: (new BigNumber("0", 10)).toString(),
        maxPrice: (new BigNumber("1", 10)).toString(),
        description: "this is a test market",
        extraInfo: null,
      },
      augur: {
        api: {
          Market: {
            getDisputeWindow: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111111");
              return Promise.resolve("0x1000000000000000000000000000000000000001");
            },
            getEndTime: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111111");
              return Promise.resolve("4886718345");
            },
            getDesignatedReporter: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111111");
              return Promise.resolve("0x000000000000000000000000000000000000b0b2");
            },
            getNumTicks: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111111");
              return Promise.resolve("10000");
            },
            getMarketCreatorSettlementFeeDivisor: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111111");
              return Promise.resolve("100");
            },
            getMarketCreatorMailbox: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111111");
              return Promise.resolve("0xbbb1111111111111111111111111111111111111");
            },
            getShareToken: (p) => {
              return Promise.resolve(`SHARE_TOKEN_${p._outcome}`);
            },
            getValidityBondAttoEth: (p) => {
              return Promise.resolve("800");
            },
          },
          Universe: {
            getOrCacheReportingFeeDivisor: (p) => {
              expect(p.tx.to).toBe("0x000000000000000000000000000000000000000b");
              return Promise.resolve("1000");
            },
          },
        },
        constants,
      },
    },
    assertions: {
      onAdded: (records, isReAdded) => {

        expect(records).toEqual({
          markets: [{
            marketId: "0x1111111111111111111111111111111111111111",
            universe: "0x000000000000000000000000000000000000000b",
            marketType: "yesNo",
            numOutcomes: 3,
            minPrice: new BigNumber("0", 10),
            maxPrice: new BigNumber("1", 10),
            marketCreator: "0x0000000000000000000000000000000000000b0b",
            transactionHash: "0x000000000000000000000000000000000000000000000000000000000000A003",
            logIndex: 0,
            creationBlockNumber: 7,
            creationFee: new BigNumber("0.1", 10),
            creationTime: 10000000,
            reportingFeeRate: new BigNumber("0.001", 10),
            disputeRounds: null,
            marketCreatorFeeRate: new BigNumber("0.01", 10),
            marketCreatorFeesBalance: new BigNumber("0", 10),
            marketCreatorMailbox: "0xbbb1111111111111111111111111111111111111",
            marketCreatorMailboxOwner: "0x0000000000000000000000000000000000000b0b",
            initialReportSize: null,
            validityBondSize: new BigNumber("800", 10),
            category: "TEST_CATEGORY",
            tag1: null,
            tag2: null,
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            sharesOutstanding: new BigNumber("0", 10),
            openInterest: new BigNumber("0", 10),
            reportingState: "PRE_REPORTING",
            disputeWindow: "0x1000000000000000000000000000000000000001",
            endTime: 4886718345,
            finalizationBlockNumber: null,
            lastTradeBlockNumber: null,
            marketStateId: isReAdded ? 19 : 18,
            shortDescription: "this is a test market",
            longDescription: null,
            scalarDenomination: null,
            designatedReporter: "0x000000000000000000000000000000000000b0b2",
            designatedReportStake: new BigNumber("16777216", 10),
            resolutionSource: null,
            numTicks: new BigNumber("10000", 10),
            consensusPayoutId: null,
            isInvalid: null,
            forking: 0,
            needsMigration: 0,
            needsDisavowal: 0,
          }],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [{
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 0,
            price: new BigNumber("0.33333333333333333333", 10),
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            description: "Invalid",
          }, {
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 1,
            price: new BigNumber("0.33333333333333333333", 10),
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            description: null,
          }, {
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 2,
            price: new BigNumber("0.33333333333333333333", 10),
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            description: null,
          }],
          search: [{
            category: "TEST_CATEGORY",
            longDescription: "",
            resolutionSource: "",
            scalarDenomination: "",
            shortDescription: "this is a test market",
            marketId: "0x1111111111111111111111111111111111111111",
            tags: "",
          }],
          tokens: [{
            contractAddress: "SHARE_TOKEN_0",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 0,
          }, {
            contractAddress: "SHARE_TOKEN_1",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 1,
          }, {
            contractAddress: "SHARE_TOKEN_2",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 2,
          }],
          transfers: [{
            blockNumber: 7,
            logIndex: 0,
            recipient: "0x1111111111111111111111111111111111111111",
            sender: "0x0000000000000000000000000000000000000b0b",
            token: "ether",
            transactionHash: "0x000000000000000000000000000000000000000000000000000000000000A003",
            value: new BigNumber("800", 10),
          }],
        });
      },
      onRemoved: (records) => {

        expect(records).toEqual({
          markets: [],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [],
          search: [],
          tokens: [],
          transfers: [],
        });
      },
    },
  });
  runTest({
    description: "yesNo market MarketCreated log and removal, with 0 creator fee rate",
    params: {
      log: {
        blockNumber: 7,
        transactionHash: "0x000000000000000000000000000000000000000000000000000000000000A004",
        logIndex: 0,
        universe: "0x000000000000000000000000000000000000000b",
        market: "0x1111111111111111111111111111111111111111",
        marketCreator: "0x0000000000000000000000000000000000000b0b",
        marketCreationFee: "0",
        topic: "TEST_CATEGORY",
        marketType: "0",
        minPrice: (new BigNumber("0", 10)).toString(),
        maxPrice: "1",
        description: "this is a test market",
        extraInfo: {
          tags: ["TEST_TAG_1", "TEST_TAG_2"],
          longDescription: "this is the long description of a test market",
          resolutionSource: "https://www.trusted-third-party-co.com",
        },
      },
      augur: {
        api: {
          Market: {
            getNumberOfOutcomes: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111111");
              return Promise.resolve("2");
            },
            getDisputeWindow: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111111");
              return Promise.resolve("0x1000000000000000000000000000000000000001");
            },
            getEndTime: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111111");
              return Promise.resolve("4886718345");
            },
            getDesignatedReporter: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111111");
              return Promise.resolve("0x000000000000000000000000000000000000b0b2");
            },
            getNumTicks: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111111");
              return Promise.resolve("10000");
            },
            getMarketCreatorSettlementFeeDivisor: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111111");
              return Promise.resolve("100");
            },
            getMarketCreatorMailbox: (p) => {
              expect(p.tx.to).toBe("0x1111111111111111111111111111111111111111");
              return Promise.resolve("0xbbb1111111111111111111111111111111111111");
            },
            getShareToken: (p) => {
              return Promise.resolve(`SHARE_TOKEN_${p._outcome}`);
            },
            getValidityBondAttoEth: (p) => {
              return Promise.resolve("800");
            },
          },
          Universe: {
            getOrCacheReportingFeeDivisor: (p) => {
              expect(p.tx.to).toBe("0x000000000000000000000000000000000000000b");
              return Promise.resolve("1000");
            },
          },
        },
        constants,
      },
    },
    assertions: {
      onAdded: (records, isReAdded) => {

        expect(records).toEqual({
          markets: [{
            marketId: "0x1111111111111111111111111111111111111111",
            universe: "0x000000000000000000000000000000000000000b",
            marketType: "yesNo",
            numOutcomes: 3,
            minPrice: new BigNumber("0", 10),
            maxPrice: new BigNumber("1", 10),
            marketCreator: "0x0000000000000000000000000000000000000b0b",
            transactionHash: "0x000000000000000000000000000000000000000000000000000000000000A004",
            logIndex: 0,
            creationBlockNumber: 7,
            creationFee: new BigNumber("0", 10),
            creationTime: 10000000,
            openInterest: new BigNumber("0", 10),
            reportingFeeRate: new BigNumber("0.001", 10),
            disputeRounds: null,
            marketCreatorFeeRate: new BigNumber("0.01", 10),
            marketCreatorFeesBalance: new BigNumber("0", 10),
            marketCreatorMailbox: "0xbbb1111111111111111111111111111111111111",
            marketCreatorMailboxOwner: "0x0000000000000000000000000000000000000b0b",
            initialReportSize: null,
            validityBondSize: new BigNumber("800", 10),
            category: "TEST_CATEGORY",
            tag1: "TEST_TAG_1",
            tag2: "TEST_TAG_2",
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            sharesOutstanding: new BigNumber("0", 10),
            reportingState: "PRE_REPORTING",
            disputeWindow: "0x1000000000000000000000000000000000000001",
            endTime: 4886718345,
            finalizationBlockNumber: null,
            lastTradeBlockNumber: null,
            marketStateId: isReAdded ? 19 : 18,
            shortDescription: "this is a test market",
            longDescription: "this is the long description of a test market",
            scalarDenomination: null,
            designatedReporter: "0x000000000000000000000000000000000000b0b2",
            designatedReportStake: new BigNumber("16777216", 10),
            resolutionSource: "https://www.trusted-third-party-co.com",
            numTicks: new BigNumber("10000", 10),
            consensusPayoutId: null,
            isInvalid: null,
            forking: 0,
            needsMigration: 0,
            needsDisavowal: 0,
          }],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [{
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 0,
            price: new BigNumber("0.33333333333333333333", 10),
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            description: "Invalid",
          }, {
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 1,
            price: new BigNumber("0.33333333333333333333", 10),
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            description: null,
          }, {
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 2,
            price: new BigNumber("0.33333333333333333333", 10),
            volume: new BigNumber("0", 10),
            shareVolume: new BigNumber("0", 10),
            description: null,
          }],
          search: [{
            category: "TEST_CATEGORY",
            longDescription: "this is the long description of a test market",
            shortDescription: "this is a test market",
            tags: "TEST_TAG_1 TEST_TAG_2",
            resolutionSource: "https://www.trusted-third-party-co.com",
            scalarDenomination: "",
            marketId: "0x1111111111111111111111111111111111111111",
          }],
          tokens: [{
            contractAddress: "SHARE_TOKEN_0",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 0,
          }, {
            contractAddress: "SHARE_TOKEN_1",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 1,
          }, {
            contractAddress: "SHARE_TOKEN_2",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 2,
          }],
          transfers: [{
            blockNumber: 7,
            logIndex: 0,
            recipient: "0x1111111111111111111111111111111111111111",
            sender: "0x0000000000000000000000000000000000000b0b",
            token: "ether",
            transactionHash: "0x000000000000000000000000000000000000000000000000000000000000A004",
            value: new BigNumber("800", 10),
          }],
        });
      },
      onRemoved: (records) => {
        expect(records).toEqual({
          markets: [],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [],
          search: [],
          tokens: [],
          transfers: [],
        });
      },
    },
  });
});
