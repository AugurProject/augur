import { setupTestDb } from 'test/unit/test.database';
import { dispatchJsonRpcRequest } from '../dispatch-json-rpc-request';

describe("server/getters/get-reporting-history", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  afterEach(async () => {
    await db.destroy();
  });

  const runTest = (t) => {
    test(t.description, async () => {
      t.method = "getReportingHistory";
      const reportingHistory = await dispatchJsonRpcRequest(db, t, null);
      t.assertions(reportingHistory);
    });
  };
  runTest({
    description: "get reporter history that actually exists",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reporter: "0x0000000000000000000000000000000000000021",
    },
    assertions: (reportingHistory) => {
      expect(reportingHistory).toEqual({
        "0x000000000000000000000000000000000000000b": {
          "0x0000000000000000000000000000000000000011": {
            initialReporter: null,
            crowdsourcers: [
              {
                transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000D00",
                logIndex: 0,
                creationBlockNumber: 1400051,
                blockHash: "0x1400051",
                creationTime: 1506474500,
                marketId: "0x0000000000000000000000000000000000000011",
                disputeWindow: "0x1000000000000000000000000000000000000000",
                payoutNumerators: ["0", "2"],
                amountStaked: "17",
                crowdsourcerId: "0x0000000000000000001000000000000000000001",
                isCategorical: false,
                isScalar: false,
                isInvalid: false,
                isSubmitted: true,
              },
            ],
          },
          "0x0000000000000000000000000000000000000019": {
            initialReporter: null,
            crowdsourcers: [
              {
                transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000D03",
                logIndex: 0,
                creationBlockNumber: 1400052,
                blockHash: "0x1400052",
                creationTime: 1506474515,
                marketId: "0x0000000000000000000000000000000000000019",
                disputeWindow: "0x1000000000000000000000000000000000000000",
                payoutNumerators: ["10000", "0", "0", "0", "0"],
                amountStaked: "229",
                crowdsourcerId: "0x0000000000000000001000000000000000000003",
                isCategorical: false,
                isScalar: false,
                isInvalid: false,
                isSubmitted: true,
              },
            ],
          },
        },
      });
    },
  });
  runTest({
    description: "get reporter history of initial reports that actually exists",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reporter: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (reportingHistory) => {
      expect(reportingHistory).toEqual({
        "0x000000000000000000000000000000000000000b": {
          "0x0000000000000000000000000000000000000011": {
            initialReporter: {
              initialReporter: "0x0000000000000000000000000000000000abe123",
              transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000E00",
              logIndex: 0,
              creationBlockNumber: 1400100,
              creationTime: 1506480000,
              blockHash: "0x1400100",
              marketId: "0x0000000000000000000000000000000000000011",
              disputeWindow: "0x1000000000000000000000000000000000000000",
              amountStaked: "102",
              isCategorical: false,
              isScalar: false,
              isInvalid: false,
              isSubmitted: true,
              payoutNumerators: [
                "0",
                "2",
              ],
            },
            crowdsourcers: [],
          },
          "0x0000000000000000000000000000000000000019": {
            initialReporter: {
              initialReporter: "0x0000000000000000000000000000000000abe111",
              transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000E00",
              logIndex: 0,
              creationBlockNumber: 1400100,
              creationTime: 1506480000,
              blockHash: "0x1400100",
              marketId: "0x0000000000000000000000000000000000000019",
              disputeWindow: "0x1000000000000000000000000000000000000000",
              amountStaked: "102",
              isCategorical: false,
              isScalar: false,
              isInvalid: false,
              isSubmitted: true,
              payoutNumerators: [
                "0",
                "10000",
              ],
            },
            crowdsourcers: [],
          },
          "0x0000000000000000000000000000000000000211": {
            initialReporter: {
              initialReporter: "0x0000000000000000000000000000000000abe321",
              transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000E00",
              logIndex: 0,
              creationBlockNumber: 1400100,
              creationTime: 1506480000,
              blockHash: "0x1400100",
              marketId: "0x0000000000000000000000000000000000000211",
              disputeWindow: "0x2000000000000000000000000000000000000000",
              amountStaked: "102",
              isCategorical: false,
              isScalar: false,
              isInvalid: false,
              isSubmitted: true,
              payoutNumerators: [
                "0",
                "10000",
              ],
            },
            crowdsourcers: [],
          },
          "0x00000000000000000000000000000000000000f1": {
            initialReporter: {
              initialReporter: "0x0000000000000000000000000000000000abe222",
              transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000E00",
              logIndex: 0,
              creationBlockNumber: 1400100,
              creationTime: 1506480000,
              blockHash: "0x1400100",
              marketId: "0x00000000000000000000000000000000000000f1",
              disputeWindow: "0x4000000000000000000000000000000000000000",
              amountStaked: "102",
              isCategorical: false,
              isScalar: false,
              isInvalid: false,
              isSubmitted: true,
              payoutNumerators: [
                "0",
                "10000",
              ],
            },
            crowdsourcers: [],
          },
        },
      });
    },
  });
  runTest({
    description: "get reporter history that actually exists, filtered by date",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reporter: "0x0000000000000000000000000000000000000021",
      earliestCreationTime: 1506474501,
      latestCreationTime: 1506474515,
    },
    assertions: (reportingHistory) => {
      expect(reportingHistory).toEqual({
        "0x000000000000000000000000000000000000000b": {
          "0x0000000000000000000000000000000000000019": {
            initialReporter: null,
            crowdsourcers: [{
              transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000D03",
              logIndex: 0,
              creationBlockNumber: 1400052,
              blockHash: "0x1400052",
              creationTime: 1506474515,
              marketId: "0x0000000000000000000000000000000000000019",
              disputeWindow: "0x1000000000000000000000000000000000000000",
              payoutNumerators: ["10000", "0", "0", "0", "0"],
              amountStaked: "229",
              crowdsourcerId: "0x0000000000000000001000000000000000000003",
              isCategorical: false,
              isScalar: false,
              isInvalid: false,
              isSubmitted: true,
            }],
          },
        },
      });
    },
  });
  runTest({
    description: "reporter has not submitted any reports",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reporter: "0x2100000000000000000000000000000000000021",
    },
    assertions: (reportingHistory) => {
      expect(reportingHistory).toEqual({});
    },
  });
});
