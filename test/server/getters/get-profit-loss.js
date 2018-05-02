const Augur = require("augur.js");
const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getProfitLoss} = require("../../../build/server/getters/get-profit-loss");

const START_TIME = 1506473474;
const WEEK_SECONDS = 604800;
const HOUR_SECONDS = 60*60;
const DAY_SECONDS = 86400;

describe("server/getters/get-profit-loss", () => {
  const test = (t) => {
    const augur = new Augur();
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        getProfitLoss(db, augur, t.params.universe, t.params.account, t.params.startTime, t.params.endTime, t.params.periodInterval, (err, profitLoss) => {
          t.assertions(err, profitLoss);
          done();
        });
      });
    });
  };
  test({
    description: "user has trades",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      account: "0x0000000000000000000000000000000000000b0b",
      startTime: START_TIME,
      endTime: START_TIME + DAY_SECONDS,
      periodInterval: HOUR_SECONDS
    },
    assertions: (err, profitLoss) => {
      assert.isNull(err);
      assert.deepEqual(profitLoss, []);
    }
  });

});
