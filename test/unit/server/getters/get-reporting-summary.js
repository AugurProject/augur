const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-reporting-summary", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
      const db = await setupTestDb();
      t.method = "getReportingSummary";
      dispatchJsonRpcRequest(db, t, null, (err, reportingSummary) => {
        expect(err).toBeFalsy();
        t.assertions(reportingSummary);
        done();
        db.destroy();
      });
    });
  };
  runTest({
    description: "get valid reporting window",
    params: {
      feeWindow: "0x1000000000000000000000000000000000000000",
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
      feeWindow: "0xfffffffffffff000000000000000000000000000",
    },
    assertions: (reportingSummary) => {
      expect(reportingSummary).toEqual({});
    },
  });
});
