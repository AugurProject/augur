import { setupTestDb } from 'test/unit/test.database';
import { dispatchJsonRpcRequest } from '../dispatch-json-rpc-request';

describe("server/getters/get-markets-info", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  afterEach(async () => {
    await db.destroy();
  });
  const runTest = (t) => {
    test(t.description, async () => {
      t.method = "getMarketsInfo";
      const marketsInfo = await dispatchJsonRpcRequest(db, t, null);
      t.assertions(marketsInfo);
    });
  };
  runTest({
    description: "get markets by specifying market IDs",
    params: {
      marketIds: [
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000002",
      ],
    },
    assertions: (marketsInfo) => {
      expect(marketsInfo).toEqual([
        {
          id: "0x0000000000000000000000000000000000000001",
          universe: "0x000000000000000000000000000000000000000b",
          marketType: "categorical",
          numOutcomes: 8,
          minPrice: "0",
          maxPrice: "1",
          cumulativeScale: "1",
          author: "0x0000000000000000000000000000000000000b0b",
          creationTime: 1506473474,
          creationBlock: 1400000,
          settlementFee: "0.04",
          reportingFeeRate: "0.02",
          initialReportSize: null,
          category: "TEST CATEGORY",
          tags: ["test tag 1", "test tag 2"],
          volume: "0",
          openInterest: "0",
          outstandingShares: "0",
          reportingState: "DESIGNATED_REPORTING",
          forking: 0,
          needsMigration: 0,
          disputeWindow: "0x1000000000000000000000000000000000000000",
          endTime: 1506573470,
          finalizationBlockNumber: null,
          finalizationTime: null,
          lastTradeBlockNumber: null,
          lastTradeTime: null,
          scalarDenomination: null,
          description: "This is a categorical test market created by b0b.",
          details: null,
          designatedReporter: "0x0000000000000000000000000000000000000b0b",
          designatedReportStake: "10",
          resolutionSource: "http://www.trusted-third-party.com",
          numTicks: "10000",
          tickSize: "0.0001",
          consensus: null,
          outcomes: [{
            id: 0,
            volume: "100",
            price: "0.125",
            description: "outcome 0",
          }, {
            id: 1,
            volume: "100",
            price: "0.125",
            description: "outcome 1",
          }, {
            id: 2,
            volume: "100",
            price: "0.125",
            description: "outcome 2",
          }, {
            id: 3,
            volume: "100",
            price: "0.125",
            description: "outcome 3",
          }, {
            id: 4,
            volume: "100",
            price: "0.125",
            description: "outcome 4",
          }, {
            id: 5,
            volume: "100",
            price: "0.125",
            description: "outcome 5",
          }, {
            id: 6,
            volume: "100",
            price: "0.125",
            description: "outcome 6",
          }, {
            id: 7,
            volume: "100",
            price: "0.125",
            description: "outcome 7",
          }],
        },
        {
          id: "0x0000000000000000000000000000000000000002",
          universe: "0x000000000000000000000000000000000000000b",
          marketType: "yesNo",
          numOutcomes: 2,
          minPrice: "0",
          maxPrice: "1",
          cumulativeScale: "1",
          author: "0x0000000000000000000000000000000000000b0b",
          creationTime: 1506480000,
          creationBlock: 1400100,
          settlementFee: "0.03",
          reportingFeeRate: "0.02",
          initialReportSize: null,
          category: "TEST CATEGORY",
          tags: ["test tag 1", "test tag 2"],
          volume: "0",
          openInterest: "0",
          outstandingShares: "0",
          reportingState: "DESIGNATED_REPORTING",
          forking: 0,
          needsMigration: 0,
          disputeWindow: "0x1000000000000000000000000000000000000000",
          endTime: 1506573480,
          finalizationBlockNumber: null,
          finalizationTime: null,
          lastTradeBlockNumber: null,
          lastTradeTime: null,
          description: "This is a yesNo test market created by b0b.",
          scalarDenomination: null,
          details: null,
          designatedReporter: "0x0000000000000000000000000000000000000b0b",
          designatedReportStake: "10",
          resolutionSource: "http://www.trusted-third-party.com",
          numTicks: "10000",
          tickSize: "0.0001",
          consensus: null,
          outcomes: [{
            id: 0,
            volume: "1000",
            price: "0.5",
            description: "outcome 0",
          }, {
            id: 1,
            volume: "1000",
            price: "0.5",
            description: "outcome 1",
          }],
        }]);
    },
  });
  runTest({
    description: "get markets by specifying market IDs, with missing market",
    params: {
      marketIds: [
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000077777777777777777",
        "0x0000000000000000000000000000000000000002",
      ],
    },
    assertions: (marketsInfo) => {
      expect(marketsInfo).toEqual([
        {
          id: "0x0000000000000000000000000000000000000001",
          universe: "0x000000000000000000000000000000000000000b",
          marketType: "categorical",
          numOutcomes: 8,
          minPrice: "0",
          maxPrice: "1",
          cumulativeScale: "1",
          author: "0x0000000000000000000000000000000000000b0b",
          creationTime: 1506473474,
          creationBlock: 1400000,
          settlementFee: "0.04",
          reportingFeeRate: "0.02",
          initialReportSize: null,
          category: "TEST CATEGORY",
          tags: ["test tag 1", "test tag 2"],
          volume: "0",
          openInterest: "0",
          outstandingShares: "0",
          reportingState: "DESIGNATED_REPORTING",
          forking: 0,
          needsMigration: 0,
          disputeWindow: "0x1000000000000000000000000000000000000000",
          endTime: 1506573470,
          finalizationBlockNumber: null,
          finalizationTime: null,
          lastTradeBlockNumber: null,
          lastTradeTime: null,
          description: "This is a categorical test market created by b0b.",
          scalarDenomination: null,
          details: null,
          designatedReporter: "0x0000000000000000000000000000000000000b0b",
          designatedReportStake: "10",
          resolutionSource: "http://www.trusted-third-party.com",
          numTicks: "10000",
          tickSize: "0.0001",
          consensus: null,
          outcomes: [{
            id: 0,
            volume: "100",
            price: "0.125",
            description: "outcome 0",
          }, {
            id: 1,
            volume: "100",
            price: "0.125",
            description: "outcome 1",
          }, {
            id: 2,
            volume: "100",
            price: "0.125",
            description: "outcome 2",
          }, {
            id: 3,
            volume: "100",
            price: "0.125",
            description: "outcome 3",
          }, {
            id: 4,
            volume: "100",
            price: "0.125",
            description: "outcome 4",
          }, {
            id: 5,
            volume: "100",
            price: "0.125",
            description: "outcome 5",
          }, {
            id: 6,
            volume: "100",
            price: "0.125",
            description: "outcome 6",
          }, {
            id: 7,
            volume: "100",
            price: "0.125",
            description: "outcome 7",
          }],
        },
        null,
        {
          id: "0x0000000000000000000000000000000000000002",
          universe: "0x000000000000000000000000000000000000000b",
          marketType: "yesNo",
          numOutcomes: 2,
          minPrice: "0",
          maxPrice: "1",
          cumulativeScale: "1",
          author: "0x0000000000000000000000000000000000000b0b",
          creationTime: 1506480000,
          creationBlock: 1400100,
          settlementFee: "0.03",
          reportingFeeRate: "0.02",
          initialReportSize: null,
          category: "TEST CATEGORY",
          tags: ["test tag 1", "test tag 2"],
          volume: "0",
          openInterest: "0",
          outstandingShares: "0",
          reportingState: "DESIGNATED_REPORTING",
          forking: 0,
          needsMigration: 0,
          disputeWindow: "0x1000000000000000000000000000000000000000",
          endTime: 1506573480,
          finalizationBlockNumber: null,
          finalizationTime: null,
          lastTradeBlockNumber: null,
          lastTradeTime: null,
          description: "This is a yesNo test market created by b0b.",
          scalarDenomination: null,
          details: null,
          designatedReporter: "0x0000000000000000000000000000000000000b0b",
          designatedReportStake: "10",
          resolutionSource: "http://www.trusted-third-party.com",
          numTicks: "10000",
          tickSize: "0.0001",
          consensus: null,
          outcomes: [{
            id: 0,
            volume: "1000",
            price: "0.5",
            description: "outcome 0",
          }, {
            id: 1,
            volume: "1000",
            price: "0.5",
            description: "outcome 1",
          }],
        }]);
    },
  });
  runTest({
    description: "get markets by specifying market IDs, reversed",
    params: {
      marketIds: [
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000001",
      ],
    },
    assertions: (marketsInfo) => {
      expect(marketsInfo).toEqual([
        {
          id: "0x0000000000000000000000000000000000000002",
          universe: "0x000000000000000000000000000000000000000b",
          marketType: "yesNo",
          numOutcomes: 2,
          minPrice: "0",
          maxPrice: "1",
          cumulativeScale: "1",
          author: "0x0000000000000000000000000000000000000b0b",
          creationTime: 1506480000,
          creationBlock: 1400100,
          settlementFee: "0.03",
          reportingFeeRate: "0.02",
          initialReportSize: null,
          category: "TEST CATEGORY",
          tags: ["test tag 1", "test tag 2"],
          volume: "0",
          openInterest: "0",
          outstandingShares: "0",
          reportingState: "DESIGNATED_REPORTING",
          forking: 0,
          needsMigration: 0,
          disputeWindow: "0x1000000000000000000000000000000000000000",
          endTime: 1506573480,
          finalizationBlockNumber: null,
          finalizationTime: null,
          lastTradeBlockNumber: null,
          lastTradeTime: null,
          description: "This is a yesNo test market created by b0b.",
          scalarDenomination: null,
          details: null,
          designatedReporter: "0x0000000000000000000000000000000000000b0b",
          designatedReportStake: "10",
          resolutionSource: "http://www.trusted-third-party.com",
          numTicks: "10000",
          tickSize: "0.0001",
          consensus: null,
          outcomes: [{
            id: 0,
            volume: "1000",
            price: "0.5",
            description: "outcome 0",
          }, {
            id: 1,
            volume: "1000",
            price: "0.5",
            description: "outcome 1",
          }],
        },
        {
          id: "0x0000000000000000000000000000000000000001",
          universe: "0x000000000000000000000000000000000000000b",
          marketType: "categorical",
          numOutcomes: 8,
          minPrice: "0",
          maxPrice: "1",
          cumulativeScale: "1",
          author: "0x0000000000000000000000000000000000000b0b",
          creationTime: 1506473474,
          creationBlock: 1400000,
          settlementFee: "0.04",
          reportingFeeRate: "0.02",
          initialReportSize: null,
          category: "TEST CATEGORY",
          tags: ["test tag 1", "test tag 2"],
          volume: "0",
          openInterest: "0",
          outstandingShares: "0",
          reportingState: "DESIGNATED_REPORTING",
          forking: 0,
          needsMigration: 0,
          disputeWindow: "0x1000000000000000000000000000000000000000",
          endTime: 1506573470,
          finalizationBlockNumber: null,
          finalizationTime: null,
          lastTradeBlockNumber: null,
          lastTradeTime: null,
          description: "This is a categorical test market created by b0b.",
          scalarDenomination: null,
          details: null,
          designatedReporter: "0x0000000000000000000000000000000000000b0b",
          designatedReportStake: "10",
          resolutionSource: "http://www.trusted-third-party.com",
          numTicks: "10000",
          tickSize: "0.0001",
          consensus: null,
          outcomes: [{
            id: 0,
            volume: "100",
            price: "0.125",
            description: "outcome 0",
          }, {
            id: 1,
            volume: "100",
            price: "0.125",
            description: "outcome 1",
          }, {
            id: 2,
            volume: "100",
            price: "0.125",
            description: "outcome 2",
          }, {
            id: 3,
            volume: "100",
            price: "0.125",
            description: "outcome 3",
          }, {
            id: 4,
            volume: "100",
            price: "0.125",
            description: "outcome 4",
          }, {
            id: 5,
            volume: "100",
            price: "0.125",
            description: "outcome 5",
          }, {
            id: 6,
            volume: "100",
            price: "0.125",
            description: "outcome 6",
          }, {
            id: 7,
            volume: "100",
            price: "0.125",
            description: "outcome 7",
          }],
        }]);
    },
  });
  runTest({
    description: "get markets by specifying market IDs with payout",
    params: {
      marketIds: [
        "0x0000000000000000000000000000000000000019",
      ],
    },
    assertions: (marketsInfo) => {
      expect(marketsInfo).toEqual([
        {
          id: "0x0000000000000000000000000000000000000019",
          universe: "0x000000000000000000000000000000000000000b",
          marketType: "categorical",
          numOutcomes: 5,
          minPrice: "0",
          maxPrice: "1",
          cumulativeScale: "1",
          author: "0x0000000000000000000000000000000000000b0b",
          creationTime: 1506473500,
          creationBlock: 1400001,
          settlementFee: "0.03",
          reportingFeeRate: "0.02",
          initialReportSize: null,
          category: "TEST CATEGORY",
          tags: [
            "tagging it",
            "tagged it",
          ],
          volume: "10",
          openInterest: "0",
          outstandingShares: "10",
          disputeWindow: "0x1000000000000000000000000000000000000000",
          endTime: 1507573470,
          finalizationBlockNumber: 1400002,
          finalizationTime: 1506473515,
          lastTradeBlockNumber: null,
          lastTradeTime: null,
          reportingState: "FINALIZED",
          forking: 0,
          needsMigration: 0,
          description: "creator b0b 5 outcomes, market finalized.",
          scalarDenomination: null,
          details: null,
          designatedReporter: "0x0000000000000000000000000000000000000b0b",
          designatedReportStake: "10",
          resolutionSource: "http://www.trusted-third-party.com",
          numTicks: "10000",
          tickSize: "0.0001",
          consensus: {
            isInvalid: false,
            payout: [
              "10000",
              "0",
              "0",
              "0",
              "0",
            ],
          },
          outcomes: [
            {
              id: 0,
              volume: "100",
              price: "0.125",
              description: "outcome 0",
            },
            {
              id: 1,
              volume: "100",
              price: "0.125",
              description: "outcome 1",
            },
            {
              id: 2,
              volume: "100",
              price: "0.125",
              description: "outcome 2",
            },
            {
              id: 3,
              volume: "100",
              price: "0.125",
              description: "outcome 3",
            },
            {
              id: 4,
              volume: "100",
              price: "0.125",
              description: "outcome 4",
            }],
        }]);
    },
  });
  runTest({
    description: "An array with a null value",
    params: {
      marketIds: [undefined],
    },
    assertions: (marketInfo) => {
      expect(marketInfo).toEqual([null]);
    },
  });
  runTest({
    description: "market does not exist",
    params: {
      marketIds: ["0x1010101010101010101010101010101010101010"],
    },
    assertions: (marketInfo) => {
      expect(marketInfo).toEqual([null]);
    },
  });
  runTest({
    description: "Too many marketIds",
    params: {
      marketIds: Array.from({ length: 1000 }, () => "0x0000000000000000000000000000000000000001"),
    },
    assertions: (marketInfo) => {
      expect(marketInfo).toEqual(Array.from({ length: 1000 }, () => {
        return {
          id: "0x0000000000000000000000000000000000000001",
          universe: "0x000000000000000000000000000000000000000b",
          marketType: "categorical",
          numOutcomes: 8,
          minPrice: "0",
          maxPrice: "1",
          cumulativeScale: "1",
          author: "0x0000000000000000000000000000000000000b0b",
          creationTime: 1506473474,
          creationBlock: 1400000,
          settlementFee: "0.04",
          reportingFeeRate: "0.02",
          initialReportSize: null,
          category: "TEST CATEGORY",
          tags: ["test tag 1", "test tag 2"],
          volume: "0",
          openInterest: "0",
          outstandingShares: "0",
          reportingState: "DESIGNATED_REPORTING",
          forking: 0,
          needsMigration: 0,
          disputeWindow: "0x1000000000000000000000000000000000000000",
          endTime: 1506573470,
          finalizationBlockNumber: null,
          finalizationTime: null,
          lastTradeBlockNumber: null,
          lastTradeTime: null,
          description: "This is a categorical test market created by b0b.",
          scalarDenomination: null,
          details: null,
          designatedReporter: "0x0000000000000000000000000000000000000b0b",
          designatedReportStake: "10",
          resolutionSource: "http://www.trusted-third-party.com",
          numTicks: "10000",
          tickSize: "0.0001",
          consensus: null,
          outcomes: [{
            id: 0,
            volume: "100",
            price: "0.125",
            description: "outcome 0",
          }, {
            id: 1,
            volume: "100",
            price: "0.125",
            description: "outcome 1",
          }, {
            id: 2,
            volume: "100",
            price: "0.125",
            description: "outcome 2",
          }, {
            id: 3,
            volume: "100",
            price: "0.125",
            description: "outcome 3",
          }, {
            id: 4,
            volume: "100",
            price: "0.125",
            description: "outcome 4",
          }, {
            id: 5,
            volume: "100",
            price: "0.125",
            description: "outcome 5",
          }, {
            id: 6,
            volume: "100",
            price: "0.125",
            description: "outcome 6",
          }, {
            id: 7,
            volume: "100",
            price: "0.125",
            description: "outcome 7",
          }],
        };
      }));
    },
  });
  runTest({
    description: "Empty marketIds array",
    params: {
      marketIds: [],
    },
    assertions: (marketInfo) => {
      expect(marketInfo).toEqual([]);
    },
  });
});
