import { setupTestDb } from 'test/unit/test.database';

import {
  processReportingParticipantDisavowedLog,
  processReportingParticipantDisavowedLogRemoval,
} from './reporting-participant-disavowed';

async function getParticipantState(db, log) {
  return {
    initialReporter: await db("initial_reports").first(["initialReporter", "disavowed"]).where("initialReporter", log.reportingParticipant),
    crowdsourcer: await db("crowdsourcers").first(["crowdsourcerId", "disavowed"]).where("crowdsourcerId", log.reportingParticipant),
  };
}
describe("blockchain/log-processors/reporting-participant-disavowed", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  test("initialReporter", async () => {
    const log = {
      universe: "0x000000000000000000000000000000000000000b",
      market: "0x0000000000000000000000000000000000000211",
      reportingParticipant: "0x0000000000000000000000000000000000abe123",
      blockNumber: 1400001,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
      logIndex: 0,
    };
    return db.transaction(async (trx) => {
      await(await processReportingParticipantDisavowedLog({}, log))(trx);
      await expect(getParticipantState(trx, log)).resolves.toEqual({
        crowdsourcer: undefined,
        initialReporter: {
          disavowed: 1,
          initialReporter: "0x0000000000000000000000000000000000abe123",
        },
      });

      await(await processReportingParticipantDisavowedLogRemoval({}, log))(trx);
      await expect(getParticipantState(trx, log)).resolves.toEqual({
        crowdsourcer: undefined,
        initialReporter: {
          disavowed: 0,
          initialReporter: "0x0000000000000000000000000000000000abe123",
        },
      });
    });
  });

  test("crowdsourcer", async () => {
    const log = {
      universe: "0x000000000000000000000000000000000000000b",
      market: "0x0000000000000000000000000000000000000011",
      reportingParticipant: "0x0000000000000000001000000000000000000005",
      blockNumber: 1400001,
      transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
      logIndex: 0,
    };
    return db.transaction(async (trx) => {
      await(await processReportingParticipantDisavowedLog({}, log))(trx);
      await expect(getParticipantState(trx, log)).resolves.toEqual({
        crowdsourcer: {
          disavowed: 1,
          crowdsourcerId: "0x0000000000000000001000000000000000000005",
        },
        initialReporter: undefined,
      });
      await(await processReportingParticipantDisavowedLogRemoval({}, log))(trx);
      await expect(getParticipantState(trx, log)).resolves.toEqual({
        crowdsourcer: {
          disavowed: 0,
          crowdsourcerId: "0x0000000000000000001000000000000000000005",
        },
        initialReporter: undefined,
      });
    });
  });

  afterEach(async () => {
    await db.destroy();
  });
});
