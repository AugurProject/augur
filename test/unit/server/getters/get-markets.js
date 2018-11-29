const ReportingState = require("src/types").ReportingState;
const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-markets", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  afterEach(async () => {
    await db.destroy();
  });

  const runTest = (t) => {
    test(t.description, async () => {
      t.method = "getMarkets";
      const marketsMatched = await dispatchJsonRpcRequest(db, t, {});
      t.assertions(marketsMatched);
    });
  };
  runTest({
    description: "get markets in universe b",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
    },
    assertions: (marketsMatched) => {
      expect(marketsMatched).toEqual([
        "0x0000000000000000000000000000000000000015",
        "0x0000000000000000000000000000000000000012",
        "0x0000000000000000000000000000000000000013",
        "0x0000000000000000000000000000000000000014",
        "0x0000000000000000000000000000000000000016",
        "0x0000000000000000000000000000000000000017",
        "0x0000000000000000000000000000000000000018",
        "0x0000000000000000000000000000000000000019",
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000003",
        "0x0000000000000000000000000000000000000011",
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000211",
        "0x0000000000000000000000000000000000000222",
        "0x00000000000000000000000000000000000000f1",
      ]);
    },
  });
  runTest({
    description: "nonexistent universe",
    params: {
      universe: "0x1010101010101010101010101010101010101010",
    },
    assertions: (marketsMatched) => {
      expect(marketsMatched).toEqual([]);
    },
  });
  runTest({
    description: "user has created 3 markets",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      creator: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (marketsCreatedByUser) => {
      expect(marketsCreatedByUser).toEqual([
        "0x0000000000000000000000000000000000000016",
        "0x0000000000000000000000000000000000000012",
        "0x0000000000000000000000000000000000000013",
        "0x0000000000000000000000000000000000000014",
        "0x0000000000000000000000000000000000000015",
        "0x0000000000000000000000000000000000000017",
        "0x0000000000000000000000000000000000000018",
        "0x0000000000000000000000000000000000000019",
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000011",
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000211",
        "0x0000000000000000000000000000000000000222",
        "0x00000000000000000000000000000000000000f1",
      ]);
    },
  });
  runTest({
    description: "user has created 1 market",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      creator: "0x000000000000000000000000000000000000d00d",
    },
    assertions: (marketsCreatedByUser) => {
      expect(marketsCreatedByUser).toEqual([
        "0x0000000000000000000000000000000000000003",
      ]);
    },
  });
  runTest({
    description: "user has not created any markets",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      creator: "0x0000000000000000000000000000000000000bbb",
    },
    assertions: (marketsCreatedByUser) => {
      expect(marketsCreatedByUser).toEqual([]);
    },
  });
  runTest({
    description: "category with markets in it",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      category: "TEST CATEGORY",
    },
    assertions: (marketsInCategory) => {
      expect(marketsInCategory).toEqual([
        "0x0000000000000000000000000000000000000015",
        "0x0000000000000000000000000000000000000012",
        "0x0000000000000000000000000000000000000013",
        "0x0000000000000000000000000000000000000014",
        "0x0000000000000000000000000000000000000016",
        "0x0000000000000000000000000000000000000017",
        "0x0000000000000000000000000000000000000018",
        "0x0000000000000000000000000000000000000019",
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000003",
        "0x0000000000000000000000000000000000000011",
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000211",
        "0x0000000000000000000000000000000000000222",
        "0x00000000000000000000000000000000000000f1",
      ]);
    },
  });
  runTest({
    description: "category with markets in it, limit 2",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      category: "TEST CATEGORY",
      limit: 2,
    },
    assertions: (marketsInCategory) => {
      expect(marketsInCategory).toEqual([
        "0x0000000000000000000000000000000000000015",
        "0x0000000000000000000000000000000000000012",
      ]);
    },
  });
  runTest({
    description: "empty category",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      category: "empty category",
    },
    assertions: (marketsInCategory) => {
      expect(marketsInCategory).toEqual([]);
    },
  });
  runTest({
    description: "get markets upcoming, unknown designated reporter",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reportingState: ReportingState.PRE_REPORTING,
      designatedReporter: "0xf0f0f0f0f0f0f0f0b0b0b0b0b0b0b0f0f0f0f0b0",
    },
    assertions: (marketsUpcomingDesignatedReporting) => {
      expect(marketsUpcomingDesignatedReporting).toEqual([]);
    },
  });
  runTest({
    description: "get all markets upcoming designated reporting, sorted ascending by volume",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reportingState: ReportingState.PRE_REPORTING,
      sortBy: "volume",
      isSortDescending: false,
    },
    assertions: (marketsUpcomingDesignatedReporting) => {
      expect(marketsUpcomingDesignatedReporting).toEqual([
        "0x0000000000000000000000000000000000000222",
      ]);
    },
  });
  runTest({
    description: "get all markets upcoming designated reporting by b0b",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reportingState: ReportingState.PRE_REPORTING,
      designatedReporter: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (marketsInfo) => {
      expect(marketsInfo).toEqual([
        "0x0000000000000000000000000000000000000222",
      ]);
    },
  });
  runTest({
    description: "get markets awaiting unknown designated reporter",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reportingState: ReportingState.DESIGNATED_REPORTING,
      designatedReporter: "0xf0f0f0f0f0f0f0f0b0b0b0b0b0b0b0f0f0f0f0b0",
    },
    assertions: (marketsAwaitingDesignatedReporting) => {
      expect(marketsAwaitingDesignatedReporting).toEqual([]);
    },
  });
  runTest({
    description: "get all markets awaiting designated reporting, sorted ascending by volume",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reportingState: ReportingState.DESIGNATED_REPORTING,
      sortBy: "volume",
      isSortDescending: false,
    },
    assertions: (marketsInfo) => {
      expect(marketsInfo).toEqual([
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000003",
        "0x0000000000000000000000000000000000000012",
        "0x0000000000000000000000000000000000000014",
        "0x0000000000000000000000000000000000000015",
        "0x0000000000000000000000000000000000000016",
        "0x0000000000000000000000000000000000000017",
      ]);
    },
  });
  runTest({
    description: "get all markets awaiting designated reporting, sorted ascending by reportingStateUpdatedOn",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reportingState: ReportingState.DESIGNATED_REPORTING,
      sortBy: "reportingStateUpdatedOn",
      isSortDescending: true,
    },
    assertions: (marketsInfo) => {
      expect(marketsInfo).toEqual([
        "0x0000000000000000000000000000000000000003",
        "0x0000000000000000000000000000000000000012",
        "0x0000000000000000000000000000000000000014",
        "0x0000000000000000000000000000000000000015",
        "0x0000000000000000000000000000000000000016",
        "0x0000000000000000000000000000000000000017",
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000001",
      ]);
    },
  });
  runTest({
    description: "get all markets awaiting designated reporting by d00d",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reportingState: ReportingState.DESIGNATED_REPORTING,
      designatedReporter: "0x000000000000000000000000000000000000d00d",
    },
    assertions: (marketsInfo) => {
      expect(marketsInfo).toEqual([
        "0x0000000000000000000000000000000000000003",
      ]);
    },
  });
  runTest({
    description: "get markets awaiting unknown designated reporter",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      designatedReporter: "0xf0f0f0f0f0f0f0f0b0b0b0b0b0b0b0f0f0f0f0b0",
    },
    assertions: (marketsAwaitingDesignatedReporting) => {
      expect(marketsAwaitingDesignatedReporting).toEqual([]);
    },
  });
  runTest({
    description: "get all markets awaiting designated reporting, sorted ascending by volume",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reportingState: ReportingState.DESIGNATED_REPORTING,
      sortBy: "volume",
      isSortDescending: false,
    },
    assertions: (marketsInfo) => {
      expect(marketsInfo).toEqual([
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000003",
        "0x0000000000000000000000000000000000000012",
        "0x0000000000000000000000000000000000000014",
        "0x0000000000000000000000000000000000000015",
        "0x0000000000000000000000000000000000000016",
        "0x0000000000000000000000000000000000000017",
      ]);
    },
  });
  runTest({
    description: "get all markets awaiting designated reporting by d00d",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      designatedReporter: "0x000000000000000000000000000000000000d00d",
    },
    assertions: (marketsInfo) => {
      expect(marketsInfo).toEqual([
        "0x0000000000000000000000000000000000000003",
      ]);
    },
  });
  runTest({
    description: "get markets upcoming, unknown designated reporter",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      designatedReporter: "0xf0f0f0f0f0f0f0f0b0b0b0b0b0b0b0f0f0f0f0b0",
    },
    assertions: (marketsUpcomingDesignatedReporting) => {
      expect(marketsUpcomingDesignatedReporting).toEqual([]);
    },
  });
  runTest({
    description: "get all markets upcoming designated reporting, sorted ascending by volume",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reportingState: ReportingState.PRE_REPORTING,
      sortBy: "volume",
      isSortDescending: false,
    },
    assertions: (marketsUpcomingDesignatedReporting) => {
      expect(marketsUpcomingDesignatedReporting).toEqual([
        "0x0000000000000000000000000000000000000222",
      ]);
    },
  });
  runTest({
    description: "get all markets upcoming designated reporting by b0b",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reportingState: ReportingState.PRE_REPORTING,
      designatedReporter: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (marketsInfo) => {
      expect(marketsInfo).toEqual([
        "0x0000000000000000000000000000000000000222",
      ]);
    },
  });
  runTest({
    description: "fts search for bob",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      search: "bob",
    },
    assertions: (marketsMatched) => {
      expect(marketsMatched).toEqual([
        "0x0000000000000000000000000000000000000012",
        "0x0000000000000000000000000000000000000015",
      ]);
    },
  });
  runTest({
    description: "fts search for bob with category",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      search: "bob",
      category: "TEST CATEGORY",
    },
    assertions: (marketsMatched) => {
      expect(marketsMatched).toEqual([
        "0x0000000000000000000000000000000000000012",
        "0x0000000000000000000000000000000000000015",
      ]);
    },
  });
  runTest({
    description: "search for sue",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      search: "sue",
    },
    assertions: (marketsCreatedByUser) => {
      expect(marketsCreatedByUser).toEqual([
        "0x0000000000000000000000000000000000000014",
        "0x0000000000000000000000000000000000000015",
        "0x0000000000000000000000000000000000000016",
        "0x0000000000000000000000000000000000000017",
        "0x0000000000000000000000000000000000000018",
        "0x0000000000000000000000000000000000000019",
      ]);
    },
  });
  runTest({
    description: "set a maximum fee",
    params: {
      universe: "0x100000000000000000000000000000000000000b",
      maxFee: .11,
    },
    assertions: (marketsWithMaxFee) => {
      expect(marketsWithMaxFee).not.toContain("0x1000000000000000000000000000000000000001"); // .12 combined fee
    },
  });
  runTest({
    description: "set a maximum fee 2",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      maxFee: .03,
    },
    assertions: (marketsWithMaxFee) => {
      expect(marketsWithMaxFee).not.toContain("0x0000000000000000000000000000000000000001"); // .04 combined fee
    },
  });
});
