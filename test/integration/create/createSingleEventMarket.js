/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var augurpath = "../../../src/index";
var augur = require(augurpath);
var utils = require("../../../src/utilities");
var tools = require("../../tools");
var DEBUG = false;
augur.rpc.debug.tx = DEBUG;

describe("CreateMarket.createSingleEventMarket", function () {

  before(function (done) {
    this.timeout(tools.TIMEOUT);
    augur = tools.setup(tools.reset(augurpath), process.argv.slice(2));
    done();
  });

  var test = function (t) {
    it(t.numOutcomes + " outcomes on [" + t.minValue + ", " + t.maxValue + "]", function (done) {
      this.timeout(tools.TIMEOUT);
      augur.createSingleEventMarket({
        branchId: t.branch,
        description: t.description,
        expDate: t.expDate,
        minValue: t.minValue,
        maxValue: t.maxValue,
        numOutcomes: t.numOutcomes,
        takerFee: t.takerFee,
        makerFee: t.makerFee,
        tags: t.tags,
        extraInfo: t.extraInfo,
        resolution: t.resolution,
        onSent: function (r) {
          if (DEBUG) console.log("sent:", r);
          assert(r.txHash);
          assert.isNull(r.callReturn);
        },
        onSuccess: function (r) {
          if (DEBUG) console.log("success:", r);
          var marketID = r.callReturn;
          if (DEBUG) console.log("marketID:", marketID);
          var periodLength = augur.getPeriodLength(t.branch);
          var block = augur.rpc.getBlock(r.blockNumber);
          var futurePeriod = abi.prefix_hex(new BigNumber(t.expDate, 10).dividedBy(new BigNumber(periodLength)).floor().toString(16));
          var tradingFee = abi.bignum(t.takerFee).plus(abi.bignum(t.makerFee)).dividedBy(new BigNumber("1.5"));
          var formattedTags = augur.formatTags(t.tags);
          assert.strictEqual(utils.sha3([
            futurePeriod,
            abi.fix(tradingFee, "hex"),
            t.expDate,
            new Buffer(t.description, "utf8").length,
            t.description
          ]), r.callReturn);
          assert.strictEqual(augur.getCreator(marketID), augur.coinbase);
          assert.strictEqual(augur.getDescription(marketID), t.description);
          assert.strictEqual(augur.getExtraInfo(marketID), t.extraInfo);

                    // get market's event and check its properties are correct
          var eventID = augur.getMarketEvent(marketID, 0);
          if (DEBUG) console.log("eventID:", eventID);
          assert.strictEqual(augur.getDescription(eventID), t.description);
          assert.strictEqual(augur.getResolution(eventID), t.resolution);
          var info = augur.getMarketInfo(marketID);
          assert.notProperty(info, "error");
          assert.isArray(info.events);
          assert.strictEqual(info.events.length, 1);
          done();
        },
        onFailed: function (err) {
          done(new Error(tools.pp(err)));
        }
      });
    });
  };
  test({
    branch: augur.constants.DEFAULT_BRANCH_ID,
    description: "Will Gary Johnson be included in at least one nationally televised Presidential debate in 2016, in which Hillary Clinton and Donald Trump also participate?",
    expDate: parseInt(new Date("11/8/2016").getTime()/1000 + new Date().getTime()/1000*Math.random()),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    extraInfo: "Candidates must be polling at 15% or higher to be included in the Presidential debates.",
    tags: ["politics", "US elections", "presidential debates"],
    resolution: ""
  });
  test({
    branch: augur.constants.DEFAULT_BRANCH_ID,
    description: "Will SpaceX successfully complete a manned flight to the International Space Station by the end of 2018?",
    expDate: parseInt(new Date("1/1/2019").getTime()/1000 + new Date().getTime()/1000*Math.random()),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    extraInfo: "SpaceX hit a big milestone on Friday with NASA confirming on Friday that the Elon Musk-led space cargo business will launch astronauts to the International Space Station by 2017.\n\nLast year, the space agency tentatively awarded a $2.6 billion contract to SpaceX to carry crew to space. NASA’s announcement on Friday formalizes the deal, which involves SpaceX loading its Crew Dragon spacecraft with astronauts and sending them beyond the stratosphere.",
    tags: ["space", "Dragon", "ISS"],
    resolution: "http://www.spacex.com"
  });
  test({
    branch: augur.constants.DEFAULT_BRANCH_ID,
    description: "Which political party's candidate will win the 2016 U.S. Presidential Election?~|>Democratic|Republican|Libertarian|other",
    expDate: parseInt(new Date("1/2/2017").getTime()/1000 + new Date().getTime()/1000*Math.random()),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 4,
    takerFee: "0.02",
    makerFee: "0.001",
    extraInfo: "The United States presidential election of 2016, scheduled for Tuesday, November 8, 2016, will be the 58th quadrennial U.S. presidential election.",
    tags: ["politics", "US elections", "political parties"],
    resolution: "http://lmgtfy.com"
  });
});
