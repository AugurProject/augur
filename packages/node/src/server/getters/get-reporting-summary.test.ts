import { setupTestDb } from 'test/unit/test.database';
import { dispatchJsonRpcRequest } from '../dispatch-json-rpc-request';

describe("server/getters/get-reporting-summary", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  afterEach(async () => {
    await db.destroy();
  });

  const runTest = (t) => {
    test(t.description, async () => {
      t.method = "getReportingSummary";
      const reportingSummary = await dispatchJsonRpcRequest(db, t, null);
      t.assertions(reportingSummary);
    });
  };
  runTest({
    description: "get valid reporting window",
    params: {
      disputeWindow: "0x1000000000000000000000000000000000000000",
    },
    assertions: (reportingSummary) => {
      expect(reportingSummary).toEqual({
        "AWAITING_FINALIZATION": 1,
        "DESIGNATED_REPORTING": 9,
        "CROWDSOURCING_DISPUTE": 2,
        "FINALIZED": 1,
        "PRE_REPORTING": 1,
      });
    },
  });
  runTest({
    description: "non-existent reporting window",
    params: {
      disputeWindow: "0xfffffffffffff000000000000000000000000000",
    },
    assertions: (reportingSummary) => {
      expect(reportingSummary).toEqual({});
    },
  });
});
