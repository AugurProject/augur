/**
 * augur.js tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var assert = require("chai").assert;
var tools = require("../../tools");
var augurpath = "../../../src/index";
var augur = require(augurpath);
require('it-each')({testPerIteration: true});

describe("CreateMarket.createMarket", function () {

  beforeEach(function () {
    augur = tools.setup(tools.reset(augurpath), process.argv.slice(2));
  });

  describe("categorical", function () {
    var test = function (t) {
      it(t.numOutcomes + " outcomes on [" + t.minValue + ", " + t.maxValue + "]", function (done) {
        this.timeout(tools.TIMEOUT*2);
        augur.createEvent({
          branchId: t.branch,
          description: t.description,
          expDate: t.expDate,
          minValue: t.minValue,
          maxValue: t.maxValue,
          numOutcomes: t.numOutcomes,
          resolution: t.resolution,
          onSent: function (r) {
            assert(r.txHash);
            assert(r.callReturn);
          },
          onSuccess: function (r) {
            var eventID = r.callReturn;
            assert.strictEqual(augur.getCreator(eventID), augur.from);
            assert.strictEqual(augur.getDescription(eventID), t.description);
            augur.createMarket({
              branchId: t.branch,
              description: t.description,
              takerFee: t.takerFee,
              tags: t.tags,
              makerFee: t.makerFee,
              extraInfo: t.extraInfo,
              events: eventID,
              onSent: function (res) {
                assert(res.txHash);
                assert.isNull(res.callReturn);
              },
              onSuccess: function (res) {
                var marketID = res.callReturn;
                assert.strictEqual(augur.getCreator(marketID), augur.from);
                assert.strictEqual(augur.getDescription(marketID), t.description);
                assert.strictEqual(augur.getMarketEvent(marketID, 0), eventID);
                augur.getMarketInfo(marketID, function (info) {
                  if (info.error) return done(info);
                  assert.isArray(info.events);
                  assert.strictEqual(info.events.length, 1);
                  assert.strictEqual(info.events[0].type, "categorical");
                  assert.strictEqual(info.type, "categorical");
                  done();
                });
              },
              onFailed: function (err) {
                done(new Error(tools.pp(err)));
              }
            }); // CreateMarket.createMarket
          },
          onFailed: function (err) {
            done(new Error(tools.pp(err)));
          }
        }); // CreateMarket.createEvent
      });
    };
    test({
      branch: augur.constants.DEFAULT_BRANCH_ID,
      description: "Will the average temperature on Earth in 2016 be Higher, Lower, or Unchanged from the average temperature on Earth in 2015?~|> Higher|Lower|Unchanged",
      expDate: new Date("1-9-2017").getTime()/1000 + new Date().getTime()/1000*Math.random(),
      minValue: 1,
      maxValue: 3,
      numOutcomes: 3,
      takerFee: "0.02",
      makerFee: "0.01",
      resolution: "http://www.weather.com",
      tags: ["weather", "temperature", "climate change"],
      extraInfo: "Hello world!  Are you getting hotter?"
    });
    test({
      branch: augur.constants.DEFAULT_BRANCH_ID,
      description: "为什么有这么严重吗？~|>€|☃|:D",
      expDate: new Date("1-9-2017").getTime()/1000 + new Date().getTime()/1000*Math.random(),
      minValue: 1,
      maxValue: 3,
      numOutcomes: 3,
      takerFee: "0.02",
      makerFee: "0.01",
      resolution: "http://www.brainyquote.com",
      tags: ["quotes", "严肃", "蝙蝠侠"],
      extraInfo: "Why so serious? 为什么有这么严重吗？"
    });
    test({
      branch: augur.constants.DEFAULT_BRANCH_ID,
      description: "なぜこれほど深刻な？ €☃...~|>D:|€|☃",
      expDate: new Date("1-9-2017").getTime()/1000 + new Date().getTime()/1000*Math.random(),
      minValue: 1,
      maxValue: 3,
      numOutcomes: 3,
      takerFee: "0.02",
      makerFee: "0.01",
      resolution: "http://www.brainyquote.com",
      tags: ["quotes", "€", "☃"],
      extraInfo: "Why so serious? なぜこれほど深刻な？ €☃!"
    });
    test({
      branch: augur.constants.DEFAULT_BRANCH_ID,
      description: "Will Microsoft's stock price at 12:00 UTC on July 1, 2016 be Higher, Lower, or Equal to $54.13?~|>Higher|Lower|Equal",
      expDate: new Date("1-2-2017").getTime()/1000 + new Date().getTime()/1000*Math.random(),
      minValue: 1,
      maxValue: 3,
      numOutcomes: 3,
      takerFee: "0.02",
      makerFee: "0.005",
      resolution: "http://finance.google.com"
    });
    test({
      branch: augur.constants.DEFAULT_BRANCH_ID,
      description: "Who will win the 2016 U.S. Presidential Election?~|>Hillary Clinton|Donald Trump|Bernie Sanders|someone else",
      expDate: new Date("1-11-2017").getTime()/1000 + new Date().getTime()/1000*Math.random(),
      minValue: 1,
      maxValue: 4,
      numOutcomes: 4,
      takerFee: "0.02",
      makerFee: "0.005",
      extraInfo: "The United States presidential election of 2016, scheduled for Tuesday, November 8, 2016, will be the 58th quadrennial U.S. presidential election.",
      tags: ["politics", "US elections", "president"]
    });
    test({
      branch: augur.constants.DEFAULT_BRANCH_ID,
      description: "Which political party's candidate will win the 2016 U.S. Presidential Election?~|>Democratic|Republican|Libertarian|other",
      expDate: new Date("1-4-2017").getTime()/1000 + new Date().getTime()/1000*Math.random(),
      minValue: 1,
      maxValue: 4,
      numOutcomes: 4,
      takerFee: "0.02",
      makerFee: "0.005"
    });
    test({
      branch: augur.constants.DEFAULT_BRANCH_ID,
      description: "Which city will have the highest median single-family home price for September 2016?~|>London|New York|Los Angeles|San Francisco|Tokyo|Palo Alto|Hong Kong|Paris|other",
      expDate: new Date("10-2-2016").getTime()/1000 + new Date().getTime()/1000*Math.random(),
      minValue: 1,
      maxValue: 8,
      numOutcomes: 8,
      takerFee: "0.03",
      makerFee: "0.005"
    });
  });

  describe("scalar", function () {
    var test = function (t) {
      it("[" + t.minValue + ", " + t.maxValue + "]", function (done) {
        this.timeout(tools.TIMEOUT*2);
        augur.createEvent({
          branchId: t.branch,
          description: t.description,
          expDate: t.expDate,
          minValue: t.minValue,
          maxValue: t.maxValue,
          numOutcomes: t.numOutcomes,
          resolution: t.resolution,
          onSent: function (r) {
            assert(r.txHash);
            assert(r.callReturn);
          },
          onSuccess: function (r) {
            var eventID = r.callReturn;
            assert.strictEqual(augur.getCreator(eventID), augur.coinbase);
            assert.strictEqual(augur.getDescription(eventID), t.description);
            augur.createMarket({
              branchId: t.branch,
              description: t.description,
              takerFee: t.takerFee,
              events: eventID,
              makerFee: t.makerFee,
              tags: t.tags,
              extraInfo: t.extraInfo || "",
              onSent: function (res) {
                assert(res.txHash);
                assert.isNull(res.callReturn);
              },
              onSuccess: function (res) {
                var marketID = res.callReturn;
                augur.getMarketInfo(marketID);
                assert.strictEqual(augur.getCreator(marketID), augur.coinbase);
                assert.strictEqual(augur.getDescription(marketID), t.description);
                assert.strictEqual(augur.getMarketEvent(marketID, 0), eventID);
                augur.getMarketInfo(marketID, null, function (info) {
                  if (info.error) return done(info);
                  assert.isArray(info.events);
                  assert.strictEqual(info.events.length, 1);
                  assert.strictEqual(info.events[0].type, "scalar");
                  assert.strictEqual(info.type, "scalar");
                  done();
                });
              },
              onFailed: function (err) {
                done(new Error(tools.pp(err)));
              }
            }); // CreateMarket.createMarket

          },
          onFailed: function (err) {
            done(new Error(tools.pp(err)));
          }
        }); // CreateMarket.createEvent
      });
    };

        // scalar markets have numOutcomes==2 and maxValue!=2
    test({
      branch: augur.constants.DEFAULT_BRANCH_ID,
      description: "What will the high temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2017?",
      expDate: new Date("7-2-2017").getTime()/1000 + new Date().getTime()/1000*Math.random(),
      minValue: 0,
      maxValue: 120,
      numOutcomes: 2,
      takerFee: "0.02",
      makerFee: "0.01",
      resolution: "weather.com",
      tags: ["temperature"]
    });
    test({
      branch: augur.constants.DEFAULT_BRANCH_ID,
      description: "How much will it cost (in USD) to move a pound of inert cargo from Earth's surface to Low Earth Orbit by January 1, 2021?",
      expDate: new Date("1-2-2021").getTime()/1000 + new Date().getTime()/1000*Math.random(),
      minValue: 1,
      maxValue: 15000,
      numOutcomes: 2,
      takerFee: "0.02",
      makerFee: "0.01",
      resolution: "NASA",
      tags: ["spaceflight", "LEO", "economics"]
    });
  });

  describe("binary", function () {
    var events = [[
      "Will SpaceX successfully complete a manned flight to the International Space Station by the end of 2017?",
      new Date("1-1-2018").getTime()/1000 + new Date().getTime()/1000*Math.random(),
      "NASA",
      {
        extraInfo: "NASA took a significant step Friday toward expanding research opportunities aboard the International Space Station with its first mission order from Hawthorne, California based-company SpaceX to launch astronauts from U.S. soil.\n\nThis is the second in a series of four guaranteed orders NASA will make under the Commercial Crew Transportation Capability (CCtCap) contracts. The Boeing Company of Houston received its first crew mission order in May.\n\n\"It's really exciting to see SpaceX and Boeing with hardware in flow for their first crew rotation missions,\" said Kathy Lueders, manager of NASA's Commercial Crew Program. \"It is important to have at least two healthy and robust capabilities from U.S. companies to deliver crew and critical scientific experiments from American soil to the space station throughout its lifespan.\"\n\nDetermination of which company will fly its mission to the station first will be made at a later time. The contracts call for orders to take place prior to certification to support the lead time necessary for missions in late 2017, provided the contractors meet readiness conditions.\n\nFull story: http://www.nasa.gov/press-release/nasa-orders-spacex-crew-mission-to-international-space-station",
        tags: ["space", "SpaceX", "astronaut"]
      }
    ], [
      "Will SpaceX successfully complete a manned flight to the International Space Station by the end of 2018?",
      new Date("1-1-2019").getTime()/1000 + new Date().getTime()/1000*Math.random(),
      "http://www.spacex.com",
      {
        extraInfo: "SpaceX hit a big milestone on Friday with NASA confirming on Friday that the Elon Musk-led space cargo business will launch astronauts to the International Space Station by 2017.\n\nLast year, the space agency tentatively awarded a $2.6 billion contract to SpaceX to carry crew to space. NASA’s announcement on Friday formalizes the deal, which involves SpaceX loading its Crew Dragon spacecraft with astronauts and sending them beyond the stratosphere.",
        tags: ["space", "Dragon", "ISS"]
      }
    ], [
      "Will the Larsen B ice shelf collapse by November 1, 2017?",
      new Date("11-2-2017").getTime()/1000 + new Date().getTime()/1000*Math.random(),
      "http://lmgtfy.com"
    ], [
      "Will Hillary Clinton win the 2016 U.S. Presidential Election?",
      new Date("1-2-2017").getTime()/1000 + new Date().getTime()/1000*Math.random(),
      ""
    ], [
      "Will Bernie Sanders win the 2016 Democratic nomination for U.S. President?",
      new Date("7-29-2016").getTime()/1000 + new Date().getTime()/1000*Math.random(),
      "http://lmgtfy.com"
    ]];
    it.each(events, "%s", ["element"], function (element, next) {
      this.timeout(tools.TIMEOUT*2);

            // create an event
      var branch = augur.constants.DEFAULT_BRANCH_ID;
      var description = element[0];
      var expDate = element[1];
      var minValue = 1;
      var maxValue = 2;
      var numOutcomes = 2;
      var resolution = element[2];
      var extraInfo = "";
      var tags = [];
      if (element.length > 3) {
        extraInfo = element[3].extraInfo;
        tags = element[3].tags;
      }
      augur.createEvent({
        branchId: branch,
        description: description,
        expDate: expDate,
        minValue: minValue,
        maxValue: maxValue,
        numOutcomes: numOutcomes,
        resolution: resolution,
        onSent: function (r) {
          assert(r.txHash);
          assert(r.callReturn);
        },
        onSuccess: function (r) {
          var eventID = r.callReturn;
          var creator = augur.getCreator(eventID);
          if (creator !== augur.coinbase) {
            console.log("\n  createEvent:", tools.pp(r));
          }
          assert.strictEqual(creator, augur.coinbase);
          assert.strictEqual(augur.getDescription(eventID), description);

                    // incorporate the new event into a market
          var takerFee = "0.02";
          augur.createMarket({
            branchId: branch,
            description: description,
            takerFee: takerFee,
            events: eventID,
            makerFee: "0.0075",
            tags: tags,
            extraInfo: extraInfo,
            onSent: function (res) {
              assert(res.txHash);
              assert.isNull(res.callReturn);
            },
            onSuccess: function (res) {
              var marketID = res.callReturn;
              var creator = augur.getCreator(marketID);
              if (creator !== augur.coinbase) {
                console.log("\n  createMarket:", tools.pp(res));
                console.log("  getMarketInfo:", tools.pp(augur.getMarketInfo(marketID)));
                console.log("  description:", tools.pp(augur.getDescription(marketID)));
              }
              assert.strictEqual(creator, augur.coinbase);
              assert.strictEqual(augur.getDescription(marketID), description);
              assert.strictEqual(augur.getMarketEvent(marketID, 0), eventID);
              augur.getMarketInfo(marketID, null, function (info) {
                if (info.error) return next(info);
                assert.isArray(info.events);
                assert.strictEqual(info.events.length, 1);
                assert.strictEqual(info.events[0].type, "binary");
                assert.strictEqual(info.type, "binary");
                next();
              });
            },
            onFailed: next
          }); // CreateMarket.createMarket

        },
        onFailed: next
      }); // CreateMarket.createEvent
    });
  });
});
