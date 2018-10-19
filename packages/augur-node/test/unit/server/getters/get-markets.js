"use strict";

const ReportingState = require("src/types").ReportingState;
const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");


describe("server/getters/get-markets", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
      const db = await setupTestDb();
      t.method = "getMarkets";
      dispatchJsonRpcRequest(db, t, {}, (err, marketsMatched) => {
        t.assertions(err, marketsMatched);
        db.destroy();
        done();
      });
    })
  };
  runTest({
    description: "get markets in universe b",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
    },
    assertions: (err, marketsMatched) => {
      expect(err).toBeFalsy();
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
    assertions: (err, marketsMatched) => {
      expect(err).toBeFalsy();
      expect(marketsMatched).toEqual([]);
    },
  });
  runTest({
    description: "user has created 3 markets",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      creator: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (err, marketsCreatedByUser) => {
      expect(err).toBeFalsy();
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
    assertions: (err, marketsCreatedByUser) => {
      expect(err).toBeFalsy();
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
    assertions: (err, marketsCreatedByUser) => {
      expect(err).toBeFalsy();
      expect(marketsCreatedByUser).toEqual([]);
    },
  });
  runTest({
    description: "category with markets in it",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      category: "TEST CATEGORY",
    },
    assertions: (err, marketsInCategory) => {
      expect(err).toBeFalsy();
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
    assertions: (err, marketsInCategory) => {
      expect(err).toBeFalsy();
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
    assertions: (err, marketsInCategory) => {
      expect(err).toBeFalsy();
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
    assertions: (err, marketsUpcomingDesignatedReporting) => {
      expect(err).toBeFalsy();
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
    assertions: (err, marketsUpcomingDesignatedReporting) => {
      expect(err).toBeFalsy();
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
    assertions: (err, marketsInfo) => {
      expect(err).toBeFalsy();
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
    assertions: (err, marketsAwaitingDesignatedReporting) => {
      expect(err).toBeFalsy();
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
    assertions: (err, marketsInfo) => {
      expect(err).toBeFalsy();
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
    assertions: (err, marketsInfo) => {
      expect(err).toBeFalsy();
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
    assertions: (err, marketsInfo) => {
      expect(err).toBeFalsy();
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
    assertions: (err, marketsAwaitingDesignatedReporting) => {
      expect(err).toBeFalsy();
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
    assertions: (err, marketsInfo) => {
      expect(err).toBeFalsy();
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
    assertions: (err, marketsInfo) => {
      expect(err).toBeFalsy();
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
    assertions: (err, marketsUpcomingDesignatedReporting) => {
      expect(err).toBeFalsy();
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
    assertions: (err, marketsUpcomingDesignatedReporting) => {
      expect(err).toBeFalsy();
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
    assertions: (err, marketsInfo) => {
      expect(err).toBeFalsy();
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
    assertions: (err, marketsMatched) => {
      expect(err).toBeFalsy();
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
    assertions: (err, marketsMatched) => {
      expect(err).toBeFalsy();
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
    assertions: (err, marketsCreatedByUser) => {
      expect(err).toBeFalsy();
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
});
