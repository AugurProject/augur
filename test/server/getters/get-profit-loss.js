const Augur = require("augur.js");
const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getProfitLoss} = require("../../../build/server/getters/get-profit-loss");

const START_TIME = 1506474500;
const MINUTE_SECONDS = 60;
const HOUR_SECONDS = MINUTE_SECONDS*60;
const DAY_SECONDS = HOUR_SECONDS*24;
const WEEK_SECONDS = DAY_SECONDS*7;

describe("server/getters/get-profit-loss", () => {
  var connection = null;

  const test = (t, done) => {
    const augur = new Augur();
    getProfitLoss(connection, augur, t.params.universe, t.params.account, t.params.startTime, t.params.endTime, t.params.periodInterval, (err, profitLoss) => {
      t.assertions(err, profitLoss);
      done();
    });
  };

  beforeEach((done) => {
    setupTestDb((err, db) => {
      if (err) return done(new Error(err));
      connection = db;
      done();
    })
  });

  it("generates 3 datapoints for user with trades in one period after start time", (done) => {
    test({
      params: {
        universe: "0x000000000000000000000000000000000000000b",
        account: "0x0000000000000000000000000000000000000b0b",
        startTime: START_TIME,
        endTime: START_TIME + 3*HOUR_SECONDS,
        periodInterval: HOUR_SECONDS
      },
      assertions: (err, profitLoss) => {
        assert.isNull(err);
        assert.deepEqual(profitLoss, [
          {
            "profitLoss": {
              "meanOpenPrice": "5.423529411764705882352726729479670656141252219970008205302322994349998585292702939668266983561101208158771264465382112440932708598590951532128",
              "position": "-1.7",
              "queued": "0",
              "realized": "0",
              "unrealized": "-0.1300000000000000000003645598845598845598712260509860509860509096050024050024050025639461279461279461300888504088504088504143953823953823953824",
            },
            "timestamp": START_TIME + 1*HOUR_SECONDS
          },
          {
            "profitLoss": {
              "meanOpenPrice": "5.423529411764705882352726729479670656141252219970008205302322994349998585292702939668266983561101208158771264465382112440932708598590951532128",
              "position": "-1.7",
              "queued": "0",
              "realized": "0",
              "unrealized": "-0.1300000000000000000003645598845598845598712260509860509860509096050024050024050025639461279461279461300888504088504088504143953823953823953824",
            },
            "timestamp": START_TIME + 2*HOUR_SECONDS
          },
          {
            "profitLoss": {
              "meanOpenPrice": "5.423529411764705882352726729479670656141252219970008205302322994349998585292702939668266983561101208158771264465382112440932708598590951532128",
              "position": "-1.7",
              "queued": "0",
              "realized": "0",
              "unrealized": "-0.1300000000000000000003645598845598845598712260509860509860509096050024050024050025639461279461279461300888504088504088504143953823953823953824",
            },
            "timestamp": START_TIME + 3*HOUR_SECONDS
          }
        ]);
      }
    }, done);
  });

  it("generates 3 PL datapoints for user with trades in three period after start time", (done) => {
    test({
      params: {
        universe: "0x000000000000000000000000000000000000000b",
        account: "0x0000000000000000000000000000000000000b0b",
        startTime: START_TIME,
        endTime: START_TIME + MINUTE_SECONDS,
        periodInterval: 10
      },
      assertions: (err, profitLoss) => {
        assert.isNull(err);
        assert.deepEqual(profitLoss, [
          {
            "profitLoss": {
              "meanOpenPrice": "5.423529411764705882352726729479670656141252219970008205302322994349998585292702939668266983561101208158771264465382112440932708598590951532128",
              "position": "-1.7",
              "queued": "0",
              "realized": "0",
              "unrealized": "-0.1300000000000000000003645598845598845598712260509860509860509096050024050024050025639461279461279461300888504088504088504143953823953823953824",
            },
            "timestamp": 1506477074
          },
          {
            "profitLoss": {
              "meanOpenPrice": "5.423529411764705882352726729479670656141252219970008205302322994349998585292702939668266983561101208158771264465382112440932708598590951532128",
              "position": "-1.7",
              "queued": "0",
              "realized": "0",
              "unrealized": "-0.1300000000000000000003645598845598845598712260509860509860509096050024050024050025639461279461279461300888504088504088504143953823953823953824",
            },
            "timestamp": 1506480674
          },
          {
            "profitLoss": {
              "meanOpenPrice": "5.423529411764705882352726729479670656141252219970008205302322994349998585292702939668266983561101208158771264465382112440932708598590951532128",
              "position": "-1.7",
              "queued": "0",
              "realized": "0",
              "unrealized": "-0.1300000000000000000003645598845598845598712260509860509860509096050024050024050025639461279461279461300888504088504088504143953823953823953824",
            },
            "timestamp": 1506484274
          }
        ]);
      }
    }, done);
  });

});
