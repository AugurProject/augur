const assert = require("chai").assert;
const Augur = require("augur.js");
const sqlite3 = require("sqlite3");
const Knex = require("knex");
const setupTestDb = require("../../test.database");
const { calculateEarningsPerTimePeriod, getProfitLoss, bucketRangeByInterval } = require("../../../../src/server/getters/get-profit-loss");
const { postProcessDatabaseResults } = require("../../../../src/server/post-process-database-results");

const START_TIME = 1506474500;
const MINUTE_SECONDS = 60;
const HOUR_SECONDS = MINUTE_SECONDS * 60;

describe("server/getters/get-profit-loss#bucketRangeByInterval", () => {
  it("throws when startTime is negative", (done) => {
    assert.throws(() => bucketRangeByInterval(-1, 0, 1), Error, "startTime must be a valid unix timestamp, greater than 0");
    done();
  });

  it("throws when endTime is negative", (done) => {
    assert.throws(() => bucketRangeByInterval(0, -1, 1), Error, "endTime must be a valid unix timestamp, greater than 0");
    done();
  });

  it("throws when periodInterval is negative", (done) => {
    assert.throws(() => bucketRangeByInterval(0, 1, -1), Error, "periodInterval must be positive integer (seconds)");
    done();
  });

  it("throws when periodInterval is zero", (done) => {
    assert.throws(() => bucketRangeByInterval(0, 1, 0), Error, "periodInterval must be positive integer (seconds)");
    done();
  });

  it("throws when startTime is greater than endTime", (done) => {
    assert.throws(() => bucketRangeByInterval(1, 0, 1), Error, "endTime must be greater than or equal startTime");
    done();
  });

  it("Does not throw when startTime is equal to endTime", (done) => {
    assert.doesNotThrow(() => bucketRangeByInterval(0, 0, 1));
    done();
  });

  it("generates a range including only startTime and endTime", (done) => {
    const buckets = bucketRangeByInterval(10000, 10040, 20000);
    assert.deepEqual(buckets, [
      {
        timestamp: 10000,
      },
      {
        timestamp: 10040,
      },
    ]);

    done();
  });

  it("generates a range of 5 buckets, including start and end times every 10 seconds", (done) => {
    const buckets = bucketRangeByInterval(10000, 10040, 10);
    assert.deepEqual(buckets, [
      {
        timestamp: 10000,
      },
      {
        timestamp: 10010,
      },
      {
        timestamp: 10020,
      },
      {
        timestamp: 10030,
      },
      {
        timestamp: 10040,
      },
    ]);

    done();
  });

  it("generates 31 buckets with explicit periodInteval", (done) => {
    const buckets = bucketRangeByInterval(0, 30 * 86400, 86400);
    assert.equal(buckets.length, 31);

    done();
  });

  it("generates 31 buckets with implicit periodInteval", (done) => {
    const buckets = bucketRangeByInterval(0, 30 * 86400);
    assert.equal(buckets.length, 31);

    done();
  });
});

