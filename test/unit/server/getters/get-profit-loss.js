const Augur = require("augur.js");
const sqlite3 = require("sqlite3");
const path = require("path");
const Knex = require("knex");
const setupTestDb = require("../../test.database");
const { calculateEarningsPerTimePeriod, getProfitLoss, bucketRangeByInterval } = require("src/server/getters/get-profit-loss");
const { postProcessDatabaseResults } = require("src/server/post-process-database-results");

const START_TIME = 1506474500;
const MINUTE_SECONDS = 60;
const HOUR_SECONDS = MINUTE_SECONDS * 60;

describe("server/getters/get-profit-loss#bucketRangeByInterval", () => {
  test("throws when startTime is negative", (done) => {
    expect(() => bucketRangeByInterval(-1, 0, 1)).toThrow();
    done();
  });

  test("throws when endTime is negative", (done) => {
    expect(() => bucketRangeByInterval(0, -1, 1)).toThrow();
    done();
  });

  test("throws when periodInterval is negative", (done) => {
    expect(() => bucketRangeByInterval(0, 1, -1)).toThrow();
    done();
  });

  test("throws when periodInterval is zero", (done) => {
    expect(() => bucketRangeByInterval(0, 1, 0)).toThrow();
    done();
  });

  test("throws when startTime is greater than endTime", (done) => {
    expect(() => bucketRangeByInterval(1, 0, 1)).toThrow();
    done();
  });

  test("Does not throw when startTime is equal to endTime", (done) => {
    expect(() => bucketRangeByInterval(0, 0, 1)).not.toThrow();
    done();
  });

  test("generates a range including only startTime and endTime", (done) => {
    const buckets = bucketRangeByInterval(10000, 10040, 20000);
    expect(buckets).toEqual([
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
    expect(buckets).toEqual([
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

  test("generates 31 buckets with explicit periodInteval", (done) => {
    const buckets = bucketRangeByInterval(0, 30 * 86400, 86400);
    expect(buckets.length).toEqual(31);

    done();
  });

  test("generates 31 buckets with implicit periodInteval", (done) => {
    const buckets = bucketRangeByInterval(0, 30 * 86400);
    expect(buckets.length).toEqual(31);

    done();
  });
});


describe("server/getters/get-profit-loss#getProfitLoss", () => {
  var connection = null;
  var augur = new Augur();

  beforeEach('Initialize Database', (done) => {
    setupTestDb((err, db) => {
      if (err) return done(new Error(err));
      connection = db;
      done();
    });
  });

  afterEach('Destroy DB and Disconnect', async() => {
    if(connection) await connection.destroy();
  });

  it("generates a 3-value timeseries P/L", async () => {
    const results = await getProfitLoss(connection, augur, {
      universe: "0x000000000000000000000000000000000000000b",
			account:  "0xffff000000000000000000000000000000000000",
      marketId: "0x0000000000000000000000000000000000000ff1"
    });

    console.log(JSON.stringify(results));
    expect(results.length).to.equal(3);
  });
});

