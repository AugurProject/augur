const Augur = require("augur.js");
const setupTestDb = require("../../test.database");
const { BigNumber } = require("bignumber.js");
const {
  processDisputeCrowdsourcerCreatedLog, processDisputeCrowdsourcerCreatedLogRemoval,
  processDisputeCrowdsourcerContributionLog, processDisputeCrowdsourcerContributionLogRemoval,
  processDisputeCrowdsourcerCompletedLog, processDisputeCrowdsourcerCompletedLogRemoval,
}
  = require("src/blockchain/log-processors/crowdsourcer");
const { getMarketsWithReportingState } = require("src/server/getters/database");
const { setOverrideTimestamp, removeOverrideTimestamp } = require("src/blockchain/process-block");

function getCrowdsourcer(db, log) {
  return db("crowdsourcers").first(
    ["crowdSourcerId",
      "crowdsourcers.marketId",
      "completed",
      "feeWindow",
      "payouts.winning",
      "payouts.tentativeWinning"])
    .join("payouts", "payouts.payoutId", "crowdsourcers.payoutId")
    .where({ crowdsourcerId: log.disputeCrowdsourcer });
}

function getDisputesFromCrowdsourcer(db, log) {
  return db("disputes").where({ crowdsourcerId: log.disputeCrowdsourcer });
}

async function getCrowdsourcerAndMarket(db, log) {
  const crowdsourcerRow = await getCrowdsourcer(db, log);
  return {
    crowdsourcer: crowdsourcerRow,
    market: await getMarketsWithReportingState(db).first().where({ "markets.marketId": crowdsourcerRow.marketId }),
  };
}

describe("blockchain/log-processors/crowdsourcers", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  const runTest = (t) => {
    test(t.description, async () => {
      setOverrideTimestamp(db, t.params.overrideTimestamp);

      await db.transaction(async (trx) => {
        async function verify(processor, getter, checker) {
          await(await processor(t.params.augur, t.params.log))(trx);
          checker(await getter(trx, t.params.log));
        }

        await verify(processDisputeCrowdsourcerCreatedLog, getCrowdsourcer, t.assertions.onCreated);
        await verify(processDisputeCrowdsourcerContributionLog, getDisputesFromCrowdsourcer, t.assertions.onContributed);
        await verify(processDisputeCrowdsourcerCompletedLog, getCrowdsourcerAndMarket, t.assertions.onCompleted);
        await verify(processDisputeCrowdsourcerCompletedLogRemoval, getCrowdsourcerAndMarket, t.assertions.onCompletedRemoved);
        await verify(processDisputeCrowdsourcerContributionLogRemoval, getDisputesFromCrowdsourcer, t.assertions.onContributedRemoved);
        await verify(processDisputeCrowdsourcerCreatedLogRemoval, getCrowdsourcer, t.assertions.onCreatedRemoved);
        await expect(removeOverrideTimestamp(db, t.params.overrideTimestamp)).rejects.toEqual(new Error("Timestamp removal failed 1509085473 1509085473"));
      });
      await db.destroy();
    });
  };
  runTest({
    description: "report submitted",
    params: {
      log: {
        universe: "0x000000000000000000000000000000000000000b",
        market: "0x0000000000000000000000000000000000000211",
        disputeCrowdsourcer: "0x0000000000000000002000000000000000000001",
        reporter: "0x0000000000000000000000000000000000000b0b",
        size: 20000,
        amountStaked: new BigNumber("19381", 10),
        payoutNumerators: [0, 1],
        invalid: false,
        blockNumber: 1400100,
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000B00",
        logIndex: 0,
      },
      augur: {
        constants: new Augur().constants,
        api: {
          Universe: {
            getFeeWindowByTimestamp: (p, callback) => {
              expect(p.tx.to).toBe("0x000000000000000000000000000000000000000b");
              const feeWindowByTimestamp = {
                1509085473: "0x2000000000000000000000000000000000000000",
                1509690273: "0x2100000000000000000000000000000000000000",
              };
              const feeWindow = feeWindowByTimestamp[p._timestamp];
              expect(typeof feeWindow).toBe("string");
              callback(null, feeWindow);
            },
          },
        },
      },
      overrideTimestamp: 1509085473,
    },
    assertions: {
      onCreated: (records) => {

        expect(records).toEqual({
          crowdsourcerId: "0x0000000000000000002000000000000000000001",
          marketId: "0x0000000000000000000000000000000000000211",
          feeWindow: "0x2000000000000000000000000000000000000000",
          completed: null,
          tentativeWinning: 0,
          winning: null,
        });
      },
      onCreatedRemoved: (records) => {

        expect(records).not.toBeDefined();
      },
      onContributed: (records) => {

        expect(records).toEqual([{
          blockNumber: 1400100,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000B00",
          logIndex: 0,
          disputeId: 8,
          crowdsourcerId: "0x0000000000000000002000000000000000000001",
          reporter: "0x0000000000000000000000000000000000000b0b",
          amountStaked: new BigNumber("19381", 10),
        }]);
      },
      onContributedRemoved: (records) => {

        expect(records).toEqual([]);
      },
      onCompleted: (records) => {

        expect(records.crowdsourcer).toEqual({
          crowdsourcerId: "0x0000000000000000002000000000000000000001",
          marketId: "0x0000000000000000000000000000000000000211",
          feeWindow: "0x2000000000000000000000000000000000000000",
          completed: 1,
          tentativeWinning: 1,
          winning: null,
        });

        expect(records.market).toEqual({
          category: "TEST CATEGORY",
          consensusPayoutId: null,
          creationBlockNumber: 1500001,
          transactionHash: null,
          logIndex: 0,
          creationFee: new BigNumber("10", 10),
          creationTime: 1509065474,
          designatedReportStake: new BigNumber("10", 10),
          designatedReporter: "0x0000000000000000000000000000000000000b0b",
          endTime: 1507573470,
          feeWindow: "0x2100000000000000000000000000000000000000",
          finalizationBlockNumber: null,
          lastTradeBlockNumber: null,
          forking: 0,
          needsMigration: 0,
          needsDisavowal: 0,
          initialReportSize: new BigNumber("10", 10),
          validityBondSize: new BigNumber("0", 10),
          isInvalid: null,
          longDescription: null,
          marketCreator: "0x0000000000000000000000000000000000000b0b",
          marketCreatorFeeRate: new BigNumber("0.01", 10),
          marketCreatorFeesBalance: new BigNumber("0", 10),
          marketCreatorMailbox: "0xbbb0000000000000000000000000000000000211",
          marketCreatorMailboxOwner: "0x0000000000000000000000000000000000000b0b",
          marketId: "0x0000000000000000000000000000000000000211",
          marketStateId: 18,
          marketType: "yesNo",
          maxPrice: new BigNumber("1", 10),
          minPrice: new BigNumber("0", 10),
          numOutcomes: 2,
          numTicks: new BigNumber("10000", 10),
          openInterest: new BigNumber("0", 10),
          reportingFeeRate: new BigNumber("0.02", 10),
          disputeRounds: 1,
          reportingState: "AWAITING_NEXT_WINDOW",
          resolutionSource: "http://www.trusted-third-party.com",
          scalarDenomination: null,
          sharesOutstanding: new BigNumber("0", 10),
          shortDescription: "This is a yesNo test market created by b0b awaiting round 1 reporting.",
          tag1: "test tag 1",
          tag2: "test tag 2",
          universe: "0x000000000000000000000000000000000000000b",
          volume: new BigNumber("0", 10),
          shareVolume: new BigNumber("0", 10),
        });
      },
      onCompletedRemoved: (records) => {

        expect(records.crowdsourcer).toEqual({
          crowdsourcerId: "0x0000000000000000002000000000000000000001",
          marketId: "0x0000000000000000000000000000000000000211",
          feeWindow: "0x2000000000000000000000000000000000000000",
          completed: null,
          tentativeWinning: 0,
          winning: null,
        });

        expect(records.market).toEqual({
          marketId: "0x0000000000000000000000000000000000000211",
          universe: "0x000000000000000000000000000000000000000b",
          marketType: "yesNo",
          numOutcomes: 2,
          minPrice: new BigNumber("0"),
          maxPrice: new BigNumber("1"),
          marketCreator: "0x0000000000000000000000000000000000000b0b",
          transactionHash: null,
          logIndex: 0,
          creationBlockNumber: 1500001,
          creationFee: new BigNumber("10"),
          reportingFeeRate: new BigNumber("0.02"),
          marketCreatorFeeRate: new BigNumber("0.01"),
          marketCreatorFeesBalance: new BigNumber("0"),
          marketCreatorMailbox: "0xbbb0000000000000000000000000000000000211",
          marketCreatorMailboxOwner: "0x0000000000000000000000000000000000000b0b",
          initialReportSize: new BigNumber("10"),
          validityBondSize: new BigNumber("0", 10),
          category: "TEST CATEGORY",
          tag1: "test tag 1",
          tag2: "test tag 2",
          volume: new BigNumber("0"),
          shareVolume: new BigNumber("0", 10),
          sharesOutstanding: new BigNumber("0"),
          feeWindow: "0x2000000000000000000000000000000000000000",
          endTime: 1507573470,
          finalizationBlockNumber: null,
          lastTradeBlockNumber: null,
          marketStateId: 15,
          shortDescription: "This is a yesNo test market created by b0b awaiting round 1 reporting.",
          longDescription: null,
          scalarDenomination: null,
          openInterest: new BigNumber("0", 10),
          designatedReporter: "0x0000000000000000000000000000000000000b0b",
          designatedReportStake: new BigNumber("10"),
          resolutionSource: "http://www.trusted-third-party.com",
          numTicks: new BigNumber("10000"),
          consensusPayoutId: null,
          disputeRounds: 0,
          isInvalid: null,
          reportingState: "CROWDSOURCING_DISPUTE",
          creationTime: 1509065474,
          forking: 0,
          needsMigration: 0,
          needsDisavowal: 0,
        });
      },
    },
  });

  afterEach(async () => {
    await db.destroy();
  });
});
