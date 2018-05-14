const Augur = require("augur.js");
const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const {calculateBucketProfitLoss, getProfitLoss, bucketRangeByInterval} = require("../../../build/server/getters/get-profit-loss");

const START_TIME = 1506474500;
const MINUTE_SECONDS = 60;
const HOUR_SECONDS = MINUTE_SECONDS*60;

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

  it("throws when startTime is equal to endTime", (done) => {
    assert.throws(() => bucketRangeByInterval(0, 0, 1), Error, "endTime must be greater than startTime");
    done();
  });

  it("throws when startTime is greater than endTime", (done) => {
    assert.throws(() => bucketRangeByInterval(1, 0, 1), Error, "endTime must be greater than startTime");
    done();
  });

  it("generates a range including only startTime and endTime", (done) => {
    const buckets = bucketRangeByInterval(10000, 10040, 20000);
    assert.deepEqual(buckets, [{
      timestamp: 10000,
      profitLoss: null,
    }, {
      timestamp: 10040,
      profitLoss: null,
    }]);

    done();
  });

  it("generates a range of 5 buckets, including start and end times every 10 seconds", (done) => {
    const buckets = bucketRangeByInterval(10000, 10040, 10);
    assert.deepEqual(buckets, [{
      timestamp: 10000,
      profitLoss: null,
    }, {
      timestamp: 10010,
      profitLoss: null,
    }, {
      timestamp: 10020,
      profitLoss: null,
    }, {
      timestamp: 10030,
      profitLoss: null,
    }, {
      timestamp: 10040,
      profitLoss: null,
    }]);

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

  it("generates 3 datapoints for user with trades in one period after start time", (done) => {
    testWithDatabase({
      params: {
        universe: "0x000000000000000000000000000000000000000b",
        account: "0x0000000000000000000000000000000000000b0b",
        startTime: START_TIME,
        endTime: START_TIME + 3*HOUR_SECONDS,
        periodInterval: HOUR_SECONDS,
      },
      assertions: (err, profitLoss) => {
        assert.isNull(err);
        assert.deepEqual(profitLoss, [
          {
            "profitLoss": {
              "meanOpenPrice": "5.42352941176470588235",
              "position": "-1.7",
              "realized": "0",
              "total": "-0.13",
              "unrealized": "-0.13",
            },
            "timestamp": 1506478100,
          },
          {
            "profitLoss": {
              "meanOpenPrice": "5.42352941176470588235",
              "position": "-1.7",
              "realized": "0",
              "total": "-0.13",
              "unrealized": "-0.13",
            },
            "timestamp": 1506481700,
          },
          {
            "profitLoss": {
              "meanOpenPrice": "5.42352941176470588235",
              "position": "-1.7",
              "realized": "0",
              "total": "-0.13",
              "unrealized": "-0.13",
            },
            "timestamp": 1506485300,
          },
        ]);
      },
    }, done);
  });

  it("buckets datapoints from the first trade the user made", (done) => {
    testWithDatabase({
      params: {
        universe: "0x000000000000000000000000000000000000000b",
        account: "0x0000000000000000000000000000000000000b0b",
        startTime: 0,
        endTime: START_TIME + 3*HOUR_SECONDS,
        periodInterval: HOUR_SECONDS,
      },
      assertions: (err, profitLoss) => {
        assert.isNull(err);
        assert.deepEqual(profitLoss, [
          {
            "profitLoss": {
              "meanOpenPrice": "5.42352941176470588235",
              "position": "-1.7",
              "realized": "0",
              "total": "-0.13",
              "unrealized": "-0.13",
            },
            "timestamp": 1506478115,
          },
          {
            "profitLoss": {
              "meanOpenPrice": "5.42352941176470588235",
              "position": "-1.7",
              "realized": "0",
              "total": "-0.13",
              "unrealized": "-0.13",
            },
            "timestamp": 1506481715,
          },
          {
            "profitLoss": {
              "meanOpenPrice": "5.42352941176470588235",
              "position": "-1.7",
              "realized": "0",
              "total": "-0.13",
              "unrealized": "-0.13",
            },
            "timestamp": 1506485300,
          },
        ]);
      },
    }, done);
  });

  it("generates 3 PL datapoints for user with trades in three periods after start time", (done) => {
    testWithDatabase({
      params: {
        universe: "0x000000000000000000000000000000000000000b",
        account: "0x0000000000000000000000000000000000000b0b",
        startTime: START_TIME,
        endTime: START_TIME + MINUTE_SECONDS,
        periodInterval: 10,
      },
      assertions: (err, profitLoss) => {
        assert.isNull(err);
        assert.deepEqual(profitLoss, [
          {
            "profitLoss": {
              "meanOpenPrice": "5.5",
              "position": "-1.4",
              "realized": "0",
              "total": "0",
              "unrealized": "0",
            },
            "timestamp": 1506474510,
          },
          {
            "profitLoss": {
              "meanOpenPrice": "5.42352941176470588235",
              "position": "-1.7",
              "realized": "0",
              "total": "-0.13",
              "unrealized": "-0.13",
            },
            "timestamp": 1506474520,
          },
          {
            "profitLoss": {
              "meanOpenPrice": "5.42352941176470588235",
              "position": "-1.7",
              "realized": "0",
              "total": "-0.13",
              "unrealized": "-0.13",
            },
            "timestamp": 1506474530,
          },
          {
            "profitLoss": {
              "meanOpenPrice": "5.42352941176470588235",
              "position": "-1.7",
              "realized": "0",
              "total": "-0.13",
              "unrealized": "-0.13",
            },
            "timestamp": 1506474540,
          },
          {
            "profitLoss": {
              "meanOpenPrice": "5.42352941176470588235",
              "position": "-1.7",
              "realized": "0",
              "total": "-0.13",
              "unrealized": "-0.13",
            },
            "timestamp": 1506474550,
          },
          {
            "profitLoss": {
              "meanOpenPrice": "5.42352941176470588235",
              "position": "-1.7",
              "realized": "0",
              "total": "-0.13",
              "unrealized": "-0.13",
            },
            "timestamp": 1506474560,
          },
        ]);
      },
    }, done);
  });


  it("generates 30 PLs all with null profitLoss", (done) => {
    testWithDatabase({
      params: {
        universe: "0x000000000000000000000000000000000000000b",
        account: "0x1000000000000000000000000000000000000b0b",
        startTime: 0,
        endTime: 30*86400,
        periodInterval: 86400,
      },
      assertions: (err, profitLoss) => {
        assert.isNull(err);
        assert.equal(profitLoss.length, 30);
      },
    }, done);
  });


  var trades1 = [{
    timestamp: 10000,
    type: "sell",
    amount: "10",
    price: "0.1",
    maker: true,
  }, {
    timestamp: 10010,
    type: "buy",
    amount: "5",
    price: "0.2",
    maker: true,
  }, {
    timestamp: 10020,
    type: "sell",
    amount: "10",
    price: "0.2",
    maker: true,
  }, {
    timestamp: 10030,
    type: "buy",
    amount: "5",
    price: "0.3",
    maker: true,
  }];

  it("calculates pl for all data as one period with no basis", (done) => {
    testWithMockedData({
      params: {
        trades: trades1,
        buckets: [{
          timestamp: 10000,
          lastPrice: "0.1",
        }, {
          timestamp: 20000,
          lastPrice: "0.3",
        }],
      },
      assertions: (err, profitLoss) => {
        assert.isNull(err);
        assert.deepEqual(profitLoss, [{
          timestamp: 20000,
          lastPrice: "0.3",
          profitLoss: {
            position: "10",
            meanOpenPrice: "0.166666666666666666667",
            realized: "1.16666666666666666666",
            total: "2.49999999999999999999",
            unrealized: "1.33333333333333333333",
            queued: "0",
          }},
        ]);
      },
    }, done);
  });

  it("calculates pl for 4 periods with no basis", (done) => {
    testWithMockedData({
      params: {
        trades: trades1,
        buckets: [{
          timestamp: 10000,
          lastPrice: null,
        }, {
          timestamp: 10010,
          lastPrice: "0.1",
        }, {
          timestamp: 10020,
          lastPrice: "0.2",
        }, {
          timestamp: 10030,
          lastPrice: "0.2",
        }, {
          timestamp: 10040,
          lastPrice: "0.3",
        }],
      },
      assertions: (err, profitLoss) => {
        assert.isNull(err);
        assert.deepEqual(profitLoss, [{
          "profitLoss": {
            "meanOpenPrice": "0.1",
            "position": "10",
            "queued": "0",
            "realized": "0",
            "total": "0",
            "unrealized": "0",
          },
          "timestamp": 10010,
          "lastPrice": "0.1",
        }, {
          "profitLoss": {
            "meanOpenPrice": "0.1",
            "position": "5",
            "queued": "0",
            "realized": "0.5",
            "total": "1",
            "unrealized": "0.5",
          },
          "timestamp": 10020,
          "lastPrice": "0.2",
        }, {
          "profitLoss": {
            "meanOpenPrice": "0.166666666666666666667",
            "position": "15",
            "queued": "0",
            "realized": "0.5",
            "total": "0.999999999999999999995",
            "unrealized": "0.499999999999999999995",
          },
          "timestamp": 10030,
          "lastPrice": "0.2",
        }, {
          "profitLoss": {
            "meanOpenPrice": "0.166666666666666666667",
            "position": "10",
            "queued": "0",
            "realized": "1.166666666666666666665",
            "total": "2.49999999999999999999",
            "unrealized": "1.33333333333333333333",
          },
          "timestamp": 10040,
          "lastPrice": "0.3",
        }]);
      },
    }, done);
  });

  it("calculates pl for 1 period, and 4 periods, and verifies last period PLs are equal", (done) => {
    var buckets1 = [{
      timestamp: 10000,
      lastPrice: null,
    }, {
      timestamp: 20000,
      lastPrice: "0.3",
    }];
    var pls1 = calculateBucketProfitLoss(augur, trades1, buckets1);
    assert.equal(pls1.length, 1);

    var buckets2 = [{
      timestamp: 10000,
      lastPrice: null,
    }, {
      timestamp: 10010,
      lastPrice: "0.1",
    }, {
      timestamp: 10020,
      lastPrice: "0.2",
    }, {
      timestamp: 10030,
      lastPrice: "0.2",
    }, {
      timestamp: 10040,
      lastPrice: "0.3",
    }];
    var pls2 = calculateBucketProfitLoss(augur, trades1, buckets2);
    assert.equal(pls2.length, 4);

    var result = {
      "meanOpenPrice": "0.166666666666666666667",
      "position": "10",
      "queued": "0",
      "realized": "1.166666666666666666665",
      "total": "2.49999999999999999999",
      "unrealized": "1.33333333333333333333",
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

    var buckets = [{
      timestamp: 10000,
      lastPrice: null,
    }, {
      timestamp: 10040,
      lastPrice: "0.3",
    }];
    var pls1 = calculateBucketProfitLoss(augur, trades2, buckets);
    assert.equal(pls1.length, 1);

    var result = {
      "meanOpenPrice": "0.166666666666666666667",
      "position": "10",
      "queued": "0",
      "realized": "1.166666666666666666665",
      "total": "2.49999999999999999999",
      "unrealized": "1.33333333333333333333",
    };

    assert.deepEqual(pls1[0].profitLoss, result);

    done();
  });

  it("calculates pl for one period, with basis which nets out", (done) => {
    // These two trades net out, leaving a 0 basis
    var trades2 = [{
      timestamp: 8000,
      type: "buy",
      amount: "5",
      price: "0.3",
      maker: true,
    }, {
      timestamp: 9000,
      type: "sell",
      amount: "5",
      price: "0.3",
      maker: true,
    }].concat(trades1);

    var buckets = [{
      timestamp: 10000,
      lastPrice: "0.3",
    }, {
      timestamp: 10040,
      lastPrice: "0.3",
    }];

    var pls1 = calculateBucketProfitLoss(augur, trades2, buckets);
    assert.equal(pls1.length, 1);

    var result = {
      "meanOpenPrice": "0.166666666666666666667",
      "position": "10",
      "queued": "0",
      "realized": "1.16666666666666666666",
      "total": "2.49999999999999999999",
      "unrealized": "1.33333333333333333333",
    };

    assert.deepEqual(pls1[0].profitLoss, result);

    done();
  });

  it("calculates pl for one period, with basis doesnt net out", (done) => {
    // These two trades net out, leaving a 0 basis
    var trades2 = [{
      timestamp: 8000,
      type: "buy",
      amount: "5",
      price: "0.4",
      maker: true,
    }, {
      timestamp: 9000,
      type: "sell",
      amount: "3",
      price: "0.1",
      maker: true,
    }].concat(trades1);

    var buckets = [{
      timestamp: 10000,
      lastPrice: "0.1",
    }, {
      timestamp: 10040,
      lastPrice: "0.3",
    }];

    var pls1 = calculateBucketProfitLoss(augur, trades2, buckets);
    assert.equal(pls1.length, 1);

    var result = {
      "meanOpenPrice": "0.176923076923076923077",
      "position": "8",
      "queued": "1.5",
      "realized": "1.11538461538461538461",
      "total": "2.09999999999999999999",
      "unrealized": "0.98461538461538461538",
    };

    assert.deepEqual(pls1[0].profitLoss, result);

    done();
  });

});
