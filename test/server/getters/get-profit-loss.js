const Augur = require("augur.js");
const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { calculateBucketProfitLoss, getProfitLoss, bucketRangeByInterval } = require("../../../build/server/getters/get-profit-loss");
const sqlite3 = require("sqlite3");
const Knex = require("knex");
const { postProcessDatabaseResults } = require("../../../build/server/post-process-database-results");

const START_TIME = 1506474500;
const MINUTE_SECONDS = 60;
const HOUR_SECONDS = MINUTE_SECONDS * 60;

const BigNumber = require("bignumber.js");
BigNumber.config({
  MODULO_MODE: BigNumber.EUCLID,
  ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN,
});

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
        profitLoss: null,
      },
      {
        timestamp: 10040,
        profitLoss: null,
      },
    ]);

    done();
  });

  it("generates a range of 5 buckets, including start and end times every 10 seconds", (done) => {
    const buckets = bucketRangeByInterval(10000, 10040, 10);
    assert.deepEqual(buckets, [
      {
        timestamp: 10000,
        profitLoss: null,
      },
      {
        timestamp: 10010,
        profitLoss: null,
      },
      {
        timestamp: 10020,
        profitLoss: null,
      },
      {
        timestamp: 10030,
        profitLoss: null,
      },
      {
        timestamp: 10040,
        profitLoss: null,
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

describe("tests for test/trading-proceeds-claimed-2.db", () => {
  var connection = null;
  var augur = new Augur();
  const universe = "0x8e9d71cb6e9080bc04f6fd562f5dd68af0163baf";
  const account1 = "0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb";

  beforeEach((done) => {
    sqlite3.verbose();
    connection = Knex({
      client: "sqlite3",
      connection: {
        filename: "./test/trading-proceeds-claimed-2.db",
      },
      acquireConnectionTimeout: 5 * 60 * 1000,
      useNullAsDefault: true,
      postProcessResponse: postProcessDatabaseResults,
    });

    done();
  });

  afterEach((done) => {
    connection.destroy();
    done();
  });

  it("has a finalized market", (done) => {
    connection("markets")
      .select("*")
      .whereNotNull("finalizationBlockNumber")
      .asCallback((err, results) => {
        assert.ifError(err);
        assert.isNotNull(results);
        assert.equal(results.length, 9);

        done();
      });
  });

  it("calculates PL for a user for all time", (done) => {
    getProfitLoss(connection, augur, universe, account1, 1550877478, 1551827939, (1551827939 - 1550877478)/4, (err, results) => {
      try {
        assert.deepEqual(results.aggregate, [
          {
            "lastPrice": "0.5",
            "profitLoss": {
              "meanOpenPrice": "0.5",
              "position": "9.994",
              "realized": "-0.0000000000000000000000004",
              "total": "-0.0000000000000000000000004",
              "unrealized": "0",
            },
            "timestamp": 1551115093.25,
          },
          {
            "lastPrice": "0.5",
            "profitLoss": {
              "meanOpenPrice": "0.5",
              "position": "9.994",
              "realized": "-0.0000000000000000000000004",
              "total": "-0.0000000000000000000000004",
              "unrealized": "0",
            },
            "timestamp": 1551352708.5,
          },
          {
            "profitLoss": {
              "meanOpenPrice": "0.5",
              "position": "9.994",
              "realized": "0",
              "total": "4.997",
              "unrealized": "4.997",
            },
            "timestamp": 1551590323.75,
          },
          {
            "profitLoss": {
              "meanOpenPrice": "0.99940035978412952229",
              "position": "-10005999999999999990.006",
              "realized": "4.997",
              "total": "4.997",
              "unrealized": "0",
            },
            "timestamp": 1551827939,
          },
        ]);

        done();
      } catch (e) {
        done(e);
      }
    });
  });
});


describe("tests for test/profitloss.db", () => {
  var connection = null;
  var augur = new Augur();

  beforeEach((done) => {
    sqlite3.verbose();
    connection = Knex({
      client: "sqlite3",
      connection: {
        filename: "./test/profitloss.db",
      },
      acquireConnectionTimeout: 5 * 60 * 1000,
      useNullAsDefault: true,
      postProcessResponse: postProcessDatabaseResults,
    });

    done();
  });

  afterEach((done) => {
    connection.destroy();
    done();
  });

  it("has 2 trades", (done) => {
    connection("trades")
      .select("*")
      .asCallback((err, results) => {
        assert.ifError(err);
        assert.equal(results.length, 2);
        done();
      });
  });

  const universe = "0x1b8dae4f281a437e797f6213c6564926a04d9959";
  const account1 = "0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb";
  const account2 = "0xbd355a7e5a7adb23b51f54027e624bfe0e238df6";
  const endTime = Date.now();
  it("has a total PL of -4eth for account1", (done) => {
    getProfitLoss(connection, augur, universe, account1, 0, endTime, endTime, (err, results) => {
      try {
        assert.deepEqual(results.aggregate, [
          {
            lastPrice: "0.1",
            profitLoss: {
              meanOpenPrice: "0",
              position: "0",
              realized: "-4",
              total: "-4",
              unrealized: "0",
            },
            timestamp: endTime,
          },
        ]);
      } catch (e) {
        return done(e);
      }
      done();
    });
  });
  it("has a total PL of 4eth for account2", (done) => {
    getProfitLoss(connection, augur, universe, account2, 0, endTime, endTime, (err, results) => {
      try {

        var expected = [{
          lastPrice: "0.1",
          profitLoss: {
            meanOpenPrice: "0",
            position: "0",
            realized: "4",
            total: "4",
            unrealized: "0",
          },
          timestamp: endTime,
        }];
        assert.deepEqual(results.aggregate, expected);

        assert.deepEqual(results.all, {
          "0x0402c3fe7c695cb619b817f7bb9e42e2ad29e214": [null, expected],
        });
      } catch (e) {
        return done(e);
      }
      done();
    });
  });
});

describe("server/getters/get-profit-loss", () => {
  var connection = null;
  var augur = new Augur();

  const testWithDatabase = (t, done) => {
    getProfitLoss(connection, augur, t.params.universe, t.params.account, t.params.startTime, t.params.endTime, t.params.periodInterval, (err, profitLoss) => {
      try {
        t.assertions(err, profitLoss);
      } catch (e) {
        return done(e);
      }
      done();
    });
  };

  const testWithMockedData = (t, done) => {
    try {
      var profitLoss = null;
      var error = null;
      try {
        profitLoss = calculateBucketProfitLoss(augur, t.params.trades, t.params.buckets);
      } catch (e) {
        error = e;
      }
      t.assertions(error, profitLoss);
    } catch (e) {
      return done(e);
    }
    done();
  };

  beforeEach((done) => {
    setupTestDb((err, db) => {
      if (err) return done(new Error(err));
      connection = db;
      done();
    });
  });

  afterEach((done) => {
    connection.destroy();
    done();
  });

  it("generates 3 datapoints for user with trades in one period after start time", (done) => {
    testWithDatabase(
      {
        params: {
          universe: "0x000000000000000000000000000000000000000b",
          account: "0x0000000000000000000000000000000000000b0b",
          startTime: START_TIME,
          endTime: START_TIME + 3 * HOUR_SECONDS,
          periodInterval: HOUR_SECONDS,
        },
        assertions: (err, profitLoss) => {
          assert.ifError(err);
          assert.deepEqual(profitLoss.aggregate, [
            {
              profitLoss: {
                meanOpenPrice: "5.5",
                position: "-0.9",
                realized: "-0.13",
                total: "-0.26",
                unrealized: "-0.13",
              },
              timestamp: 1506478100,
            },
            {
              profitLoss: {
                meanOpenPrice: "5.5",
                position: "-0.9",
                realized: "-0.13",
                total: "-0.26",
                unrealized: "-0.13",
              },
              timestamp: 1506481700,
            },
            {
              profitLoss: {
                meanOpenPrice: "5.5",
                position: "-0.9",
                realized: "-0.13",
                total: "-0.26",
                unrealized: "-0.13",
              },
              timestamp: 1506485300,
            },
          ]);
        },
      },
      done
    );
  });

  it("buckets datapoints from the first trade the user made", (done) => {
    testWithDatabase(
      {
        params: {
          universe: "0x000000000000000000000000000000000000000b",
          account: "0x0000000000000000000000000000000000000b0b",
          startTime: 0,
          endTime: START_TIME + 3 * HOUR_SECONDS,
          periodInterval: HOUR_SECONDS,
        },
        assertions: (err, profitLoss) => {
          assert.ifError(err);
          assert.deepEqual(profitLoss.aggregate, [
            {
              profitLoss: {
                meanOpenPrice: "5.5",
                position: "-0.9",
                realized: "-0.13",
                total: "-0.26",
                unrealized: "-0.13",
              },
              timestamp: 1506478100,
            },
            {
              profitLoss: {
                meanOpenPrice: "5.5",
                position: "-0.9",
                realized: "-0.13",
                total: "-0.26",
                unrealized: "-0.13",
              },
              timestamp: 1506481700,
            },
            {
              profitLoss: {
                meanOpenPrice: "5.5",
                position: "-0.9",
                realized: "-0.13",
                total: "-0.26",
                unrealized: "-0.13",
              },
              timestamp: 1506485300,
            },
          ]);
        },
      },
      done
    );
  });

  it("generates 3 PL datapoints for user with trades in three periods after start time", (done) => {
    testWithDatabase(
      {
        params: {
          universe: "0x000000000000000000000000000000000000000b",
          account: "0x0000000000000000000000000000000000000b0b",
          startTime: START_TIME,
          endTime: START_TIME + MINUTE_SECONDS,
          periodInterval: 10,
        },
        assertions: (err, profitLoss) => {
          assert.ifError(err);
          assert.deepEqual(profitLoss.aggregate, [
            {
              profitLoss: {
                meanOpenPrice: "5.5",
                position: "-0.6",
                realized: "0",
                total: "0",
                unrealized: "0",
              },
              timestamp: 1506474510,
            },
            {
              profitLoss: {
                meanOpenPrice: "5.5",
                position: "-0.9",
                realized: "-0.13",
                total: "-0.26",
                unrealized: "-0.13",
              },
              timestamp: 1506474520,
            },
            {
              profitLoss: {
                meanOpenPrice: "5.5",
                position: "-0.9",
                realized: "-0.13",
                total: "-0.26",
                unrealized: "-0.13",
              },
              timestamp: 1506474530,
            },
            {
              profitLoss: {
                meanOpenPrice: "5.5",
                position: "-0.9",
                realized: "-0.13",
                total: "-0.26",
                unrealized: "-0.13",
              },
              timestamp: 1506474540,
            },
            {
              profitLoss: {
                meanOpenPrice: "5.5",
                position: "-0.9",
                realized: "-0.13",
                total: "-0.26",
                unrealized: "-0.13",
              },
              timestamp: 1506474550,
            },
            {
              profitLoss: {
                meanOpenPrice: "5.5",
                position: "-0.9",
                realized: "-0.13",
                total: "-0.26",
                unrealized: "-0.13",
              },
              timestamp: 1506474560,
            },
          ]);
        },
      },
      done
    );
  });

  it("generates 30 PLs all with null profitLoss", (done) => {
    testWithDatabase(
      {
        params: {
          universe: "0x000000000000000000000000000000000000000b",
          account: "0x1000000000000000000000000000000000000b0b",
          startTime: 0,
          endTime: 30 * 86400,
          periodInterval: 86400,
        },
        assertions: (err, profitLoss) => {
          assert.ifError(err);
          assert.ifError(err);
          assert.equal(profitLoss.aggregate.length, 30);
          assert.deepEqual(profitLoss.all, {});
        },
      },
      done
    );
  });

  var trades1 = [
    {
      timestamp: 10000,
      type: "sell",
      amount: "10",
      price: "0.1",
      maker: true,
    },
    {
      timestamp: 10010,
      type: "buy",
      amount: "5",
      price: "0.2",
      maker: true,
    },
    {
      timestamp: 10020,
      type: "sell",
      amount: "10",
      price: "0.2",
      maker: true,
    },
    {
      timestamp: 10030,
      type: "buy",
      amount: "5",
      price: "0.3",
      maker: true,
    },
  ];

  it("calculates pl for all data as one period with no basis", (done) => {
    testWithMockedData(
      {
        params: {
          trades: trades1,
          buckets: [
            {
              timestamp: 10000,
              lastPrice: "0.1",
            },
            {
              timestamp: 20000,
              lastPrice: "0.3",
            },
          ],
        },
        assertions: (err, profitLoss) => {
          assert.ifError(err);
          assert.deepEqual(profitLoss, [
            {
              timestamp: 20000,
              lastPrice: "0.3",
              profitLoss: {
                position: "10",
                meanOpenPrice: "0.166666666666666666667",
                realized: "1.16666666666666666666",
                total: "2.49999999999999999999",
                unrealized: "1.33333333333333333333",
              },
            },
          ]);
        },
      },
      done
    );
  });

  it("calculates pl for 4 periods with no basis", (done) => {
    testWithMockedData(
      {
        params: {
          trades: trades1,
          buckets: [
            {
              timestamp: 10000,
              lastPrice: null,
            },
            {
              timestamp: 10010,
              lastPrice: "0.1",
            },
            {
              timestamp: 10020,
              lastPrice: "0.2",
            },
            {
              timestamp: 10030,
              lastPrice: "0.2",
            },
            {
              timestamp: 10040,
              lastPrice: "0.3",
            },
          ],
        },
        assertions: (err, profitLoss) => {
          assert.ifError(err);
          assert.deepEqual(profitLoss, [
            {
              profitLoss: {
                meanOpenPrice: "0.1",
                position: "10",
                realized: "0",
                total: "0",
                unrealized: "0",
              },
              timestamp: 10010,
              lastPrice: "0.1",
            },
            {
              profitLoss: {
                meanOpenPrice: "0.1",
                position: "5",
                realized: "0.5",
                total: "1",
                unrealized: "0.5",
              },
              timestamp: 10020,
              lastPrice: "0.2",
            },
            {
              profitLoss: {
                meanOpenPrice: "0.166666666666666666667",
                position: "15",
                realized: "0.5",
                total: "0.999999999999999999995",
                unrealized: "0.499999999999999999995",
              },
              timestamp: 10030,
              lastPrice: "0.2",
            },
            {
              profitLoss: {
                meanOpenPrice: "0.166666666666666666667",
                position: "10",
                realized: "1.166666666666666666665",
                total: "2.499999999999999999995",
                unrealized: "1.33333333333333333333",
              },
              timestamp: 10040,
              lastPrice: "0.3",
            },
          ]);
        },
      },
      done
    );
  });

  it("calculates pl for 1 period, and 4 periods, and verifies last period PLs are equal", (done) => {
    var buckets1 = [
      {
        timestamp: 10000,
        lastPrice: null,
      },
      {
        timestamp: 20000,
        lastPrice: "0.3",
      },
    ];
    var pls1 = calculateBucketProfitLoss(augur, trades1, buckets1);
    assert.equal(pls1.length, 1);

    var buckets2 = [
      {
        timestamp: 10000,
        lastPrice: null,
      },
      {
        timestamp: 10010,
        lastPrice: "0.1",
      },
      {
        timestamp: 10020,
        lastPrice: "0.2",
      },
      {
        timestamp: 10030,
        lastPrice: "0.2",
      },
      {
        timestamp: 10040,
        lastPrice: "0.3",
      },
    ];
    var pls2 = calculateBucketProfitLoss(augur, trades1, buckets2);
    assert.equal(pls2.length, 4);

    var result = {
      meanOpenPrice: "0.166666666666666666667",
      position: "10",
      realized: "1.166666666666666666665",
      total: "2.499999999999999999995",
      unrealized: "1.33333333333333333333",
    };

    assert.deepEqual(pls1[0].profitLoss, result);
    assert.deepEqual(pls2[3].profitLoss, result);

    done();
  });

  it("calculates pl for 1 periods and ignores trailing trades", (done) => {
    var trades2 = trades1.slice();
    trades2.push({
      timestamp: 10040,
      type: "buy",
      amount: "5",
      price: "0.3",
      maker: true,
    });

    var buckets = [
      {
        timestamp: 10000,
        lastPrice: null,
      },
      {
        timestamp: 10040,
        lastPrice: "0.3",
      },
    ];
    var pls1 = calculateBucketProfitLoss(augur, trades2, buckets);
    assert.equal(pls1.length, 1);

    var result = {
      meanOpenPrice: "0.166666666666666666667",
      position: "10",
      realized: "1.166666666666666666665",
      total: "2.499999999999999999995",
      unrealized: "1.33333333333333333333",
    };

    assert.deepEqual(pls1[0].profitLoss, result);

    done();
  });

  it("calculates pl for one period, with basis which nets out", (done) => {
    // These two trades net out, leaving a 0 basis
    var trades2 = [
      {
        timestamp: 8000,
        type: "buy",
        amount: "5",
        price: "0.3",
        maker: true,
      },
      {
        timestamp: 9000,
        type: "sell",
        amount: "5",
        price: "0.3",
        maker: true,
      },
    ].concat(trades1);

    var buckets = [
      {
        timestamp: 10000,
        lastPrice: "0.3",
      },
      {
        timestamp: 10040,
        lastPrice: "0.3",
      },
    ];

    var pls1 = calculateBucketProfitLoss(augur, trades2, buckets);
    assert.equal(pls1.length, 1);

    var result = {
      meanOpenPrice: "0.166666666666666666667",
      position: "10",
      realized: "1.16666666666666666666",
      total: "2.49999999999999999999",
      unrealized: "1.33333333333333333333",
    };

    assert.deepEqual(pls1[0].profitLoss, result);

    done();
  });

  it("calculates pl for one period, with basis doesnt net out", (done) => {
    var trades2 = [
      {
        timestamp: 8000,
        type: "buy",
        amount: "5",
        price: "0.4",
        maker: true,
      },
      {
        timestamp: 9000,
        type: "sell",
        amount: "3",
        price: "0.1",
        maker: true,
      },
    ].concat(trades1);

    var buckets = [
      {
        timestamp: 10000,
        lastPrice: "0.1",
      },
      {
        timestamp: 10040,
        lastPrice: "0.3",
      },
    ];

    var pls1 = calculateBucketProfitLoss(augur, trades2, buckets);
    assert.equal(pls1.length, 1);

    var result = {
      meanOpenPrice: "0.176923076923076923077",
      position: "8",
      realized: "1.71538461538461538461",
      total: "2.1",
      unrealized: "0.38461538461538461538",
    };

    assert.deepEqual(pls1[0].profitLoss, result);

    done();
  });

  it("Account 1 has 4eth Total P/L", (done) => {
    const trades = [
      {
        timestamp: 10000,
        type: "sell",
        price: "0.5",
        amount: "10",
        maker: true,
      },
      {
        timestamp: 10020,
        type: "buy",
        price: "0.1",
        amount: "10",
        maker: true,
      },
    ];

    const buckets = [
      {
        timestamp: 10000,
        lastPrice: null,
      },
      {
        timestamp: 20000,
        lastPrice: 0.1,
      },
    ];
    const results = calculateBucketProfitLoss(augur, trades, buckets);
    const results2 = augur.trading.calculateProfitLoss({ trades, lastPrice: 0.1 });

    assert.deepEqual(results[0].profitLoss, results2);
    assert.deepEqual(results2, {
      meanOpenPrice: "0",
      position: "0",
      realized: "-4",
      total: "-4",
      unrealized: "0",
    });

    done();
  });

  it("Account 2 has +4eth P/L", (done) => {
    const trades = [
      {
        /* MADE A BUY ORDER */
        timestamp: 10000,
        type: "sell",
        price: "0.5",
        amount: "10",
        maker: false,
      },
      {
        /* FILLING THE BUY ORDER */
        timestamp: 10020,
        type: "buy",
        price: "0.1",
        amount: "10",
        maker: false,
      },
    ];

    const buckets = [
      {
        timestamp: 10000,
        lastPrice: null,
      },
      {
        timestamp: 20000,
        lastPrice: 0.1,
      },
    ];
    const results = calculateBucketProfitLoss(augur, trades, buckets);
    const results2 = augur.trading.calculateProfitLoss({ trades, lastPrice: 0.1 });

    assert.deepEqual(results[0].profitLoss, results2);
    assert.deepEqual(results2, {
      meanOpenPrice: "0",
      position: "0",
      realized: "4",
      total: "4",
      unrealized: "0",
    });

    done();
  });
});
