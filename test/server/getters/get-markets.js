"use strict";

const ReportingState = require("../../../build/types").ReportingState;
const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getMarkets } = require("../../../build/server/getters/get-markets");


describe("server/getters/get-markets", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        getMarkets(db, t.params.universe, t.params.creator, t.params.category, t.params.reportingState, t.params.feeWindow, t.params.designatedReporter, t.params.sortBy, t.params.isSortDescending, t.params.limit, t.params.offset, (err, marketsMatched) => {
          t.assertions(err, marketsMatched);
          db.destroy();
          done();
        });
      });
    });
  };
  test({
    description: "get markets in universe b",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
    },
    assertions: (err, marketsMatched) => {
      assert.ifError(err);
      assert.deepEqual(marketsMatched, [
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
  test({
    description: "nonexistent universe",
    params: {
      universe: "0x1010101010101010101010101010101010101010",
    },
    assertions: (err, marketsMatched) => {
      assert.ifError(err);
      assert.deepEqual(marketsMatched, []);
    },
  });
  test({
    description: "user has created 3 markets",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      creator: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (err, marketsCreatedByUser) => {
      assert.ifError(err);
      assert.deepEqual(marketsCreatedByUser, [
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
  test({
    description: "user has created 1 market",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      creator: "0x000000000000000000000000000000000000d00d",
    },
    assertions: (err, marketsCreatedByUser) => {
      assert.ifError(err);
      assert.deepEqual(marketsCreatedByUser, [
        "0x0000000000000000000000000000000000000003",
      ]);
    },
  });
  test({
    description: "user has not created any markets",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      creator: "0x0000000000000000000000000000000000000bbb",
    },
    assertions: (err, marketsCreatedByUser) => {
      assert.ifError(err);
      assert.deepEqual(marketsCreatedByUser, []);
    },
  });
  test({
    description: "category with markets in it",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      category: "test category",
    },
    assertions: (err, marketsInCategory) => {
      assert.ifError(err);
      assert.deepEqual(marketsInCategory, [
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
  test({
    description: "category with markets in it, limit 2",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      category: "test category",
      limit: 2,
    },
    assertions: (err, marketsInCategory) => {
      assert.ifError(err);
      assert.deepEqual(marketsInCategory, [
        "0x0000000000000000000000000000000000000015",
        "0x0000000000000000000000000000000000000012",
      ]);
    },
  });
  test({
    description: "empty category",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      category: "empty category",
    },
    assertions: (err, marketsInCategory) => {
      assert.ifError(err);
      assert.deepEqual(marketsInCategory, []);
    },
  });
  test({
    description: "get markets upcoming, unknown designated reporter",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reportingState: ReportingState.PRE_REPORTING,
      designatedReporter: "0xf0f0f0f0f0f0f0f0b0b0b0b0b0b0b0f0f0f0f0b0",
    },
    assertions: (err, marketsUpcomingDesignatedReporting) => {
      assert.ifError(err);
      assert.deepEqual(marketsUpcomingDesignatedReporting, []);
    },
  });
  test({
    description: "get all markets upcoming designated reporting, sorted ascending by volume",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reportingState: ReportingState.PRE_REPORTING,
      sortBy: "volume",
      isSortDescending: false,
    },
    assertions: (err, marketsUpcomingDesignatedReporting) => {
      assert.ifError(err);
      assert.deepEqual(marketsUpcomingDesignatedReporting, [
        "0x0000000000000000000000000000000000000222",
      ]);
    },
  });
  test({
    description: "get all markets upcoming designated reporting by b0b",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reportingState: ReportingState.PRE_REPORTING,
      designatedReporter: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (err, marketsInfo) => {
      assert.ifError(err);
      assert.deepEqual(marketsInfo, [
        "0x0000000000000000000000000000000000000222",
      ]);
    },
  });
  test({
    description: "get markets awaiting unknown designated reporter",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reportingState: ReportingState.DESIGNATED_REPORTING,
      designatedReporter: "0xf0f0f0f0f0f0f0f0b0b0b0b0b0b0b0f0f0f0f0b0",
    },
    assertions: (err, marketsAwaitingDesignatedReporting) => {
      assert.ifError(err);
      assert.deepEqual(marketsAwaitingDesignatedReporting, []);
    },
  });
  test({
    description: "get all markets awaiting designated reporting, sorted ascending by volume",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reportingState: ReportingState.DESIGNATED_REPORTING,
      sortBy: "volume",
      isSortDescending: false,
    },
    assertions: (err, marketsInfo) => {
      assert.ifError(err);
      assert.deepEqual(marketsInfo, [
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
  test({
    description: "get all markets awaiting designated reporting, sorted ascending by reportingStateUpdatedOn",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reportingState: ReportingState.DESIGNATED_REPORTING,
      sortBy: "reportingStateUpdatedOn",
      isSortDescending: true,
    },
    assertions: (err, marketsInfo) => {
      assert.ifError(err);
      assert.deepEqual(marketsInfo, [
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
  test({
    description: "get all markets awaiting designated reporting by d00d",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reportingState: ReportingState.DESIGNATED_REPORTING,
      designatedReporter: "0x000000000000000000000000000000000000d00d",
    },
    assertions: (err, marketsInfo) => {
      assert.ifError(err);
      assert.deepEqual(marketsInfo, [
        "0x0000000000000000000000000000000000000003",
      ]);
    },
  });
  test({
    description: "get markets awaiting unknown designated reporter",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      designatedReporter: "0xf0f0f0f0f0f0f0f0b0b0b0b0b0b0b0f0f0f0f0b0",
    },
    assertions: (err, marketsAwaitingDesignatedReporting) => {
      assert.ifError(err);
      assert.deepEqual(marketsAwaitingDesignatedReporting, []);
    },
  });
  test({
    description: "get all markets awaiting designated reporting, sorted ascending by volume",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reportingState: ReportingState.DESIGNATED_REPORTING,
      sortBy: "volume",
      isSortDescending: false,
    },
    assertions: (err, marketsInfo) => {
      assert.ifError(err);
      assert.deepEqual(marketsInfo, [
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
  test({
    description: "get all markets awaiting designated reporting by d00d",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      designatedReporter: "0x000000000000000000000000000000000000d00d",
    },
    assertions: (err, marketsInfo) => {
      assert.ifError(err);
      assert.deepEqual(marketsInfo, [
        "0x0000000000000000000000000000000000000003",
      ]);
    },
  });
  test({
    description: "get markets upcoming, unknown designated reporter",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      designatedReporter: "0xf0f0f0f0f0f0f0f0b0b0b0b0b0b0b0f0f0f0f0b0",
    },
    assertions: (err, marketsUpcomingDesignatedReporting) => {
      assert.ifError(err);
      assert.deepEqual(marketsUpcomingDesignatedReporting, []);
    },
  });
  test({
    description: "get all markets upcoming designated reporting, sorted ascending by volume",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reportingState: ReportingState.PRE_REPORTING,
      sortBy: "volume",
      isSortDescending: false,
    },
    assertions: (err, marketsUpcomingDesignatedReporting) => {
      assert.ifError(err);
      assert.deepEqual(marketsUpcomingDesignatedReporting, [
        "0x0000000000000000000000000000000000000222",
      ]);
    },
  });
  test({
    description: "get all markets upcoming designated reporting by b0b",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reportingState: ReportingState.PRE_REPORTING,
      designatedReporter: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (err, marketsInfo) => {
      assert.ifError(err);
      assert.deepEqual(marketsInfo, [
        "0x0000000000000000000000000000000000000222",
      ]);
    },
  });
});
