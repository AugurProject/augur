"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const {getMarketsInfo} = require("../../../build/server/getters/get-markets-info");


describe("server/getters/get-markets-info", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        getMarketsInfo(db, t.params.marketIds, (err, marketsInfo) => {
          t.assertions(err, marketsInfo);
          db.destroy();
          done();
        });
      });
    });
  };
  test({
    description: "get markets by specifying market IDs",
    params: {
      marketIds: [
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000002",
      ],
    },
    assertions: (err, marketsInfo) => {
      assert.ifError(err);
      assert.deepEqual(marketsInfo, [
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
          creationFee: "10",
          settlementFee: "0.03",
          reportingFeeRate: "0.02",
          marketCreatorFeeRate: "0.01",
          marketCreatorFeesBalance: "0",
          marketCreatorMailbox: "0xbbb0000000000000000000000000000000000001",
          marketCreatorMailboxOwner: "0x0000000000000000000000000000000000000b0b",
          initialReportSize: null,
          category: "test category",
          tags: ["test tag 1", "test tag 2"],
          volume: "0",
          outstandingShares: "0",
          reportingState: "DESIGNATED_REPORTING",
          forking: 0,
          needsMigration: 0,
          feeWindow: "0x1000000000000000000000000000000000000000",
          endTime: 1506573470,
          finalizationBlockNumber: null,
          finalizationTime: null,
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
          creationFee: "10",
          settlementFee: "0.03",
          reportingFeeRate: "0.02",
          marketCreatorFeeRate: "0.01",
          marketCreatorFeesBalance: "0",
          marketCreatorMailbox: "0xbbb0000000000000000000000000000000000002",
          marketCreatorMailboxOwner: "0x0000000000000000000000000000000000000b0b",
          initialReportSize: null,
          category: "test category",
          tags: ["test tag 1", "test tag 2"],
          volume: "0",
          outstandingShares: "0",
          reportingState: "DESIGNATED_REPORTING",
          forking: 0,
          needsMigration: 0,
          feeWindow: "0x1000000000000000000000000000000000000000",
          endTime: 1506573480,
          finalizationBlockNumber: null,
          finalizationTime: null,
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
        }]
      );
    },
  });
  test({
    description: "get markets by specifying market IDs, with missing market",
    params: {
      marketIds: [
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000077777777777777777",
        "0x0000000000000000000000000000000000000002",
      ],
    },
    assertions: (err, marketsInfo) => {
      assert.ifError(err);
      assert.deepEqual(marketsInfo, [
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
          creationFee: "10",
          settlementFee: "0.03",
          reportingFeeRate: "0.02",
          marketCreatorFeeRate: "0.01",
          marketCreatorFeesBalance: "0",
          marketCreatorMailbox: "0xbbb0000000000000000000000000000000000001",
          marketCreatorMailboxOwner: "0x0000000000000000000000000000000000000b0b",
          initialReportSize: null,
          category: "test category",
          tags: ["test tag 1", "test tag 2"],
          volume: "0",
          outstandingShares: "0",
          reportingState: "DESIGNATED_REPORTING",
          forking: 0,
          needsMigration: 0,
          feeWindow: "0x1000000000000000000000000000000000000000",
          endTime: 1506573470,
          finalizationBlockNumber: null,
          finalizationTime: null,
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
          creationFee: "10",
          settlementFee: "0.03",
          reportingFeeRate: "0.02",
          marketCreatorFeeRate: "0.01",
          marketCreatorFeesBalance: "0",
          marketCreatorMailbox: "0xbbb0000000000000000000000000000000000002",
          marketCreatorMailboxOwner: "0x0000000000000000000000000000000000000b0b",
          initialReportSize: null,
          category: "test category",
          tags: ["test tag 1", "test tag 2"],
          volume: "0",
          outstandingShares: "0",
          reportingState: "DESIGNATED_REPORTING",
          forking: 0,
          needsMigration: 0,
          feeWindow: "0x1000000000000000000000000000000000000000",
          endTime: 1506573480,
          finalizationBlockNumber: null,
          finalizationTime: null,
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
        }]
      );
    },
  });
  test({
    description: "get markets by specifying market IDs, reversed",
    params: {
      marketIds: [
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000001",
      ],
    },
    assertions: (err, marketsInfo) => {
      assert.ifError(err);
      assert.deepEqual(marketsInfo, [
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
          creationFee: "10",
          settlementFee: "0.03",
          reportingFeeRate: "0.02",
          marketCreatorFeeRate: "0.01",
          marketCreatorFeesBalance: "0",
          marketCreatorMailbox: "0xbbb0000000000000000000000000000000000002",
          marketCreatorMailboxOwner: "0x0000000000000000000000000000000000000b0b",
          initialReportSize: null,
          category: "test category",
          tags: ["test tag 1", "test tag 2"],
          volume: "0",
          outstandingShares: "0",
          reportingState: "DESIGNATED_REPORTING",
          forking: 0,
          needsMigration: 0,
          feeWindow: "0x1000000000000000000000000000000000000000",
          endTime: 1506573480,
          finalizationBlockNumber: null,
          finalizationTime: null,
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
          creationFee: "10",
          settlementFee: "0.03",
          reportingFeeRate: "0.02",
          marketCreatorFeeRate: "0.01",
          marketCreatorFeesBalance: "0",
          marketCreatorMailbox: "0xbbb0000000000000000000000000000000000001",
          marketCreatorMailboxOwner: "0x0000000000000000000000000000000000000b0b",
          initialReportSize: null,
          category: "test category",
          tags: ["test tag 1", "test tag 2"],
          volume: "0",
          outstandingShares: "0",
          reportingState: "DESIGNATED_REPORTING",
          forking: 0,
          needsMigration: 0,
          feeWindow: "0x1000000000000000000000000000000000000000",
          endTime: 1506573470,
          finalizationBlockNumber: null,
          finalizationTime: null,
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
        }]
      );
    },
  });
  test({
    description: "get markets by specifying market IDs with payout",
    params: {
      marketIds: [
        "0x0000000000000000000000000000000000000019",
      ],
    },
    assertions: (err, marketsInfo) => {
      assert.ifError(err);
      assert.deepEqual(marketsInfo, [
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
          creationFee: "10",
          settlementFee: "0.03",
          reportingFeeRate: "0.02",
          marketCreatorFeeRate: "0.01",
          marketCreatorFeesBalance: "0",
          marketCreatorMailbox: "0xbbb0000000000000000000000000000000000019",
          marketCreatorMailboxOwner: "0x0000000000000000000000000000000000000b0b",
          initialReportSize: null,
          category: "test category",
          tags: [
            "tagging it",
            "tagged it",
          ],
          volume: "10",
          outstandingShares: "10",
          feeWindow: "0x1000000000000000000000000000000000000000",
          endTime: 1507573470,
          finalizationBlockNumber: 1400002,
          finalizationTime: 1506473515,
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
        }]
      );
    },
  });
  test({
    description: "An array with a null value",
    params: {
      marketIds: [undefined],
    },
    assertions: (err, marketInfo) => {
      assert.ifError(err);
      assert.deepEqual(marketInfo, [null]);
    },
  });
  test({
    description: "market does not exist",
    params: {
      marketIds: ["0x1010101010101010101010101010101010101010"],
    },
    assertions: (err, marketInfo) => {
      assert.ifError(err);
      assert.deepEqual(marketInfo, [null]);
    },
  });
  test({
    description: "Empty marketIds array",
    params: {
      marketIds: [],
    },
    assertions: (err, marketInfo) => {
      assert.ifError(err);
      assert.deepEqual(marketInfo, []);
    },
  });
});
