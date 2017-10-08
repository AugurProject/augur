#!/usr/bin/env node
/**
 * Create a handful of canned markets for us to test with.
 */

"use strict";

var async = require("async");
var chalk = require("chalk");
var Augur = require("../src");
var noop = require("../src/utils/noop");
var augur = new Augur();
var DEBUG = false;

var DEFAULT_PERIOD_LENGTH = 172800;

var closingBell = new Date();
closingBell.setHours(20, 0, 0, 0);

var midnightTomorrow = new Date();
midnightTomorrow.setDate(midnightTomorrow.getDate() + 1);
midnightTomorrow.setHours(0, 0, 0, 0);

var today = new Date();

var secondsUntilNextPeriod = DEFAULT_PERIOD_LENGTH * (1 - augur.reporting.getCurrentPeriodProgress(DEFAULT_PERIOD_LENGTH)/100) + 1;
var expTimeCycle1 = parseInt(Date.now() / 1000, 10) + secondsUntilNextPeriod;

var cannedMarkets = [{
  marketType: "categorical",
  _expTime: parseInt(new Date("1/2/2020").getTime() / 1000, 10),
  _minDisplayPrice: "1",
  _maxDisplayPrice: "3",
  _numOutcomes: 3,
  _topic: "politics",
  settlementFee: "0.02",
  _longDescription: {
    resolution: "",
    tags: ["elections", "US politics"],
    shortDescription: "What will be the status of the U.S. electoral college on January 1, 2020?",
    outcomeNames: ["Unchanged from 2016", "Undermined but still in existence (e.g., National Popular Vote bill)", "Formally abolished"],
    longDescription: "The National Popular Vote bill would guarantee the Presidency to the candidate who receives the most popular votes nationwide (i.e., all 50 states and the District of Columbia).  It has been enacted into law in 11 states with 165 electoral votes, and will take effect when enacted by states with 105 more electoral votes. The bill has passed one chamber in 12 additional states with 96 electoral votes.   Most recently, the bill was passed by a bipartisan 40–16 vote in the Republican-controlled Arizona House, 28–18 in Republican-controlled Oklahoma Senate, 57–4 in Republican-controlled New York Senate, and 37–21 in Democratic-controlled Oregon House. http://www.nationalpopularvote.com"
  }
}, {
  marketType: "binary",
  _expTime: parseInt(new Date("1/1/2020").getTime() / 1000, 10),
  _minDisplayPrice: "1",
  _maxDisplayPrice: "2",
  _numOutcomes: 2,
  _topic: "politics",
  settlementFee: "0.03",
  _longDescription: {
    resolution: ""
    tags: ["California", "Calexit"],
    shortDescription: "Will California secede from the United States before January 1, 2020?",
    longDescription: "In the Spring of 2019, Californians will go to the polls in a historic vote to decide by referendum if California should exit the Union, a #Calexit vote. http://www.yescalifornia.org"
  }
}, {
  marketType: "scalar",
  _expTime: parseInt(midnightTomorrow.getTime() / 1000, 10),
  _minDisplayPrice: "-10",
  _maxDisplayPrice: "120",
  _numOutcomes: 2,
  _topic: "temperature",
  settlementFee: "0.02",
  _longDescription: {
    resolution: "https://www.wunderground.com/history/airport/KSFO/" + [today.getUTCFullYear(), today.getUTCMonth() + 1, today.getUTCDate()].join("/") + "/DailyHistory.html",
    tags: ["weather", "SFO"],
    shortDescription: "What will the maximum temperature be (in degrees Fahrenheit) on " + today.toLocaleDateString() + " at the San Francisco International Airport, as reported by Weather Underground?",
    longDescription: "https://www.penny-arcade.com/comic/2001/12/12"
  }
}, {
  marketType: "binary",
  _expTime: parseInt(closingBell.getTime() / 1000, 10),
  _minDisplayPrice: "1",
  _maxDisplayPrice: "2",
  _numOutcomes: 2,
  _topic: "finance",
  settlementFee: "0.05",
  _longDescription: {
    resolution: "https://www.google.com/finance?q=INDEXDJX:.DJI",
    tags: ["stocks", "Dow Jones"],
    shortDescription: "Will the Dow Jones Industrial Average close at a higher price on " + today.toLocaleDateString() + " than it closed at the previous day?",
    longDescription: "The Daily Dow market lives again! https://en.wikipedia.org/wiki/Dow_Jones_Industrial_Average"
  }
}, {
  marketType: "binary",
  _expTime: parseInt(new Date("12/1/2017").getTime() / 1000, 10),
  _minDisplayPrice: "1",
  _maxDisplayPrice: "2",
  _numOutcomes: 2,
  _topic: "Augur",
  settlementFee: "0.03",
  _longDescription: {
    resolution: "https://www.augur.net",
    tags: ["release date", "Ethereum"],
    shortDescription: "Will Augur's live release happen by the end of November, 2017?",
    longDescription: "https://www.augur.net"
  }
}, {
  marketType: "binary",
  _expTime: parseInt(new Date("1/1/2018").getTime() / 1000, 10),
  _minDisplayPrice: "1",
  _maxDisplayPrice: "2",
  _numOutcomes: 2,
  _topic: "Augur",
  settlementFee: "0.03",
  _longDescription: {
    resolution: "https://www.augur.net",
    tags: ["release date", "Ethereum"],
    shortDescription: "Will Augur's live release happen by the end of December, 2017?",
    longDescription: "https://www.augur.net"
  }
}, {
  _expTime: parseInt(new Date("10/30/2018").getTime() / 1000, 10),
  _minDisplayPrice: "1",
  _maxDisplayPrice: "3",
  _numOutcomes: 3,
  _topic: "sports",
  settlementFee: "0.02",
  _longDescription: {
    resolution: "",
    tags: ["college football", "football"],
    shortDescription: "Who will win the University of Georgia vs. University of Florida football game in 2018?~|>Georgia|Florida|Vanderbilt",
    longDescription: ""
  }
}, {
  _expTime: parseInt(new Date("2/1/2019").getTime() / 1000, 10),
  _minDisplayPrice: "1",
  _maxDisplayPrice: "2",
  _numOutcomes: 2,
  _topic: "politics",
  settlementFee: "0.02",
  _longDescription: {
    resolution: "",
    tags: ["Trump", "impeachment"],
    shortDescription: "Will Donald Trump be impeached and removed from the Presidency within two years of his inauguration?",
    longDescription: ""
  }
}, {
  _expTime: parseInt(new Date("12/31/2018").getTime() / 1000, 10),
  _minDisplayPrice: "1",
  _maxDisplayPrice: "2",
  _numOutcomes: 2,
  _topic: "politics",
  settlementFee: "0.02",
  _longDescription: {
    resolution: "",
    tags: ["elections", "Brazil"],
    shortDescription: "Will Jair Messias Bolsonaro be elected the president of Brazil in 2018?",
    longDescription: ""
  }
}, {
  _expTime: parseInt(new Date("1/2/2018").getTime() / 1000, 10),
  _minDisplayPrice: "1",
  _maxDisplayPrice: "2",
  _numOutcomes: 2,
  _topic: "trading",
  settlementFee: "0.09",
  _extraInfo: {
    resolution: "http://coinmarketcap.com",
    tags: ["Augur", "Reputation"],
    shortDescription: "Will REP tokens be worth more than 100 USD each any time on or before January 1, 2018 on CoinMarketCap?",
    longDescription: "https://www.reddit.com/r/reptrader"
  }
}, {
  _expTime: parseInt(new Date("12/1/2017").getTime() / 1000, 10),
  _minDisplayPrice: "1",
  _maxDisplayPrice: "2",
  _numOutcomes: 2,
  _topic: "trading",
  settlementFee: "0.02",
  _extraInfo: {
    resolution: "http://coinmarketcap.com",
    tags: ["trading", "Ethereum", "currencies"],
    shortDescription: "Will Ethereum trade at $15 or higher by midnight EST on November 30, 2017?",
    longDescription: "http://coinmarketcap.com/currencies/ethereum"
  }
}, {
  _expTime: parseInt(new Date("1/1/2019").getTime() / 1000, 10),
  _minDisplayPrice: "1",
  _maxDisplayPrice: "2",
  _numOutcomes: 2,
  _topic: "space",
  settlementFee: "0.02",
  _extraInfo: {
    resolution: "http://www.spacex.com",
    tags: ["SpaceX", "spaceflight"]
    shortDescription: "Will SpaceX successfully complete a manned flight to the International Space Station by the end of 2018?",
    longDescription: "SpaceX hit a big milestone on Friday with NASA confirming on Friday that the Elon Musk-led space cargo business will launch astronauts to the International Space Station by 2017.\n\nLast year, the space agency tentatively awarded a $2.6 billion contract to SpaceX to carry crew to space. NASA’s announcement on Friday formalizes the deal, which involves SpaceX loading its Crew Dragon spacecraft with astronauts and sending them beyond the stratosphere."
  }
}, {
  _expTime: parseInt(new Date("10-2-2018").getTime() / 1000, 10),
  _minDisplayPrice: "1",
  _maxDisplayPrice: "8",
  _numOutcomes: 8,
  _topic: "housing",
  settlementFee: "0.03",
  _extraInfo: {
    tags: ["economy", "bubble"],
    outcomeNames: ["London", "New York", "Los Angeles", "San Francisco", "Tokyo", "Palo Alto", "Hong Kong", "other"],
    shortDescription: "Which city will have the highest median single-family home price for September 2018?"
  }
}, {
  _expTime: parseInt(new Date("7-2-2018").getTime() / 1000, 10),
  _minDisplayPrice: "-10",
  _maxDisplayPrice: "120",
  _numOutcomes: 2,
  _topic: "temperature",
  settlementFee: "0.02",
  _extraInfo: {
    resolution: "http://forecast.weather.gov",
    tags: ["San Francisco", "weather"],
    shortDescription: "What will the high temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2018?"
  }
}, {
  _expTime: parseInt(new Date("11-2-2018").getTime() / 1000, 10),
  _minDisplayPrice: "1",
  _maxDisplayPrice: "2",
  _numOutcomes: 2,
  _topic: "climate",
  settlementFee: "0.02",
  _extraInfo: {
    resolution: "",
    tags: ["Antartica", "warming"],
    shortDescription: "Will the Larsen B ice shelf collapse by November 1, 2018?"
  }
}, {
  _expTime: parseInt(new Date("1-2-2018").getTime() / 1000, 10),
  _minDisplayPrice: "0",
  _maxDisplayPrice: "10000",
  _numOutcomes: 2,
  _topic: "science",
  settlementFee: "0.02",
  _extraInfo: {
    resolution: "science!",
    tags: ["extinction", "marine biology"],
    shortDescription: "How many marine species will go extinct between January 1, 2016 and January 1, 2018?"
  }
}, {
  _expTime: parseInt(new Date("1-2-2019").getTime() / 1000, 10),
  _minDisplayPrice: "700",
  _maxDisplayPrice: "5000",
  _numOutcomes: 2,
  _topic: "science",
  settlementFee: "0.02",
  _extraInfo: {
    resolution: "EPA",
    tags: ["climate", "atmosphere"],
    shortDescription: "What will the average tropospheric methane concentration (in parts-per-billion) be between January 1, 2018 and January 1, 2019?",
    longDescription: "Vast quantities of methane are normally locked into the Earth's crust on the continental plateaus in one of the many deposits consisting of compounds of methane hydrate, a solid precipitated combination of methane and water much like ice. Because the methane hydrates are unstable, except at cool temperatures and high (deep) pressures, scientists have observed smaller \"burps\" due to tectonic events. Studies suggest the huge release of natural gas could be a major climatological trigger, methane itself being a greenhouse gas many times more powerful than carbon dioxide. References: https://en.wikipedia.org/wiki/Anoxic_event, https://en.wikipedia.org/wiki/Atmospheric_methane, https://en.wikipedia.org/wiki/Clathrate_gun_hypothesis"
  }
}, {
  _expTime: parseInt(new Date("6-20-2018").getTime() / 1000, 10),
  _minDisplayPrice: "1",
  _maxDisplayPrice: "2",
  _numOutcomes: 2,
  _topic: "sports",
  settlementFee: "0.02",
  _extraInfo: {
    resolution: "ESPN",
    tags: ["basketball", "Warriors"],
    shortDescription: "Will the Golden State Warriors win the 2018 NBA Championship?",
    longDescription: ""
  }
}, {
  _expTime: parseInt(new Date("1-1-2021").getTime() / 1000, 10),
  _minDisplayPrice: "0",
  _maxDisplayPrice: "30",
  _numOutcomes: 2,
  _topic: "medicine",
  settlementFee: "0.02",
  _extraInfo: {
    resolution: "FDA",
    tags: ["science", "antibiotics"],
    shortDescription: "How many new antibiotics will be approved by the FDA between March 1, 2016 and the end of 2020?",
    longDescription: "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?"
  }
}, {
  _expTime: parseInt(new Date("1-1-2021").getTime() / 1000, 10),
  _minDisplayPrice: "1",
  _maxDisplayPrice: "2",
  _numOutcomes: 2,
  _topic: "agriculture",
  settlementFee: "0.02",
  _extraInfo: {
    tags: ["antibiotics", "China"],
    shortDescription: "Will antibiotics be outlawed for agricultural use in China by the end of 2020?",
    longDescription: "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?"
  }
}, {
  _expTime: parseInt(new Date("1-2-2025").getTime() / 1000, 10),
  _minDisplayPrice: "1",
  _maxDisplayPrice: "6",
  _numOutcomes: 6,
  _topic: "science",
  settlementFee: "0.02",
  _extraInfo: {
    resolution: "CDC",
    tags: ["mortality", "United States"],
    outcomeNames: ["cancer", "heart attacks", "infectious diseases", "starvation", "lava", "other"]
    shortDescription: "What will be the number one killer in the United States by January 1, 2025?",
    longDescription: "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?"
  }
}];

augur.connect({
  http: "http://127.0.0.1:8545",
  ipc: process.env.GETH_IPC,
  ws: "ws://127.0.0.1:8546"
}, function (err, connectionInfo) {
  if (err) return console.error("connect failed:", err, connectionInfo);
  async.eachSeries(cannedMarkets, function (market, nextMarket) {
    // if (!market.orderBook && parseInt(augur.rpc.getNetworkID()) === 9000) return nextMarket();
    market.branch = augur.constants.DEFAULT_BRANCH_ID;
    market.onSent = function (r) {
      if (DEBUG) console.log("createSingleEventMarket sent:", r);
    };
    market.onSuccess = function (r) {
      var i;
      if (DEBUG) console.log("createSingleEventMarket success:", r.callReturn);
      console.log(chalk.green(r.callReturn), chalk.cyan.dim(market.description));
      var marketID = r.callReturn;
      var largestOutcomeShares = 0;
      for (var outcomeID in market.orderBook.sell) {
        if (market.orderBook.sell.hasOwnProperty(outcomeID)) {
          var sellOrders = market.orderBook.sell[outcomeID];
          if (sellOrders && sellOrders.length) {
            var outcomeShares = 0;
            for (i = 0; i < sellOrders.length; ++i) {
              outcomeShares += parseInt(sellOrders[i].shares, 10);
            }
            if (outcomeShares > largestOutcomeShares) {
              largestOutcomeShares = outcomeShares;
            }
          }
        }
      }
      augur.api.CompleteSets.buyCompleteSets({
        market: marketID,
        amount: "0x" + largestOutcomeShares.toString(16),
        onSent: function (res) {
          // console.log("buyCompleteSets sent:", res.txHash);
        },
        onSuccess: function (res) {
          // console.log("buyCompleteSets success:", res.callReturn);
          async.forEachOfSeries(market.orderBook, function (orders, orderType, nextOrderType) {
            async.forEachOfSeries(orders, function (outcomeOrders, outcome, nextOutcome) {
              async.each(outcomeOrders, function (order, nextOrder) {
                if (orderType === "buy") {
                  augur.trading.makeOrder.buy({
                    amount: order.shares,
                    price: order.price,
                    market: marketID,
                    outcome: outcome,
                    onSent: function (res) {
                      // console.log("buy sent:", orderType, outcome, order, res.callReturn, res.txHash);
                    },
                    onSuccess: function (res) {
                      // console.log("buy success:", orderType, outcome, order, res.callReturn, res.hash);
                      nextOrder();
                    },
                    onFailed: function (err) {
                      console.error("buy failed:", orderType, outcome, order);
                      nextOrder(err);
                    }
                  });
                } else {
                  augur.trading.makeOrder.sell({
                    amount: order.shares,
                    price: order.price,
                    market: marketID,
                    outcome: outcome,
                    onSent: function (res) {
                      // console.log("sell sent:", orderType, outcome, order, res.callReturn, res.txHash);
                    },
                    onSuccess: function (res) {
                      // console.log("sell success:", orderType, outcome, order, res.callReturn, res.hash);
                      nextOrder();
                    },
                    onFailed: function (err) {
                      console.error("sell failed:", orderType, outcome, order);
                      nextOrder(err);
                    }
                  });
                }
              }, function (err) {
                if (err) console.error("each order:", err);
                nextOutcome();
              });
            }, function (err) {
              if (err) console.error("each outcome:", err);
              nextOrderType();
            });
          }, function (err) {
            if (err) console.error("each order type:", err);
            nextMarket();
          });
        },
        onFailed: function (err) {
          console.error("buyCompleteSets failed:", err);
          nextMarket();
        }
      });
    };
    market.onFailed = function (e) {
      console.error(chalk.red.bold("createSingleEventMarket failed:"), e);
      nextMarket();
    };
    augur.create.createSingleEventMarket(market);
  }, process.exit);
});
