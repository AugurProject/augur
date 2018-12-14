const Augur = require("augur.js");
const setupTestDb = require("../../test.database");
const { getProfitLoss, getProfitLossSummary, bucketRangeByInterval } = require("src/server/getters/get-profit-loss");

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

  beforeEach(async () => {
    connection = await setupTestDb();
  });

  afterEach(async () => {
    if (connection) await connection.destroy();
  });

  it("generates a 31-value timeseries P/L", async () => {
    const results = await getProfitLoss(connection, augur, {
      universe: "0x000000000000000000000000000000000000000b",
      account:  "0xffff000000000000000000000000000000000000",
      marketId: "0x0000000000000000000000000000000000000ff1",
    });

    console.log(results);
    expect(results.length).toEqual(31);
  });

  it("generates a 5-value timeseries P/L", async () => {
    const startTime = 1534320908;
    const endTime = 1534417613;
    const periodInterval = (endTime - startTime)/4;
    const results = await getProfitLoss(connection, augur, {
      universe: "0x000000000000000000000000000000000000000b",
      account:  "0xffff000000000000000000000000000000000000",
      marketId: "0x0000000000000000000000000000000000000ff1",
      startTime,
      endTime,
      periodInterval,
    });

    expect(results.length).toEqual(5);
  });
});

describe("server/getters/get-profit-loss#getProfitLossSummary", () => {
  var connection = null;
  var augur = new Augur();

  beforeEach(async () => {
    connection = await setupTestDb();
  });

  afterEach(async () => {
    if (connection) await connection.destroy();
  });

  it("returns 0-value 1-day and 30-day PLs", async() => {
    const results = await getProfitLossSummary(connection, augur, {
      universe: "0x000000000000000000000000000000000000000b",
      account:  "0xffff000000000000000000000000000000000000",
      marketId: "0x0000000000000000000000000000000000000ff1",
    });

    const deserialized = JSON.parse(JSON.stringify(results));

    expect(Object.keys(deserialized)).toEqual(expect.arrayContaining(["1", "30"]));
    expect(deserialized["1"]).toMatchObject({
      realized: "0",
      unrealized: "0",
      total: "0",
      position: "0",
    });
    expect(deserialized["30"]).toMatchObject({
      realized: "0",
      unrealized: "0",
      total: "0",
      position: "0",
    });
  });

  it("returns 1-day and 30-day PLs at endtime", async() => {
    const results = await getProfitLossSummary(connection, augur, {
      universe: "0x000000000000000000000000000000000000000b",
      account:  "0xffff000000000000000000000000000000000000",
      marketId: "0x0000000000000000000000000000000000000ff1",
      endTime: 1534435013,
    });

    const deserialized = JSON.parse(JSON.stringify(results));

    expect(Object.keys(deserialized)).toEqual(expect.arrayContaining(["1", "30"]));
    expect(deserialized["1"]).toMatchObject({
      realized: "54999999999.58212297261370994338",
      unrealized: "0",
      total: "54999999999.58212297261370994338",
      position: "0.0004",
    });
    expect(deserialized["30"]).toMatchObject({
      realized: "54999999999.58212297261370994338",
      unrealized: "0",
      total: "54999999999.58212297261370994338",
      position: "0.0004",
    });
  });

  it("returns returns zero-value PLs for nonexistent account", async() => {
    const results = await getProfitLossSummary(connection, augur, {
      universe: "0x000000000000000000000000000000000000000b",
      account:  "0xbadf000000000000000000000000000000000000",
      marketId: "0x0000000000000000000000000000000000000ff1",
    });
    const deserialized = JSON.parse(JSON.stringify(results));

    expect(Object.keys(deserialized)).toEqual(expect.arrayContaining(["1", "30"]));
    expect(deserialized["1"]).toMatchObject({
      realized: "0",
      unrealized: "0",
      total: "0",
      position: "0",
    });
    expect(deserialized["30"]).toMatchObject({
      realized: "0",
      unrealized: "0",
      total: "0",
      position: "0",
    });
  });

  it("returns returns zero-value PLs for nonexistent market", async() => {
    const results = await getProfitLossSummary(connection, augur, {
      universe: "0x000000000000000000000000000000000000000b",
      account:  "0xffff000000000000000000000000000000000000",
      marketId: "0xbad0000000000000000000000000000000000ff1",
    });
    const deserialized = JSON.parse(JSON.stringify(results));

    expect(Object.keys(deserialized)).toEqual(expect.arrayContaining(["1", "30"]));
    expect(deserialized["1"]).toMatchObject({
      realized: "0",
      unrealized: "0",
      total: "0",
      position: "0",
    });
    expect(deserialized["30"]).toMatchObject({
      realized: "0",
      unrealized: "0",
      total: "0",
      position: "0",
    });
  });
});
