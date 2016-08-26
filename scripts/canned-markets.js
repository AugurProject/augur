#!/usr/bin/env node
/**
 * Create a handful of canned, non-madlibs markets for us to test with.
 */

"use strict";

var async = require("async");
var chalk = require("chalk");
var augur = require("../src");
var DEBUG = false;

var closingBell = new Date();
closingBell.setHours(20, 0, 0, 0);

var midnightTomorrow = new Date();
midnightTomorrow.setDate(midnightTomorrow.getDate() + 1);
midnightTomorrow.setHours(0, 0, 0, 0);

var today = new Date();

var cannedMarkets = [{
    description: "What will the maximum temperature be on " + today.toLocaleDateString() + " at the San Francisco International Airport, as reported by Weather Underground?",
    expDate: parseInt(midnightTomorrow.getTime() / 1000, 10),
    minValue: -10,
    maxValue: 120,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["weather", "temperature", "SFO"],
    extraInfo: "https://www.penny-arcade.com/comic/2001/12/12",
    resolution: "https://www.wunderground.com/history/airport/KSFO/" + [today.getUTCFullYear(), today.getUTCMonth() + 1, today.getUTCDate()].join('/') + "/DailyHistory.html"
}, {
    description: "Which candidate will be leading in the polls in the 2016 U.S. Presidential election at midnight PST " + midnightTomorrow.toDateString() + ", according to the RealClearPolitics 4-way polling average?~|>Clinton|Trump|Johnson|Stein",
    expDate: parseInt(midnightTomorrow.getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 4,
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["politics", "US elections", "polling"],
    extraInfo: "The United States presidential election of 2016, scheduled for Tuesday, November 8, 2016, will be the 58th quadrennial U.S. presidential election.",
    resolution: "http://www.realclearpolitics.com/epolls/2016/president/us/general_election_trump_vs_clinton_vs_johnson_vs_stein-5952.html"
}, {
    description: "Will the Dow Jones Industrial Average close at a higher price on " + today.toLocaleDateString() + " than it closed at the previous day?",
    expDate: parseInt(closingBell.getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["Dow Jones", "stock market", "DJIA"],
    extraInfo: "The Daily Dow market lives again! https://en.wikipedia.org/wiki/Dow_Jones_Industrial_Average",
    resolution: "https://www.google.com/finance?q=INDEXDJX:.DJI"
}, {
    description: "NFL Preseason Week 3: Falcons @ Dolphins - Who wins?~|>Atlanta Falcons|Miami Dolphins|tie",
    expDate: parseInt(new Date("8/29/2016").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 3,
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["NFL", "sports", "American football"],
    extraInfo: "",
    resolution: "http://www.nfl.com/scores"
}, {
    description: "Who will win the 2016 U.S. Presidential election?~|>Hillary Clinton|Donald Trump|Gary Johnson|Jill Stein|someone else",
    expDate: parseInt(new Date("1/2/2017").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 5,
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["politics", "US elections", "president"],
    extraInfo: "The United States presidential election of 2016, scheduled for Tuesday, November 8, 2016, will be the 58th quadrennial U.S. presidential election.",
    resolution: ""
}, {
    description: "Will Ethereum trade at $15 or higher by midnight EST on November 30, 2016?",
    expDate: parseInt(new Date("12/1/2016").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    extraInfo: "http://coinmarketcap.com/currencies/ethereum",
    tags: ["ethereum", "trading", "currencies"],
    resolution: "http://coinmarketcap.com"
}, {
    description: "Will SpaceX successfully complete a manned flight to the International Space Station by the end of 2018?",
    expDate: parseInt(new Date("1/1/2019").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    extraInfo: "SpaceX hit a big milestone on Friday with NASA confirming on Friday that the Elon Musk-led space cargo business will launch astronauts to the International Space Station by 2017.\n\nLast year, the space agency tentatively awarded a $2.6 billion contract to SpaceX to carry crew to space. NASA’s announcement on Friday formalizes the deal, which involves SpaceX loading its Crew Dragon spacecraft with astronauts and sending them beyond the stratosphere.",
    tags: ["space", "Dragon", "ISS"],
    resolution: "http://www.spacex.com"
}, {
    description: "Will Gary Johnson be included in at least one nationally televised Presidential debate in 2016, in which Hillary Clinton and Donald Trump also participate?",
    expDate: parseInt(new Date("11/8/2016").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    extraInfo: "Candidates must be polling at 15% or higher to be included in the Presidential debates.",
    tags: ["politics", "US elections", "presidential debates"],
    resolution: ""
}, {
    description: "Which city will have the highest median single-family home price for September 2016?~|>London|New York|Los Angeles|San Francisco|Tokyo|Palo Alto|Hong Kong|other",
    expDate: parseInt(new Date("10-2-2016").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 8,
    takerFee: "0.03",
    makerFee: "0.005",
    tags: ["housing", "economy", "bubble"]
}, {
    description: "What will the high temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2017?",
    expDate: parseInt(new Date("7-2-2017").getTime() / 1000, 10),
    minValue: -10,
    maxValue: 120,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    resolution: "http://forecast.weather.gov",
    tags: ["temperature", "San Francisco", "weather"]
}, {
    description: "Will the Larsen B ice shelf collapse by November 1, 2017?",
    expDate: parseInt(new Date("11-2-2017").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    resolution: "",
    tags: ["climate change", "Antartica", "warming"]
}, {
    description: "How many marine species will go extinct between January 1, 2016 and January 1, 2018?",
    expDate: parseInt(new Date("1-2-2018").getTime() / 1000, 10),
    minValue: 0,
    maxValue: 1000000,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    resolution: "science!",
    tags: ["climate", "extinction", "marine biology"]
}, {
    description: "What will the average tropospheric methane concentration (in parts-per-billion) be between January 1, 2017 and January 1, 2018?",
    expDate: parseInt(new Date("1-2-2018").getTime() / 1000, 10),
    minValue: 700,
    maxValue: 5000,
    numOutcomes: 2,
    extraInfo: "Vast quantities of methane are normally locked into the Earth's crust on the continental plateaus in one of the many deposits consisting of compounds of methane hydrate, a solid precipitated combination of methane and water much like ice. Because the methane hydrates are unstable, except at cool temperatures and high (deep) pressures, scientists have observed smaller \"burps\" due to tectonic events. Studies suggest the huge release of natural gas could be a major climatological trigger, methane itself being a greenhouse gas many times more powerful than carbon dioxide. References: https://en.wikipedia.org/wiki/Anoxic_event, https://en.wikipedia.org/wiki/Atmospheric_methane, https://en.wikipedia.org/wiki/Clathrate_gun_hypothesis",
    tags: ["climate", "methane", "atmosphere"],
    takerFee: "0.02",
    makerFee: "0.01",
    resolution: "EPA"
}, {
    description: "How many new antibiotics will be approved by the FDA between March 1, 2016 and the end of 2020?",
    expDate: parseInt(new Date("1-1-2021").getTime() / 1000, 10),
    minValue: 0,
    maxValue: 30,
    numOutcomes: 2,
    resolution: "FDA",
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["antibiotics", "medicine", "science"],
    extraInfo: "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?"
}, {
    description: "Will antibiotics be outlawed for agricultural use in China by the end of 2020?",
    expDate: parseInt(new Date("1-1-2021").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["antibiotics", "China", "science policy"],
    extraInfo: "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?"
}, {
    description: "What will be the number one killer in the United States by January 1, 2025?~|>cancer|heart attacks|infectious diseases|starvation|lava|other",
    expDate: parseInt(new Date("1-2-2025").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 6,
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["mortality", "United States", "science"],
    extraInfo: "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?"
}];

augur.connect({
    http: "http://127.0.0.1:8545",
    ipc: process.env.GETH_IPC,
    ws: "ws://127.0.0.1:8546"
}, function (connected) {
    if (!connected) return console.error("connect failed:", connected);
    augur.setCash(augur.from, "100000000000", augur.utils.noop, function (r) {
        console.debug("setCash success:", r.callReturn);
        async.eachSeries(cannedMarkets, function (market, nextMarket) {
            market.branchId = augur.constants.DEFAULT_BRANCH_ID;
            market.onSent = function (r) {
                if (DEBUG) console.debug("createSingleEventMarket sent:", r);
            };
            market.onSuccess = function (r) {
                if (DEBUG) console.debug("createSingleEventMarket success:", r.callReturn);
                console.log(chalk.green(r.callReturn), chalk.cyan.dim(market.description));
                var initialFairPrices = new Array(market.numOutcomes);
                if (market.numOutcomes === 2 && (market.minValue !== 1 || market.maxValue !== 2)) {
                    var midpoint = ((market.maxValue - market.minValue) / 2).toString();
                    initialFairPrices[0] = midpoint;
                    initialFairPrices[1] = midpoint;
                } else {
                    for (var i = 0; i < market.numOutcomes; ++i) {
                        initialFairPrices[i] = "0.5";
                    }
                }
                var orderBookParams = {
                    market: r.callReturn,
                    liquidity: 100,
                    initialFairPrices: initialFairPrices,
                    startingQuantity: 5,
                    bestStartingQuantity: 10,
                    priceWidth: "0.2"
                };
                console.log(chalk.blue.bold("Generating order book:"), chalk.cyan.dim(JSON.stringify(orderBookParams, null, 2)));
                augur.generateOrderBook(orderBookParams, {
                    onBuyCompleteSets: function (res) {
                        if (DEBUG) console.log("onBuyCompleteSets", res);
                    },
                    onSetupOutcome: function (res) {
                        if (DEBUG) console.log("onSetupOutcome", res);
                        console.log(chalk.white.dim(" - Outcome"), chalk.cyan(res.outcome));
                    },
                    onSetupOrder: function (res) {
                        if (DEBUG) console.log("onSetupOrder", res);
                    },
                    onSuccess: function (res) {
                        console.log(chalk.blue.bold("Order book generated:"));
                        console.log("  " + chalk.cyan(Object.keys(res.sell).length.toString() + " asks"));
                        console.log("  " + chalk.green(Object.keys(res.buy).length.toString() + " bids"));
                        nextMarket();
                    },
                    onFailed: function (err) {
                        console.error(chalk.red.bold("generateOrderBook failed:"), err);
                        nextMarket();
                    }
                });
            };
            market.onFailed = function (e) {
                console.error(chalk.red.bold("createSingleEventMarket failed:"), e);
                nextMarket();
            };
            augur.createSingleEventMarket(market);
        }, process.exit);
    }, process.exit);
});
