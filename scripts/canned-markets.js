#!/usr/bin/env node
/**
 * Create a handful of canned, non-madlibs markets for us to test with.
 */

"use strict";

var async = require("async");
var chalk = require("chalk");
var augur = require("../src");
var DEBUG = false;

augur.options.debug.trading = DEBUG;

var DEFAULT_PERIOD_LENGTH = 172800;

var closingBell = new Date();
closingBell.setHours(20, 0, 0, 0);

var midnightTomorrow = new Date();
midnightTomorrow.setDate(midnightTomorrow.getDate() + 1);
midnightTomorrow.setHours(0, 0, 0, 0);

var today = new Date();

var currentPeriod = augur.getCurrentPeriod(DEFAULT_PERIOD_LENGTH);
var secondsUntilNextPeriod = DEFAULT_PERIOD_LENGTH * (1 - augur.getCurrentPeriodProgress(DEFAULT_PERIOD_LENGTH)/100) + 1;
var expDateCycle1 = parseInt(Date.now() / 1000, 10) + secondsUntilNextPeriod;

var cannedMarkets = [{
  description: "Binary Reporting Test Market (Cycle 1): correct answer is Yes",
  expDate: expDateCycle1,
  minValue: 1,
  maxValue: 2,
  numOutcomes: 2,
  takerFee: "0.02",
  makerFee: "0.01",
  tags: ["reporting", "testing", "binary"],
  extraInfo: "",
  resolution: ""
}, {
  description: "Categorical Reporting Test Market (Cycle 1): correct answer is E~|>A|B|C|D|E|F|G",
  expDate: expDateCycle1,
  minValue: 1,
  maxValue: 7,
  numOutcomes: 7,
  takerFee: "0.02",
  makerFee: "0.01",
  tags: ["reporting", "testing", "categorical"],
  extraInfo: "",
  resolution: ""
}, {
  description: "Scalar Reporting Test Market (Cycle 1): correct answer is 3.1415",
  expDate: expDateCycle1,
  minValue: -5,
  maxValue: 20,
  numOutcomes: 2,
  takerFee: "0.02",
  makerFee: "0.01",
  tags: ["reporting", "testing", "scalar"],
  extraInfo: "",
  resolution: ""
}, {
  description: "Binary Reporting Test Market (Cycle 2): correct answer is No",
  expDate: expDateCycle1 + DEFAULT_PERIOD_LENGTH,
  minValue: 1,
  maxValue: 2,
  numOutcomes: 2,
  takerFee: "0.02",
  makerFee: "0.01",
  tags: ["reporting", "testing", "binary"],
  extraInfo: "",
  resolution: ""
}, {
  description: "Categorical Reporting Test Market (Cycle 2): correct answer is A~|>A|B|C|D|E|F|G",
  expDate: expDateCycle1 + DEFAULT_PERIOD_LENGTH,
  minValue: 1,
  maxValue: 7,
  numOutcomes: 7,
  takerFee: "0.02",
  makerFee: "0.01",
  tags: ["reporting", "testing", "categorical"],
  extraInfo: "",
  resolution: ""
}, {
  description: "Scalar Reporting Test Market (Cycle 2): correct answer is -2",
  expDate: expDateCycle1 + DEFAULT_PERIOD_LENGTH,
  minValue: -5,
  maxValue: 20,
  numOutcomes: 2,
  takerFee: "0.02",
  makerFee: "0.01",
  tags: ["reporting", "testing", "scalar"],
  extraInfo: "",
  resolution: ""
}, {
  description: "Binary Reporting Test Market (Cycle 3): correct answer is Indeterminate",
  expDate: expDateCycle1 + 2*DEFAULT_PERIOD_LENGTH,
  minValue: 1,
  maxValue: 2,
  numOutcomes: 2,
  takerFee: "0.02",
  makerFee: "0.01",
  tags: ["reporting", "testing", "binary"],
  extraInfo: "",
  resolution: ""
}, {
  description: "Categorical Reporting Test Market (Cycle 3): correct answer is Indeterminate~|>A|B|C|D|E|F|G",
  expDate: expDateCycle1 + 2*DEFAULT_PERIOD_LENGTH,
  minValue: 1,
  maxValue: 7,
  numOutcomes: 7,
  takerFee: "0.02",
  makerFee: "0.01",
  tags: ["reporting", "testing", "categorical"],
  extraInfo: "",
  resolution: ""
}, {
  description: "Scalar Reporting Test Market (Cycle 3): correct answer is Indeterminate",
  expDate: expDateCycle1 + 2*DEFAULT_PERIOD_LENGTH,
  minValue: -5,
  maxValue: 20,
  numOutcomes: 2,
  takerFee: "0.02",
  makerFee: "0.01",
  tags: ["reporting", "testing", "scalar"],
  extraInfo: "",
  resolution: ""
}, {
  description: "Binary Reporting Test Market (Cycle 4): correct answer is Yes",
  expDate: expDateCycle1 + 3*DEFAULT_PERIOD_LENGTH,
  minValue: 1,
  maxValue: 2,
  numOutcomes: 2,
  takerFee: "0.02",
  makerFee: "0.01",
  tags: ["reporting", "testing", "binary"],
  extraInfo: "",
  resolution: ""
}, {
  description: "Categorical Reporting Test Market (Cycle 4): correct answer is G~|>A|B|C|D|E|F|G",
  expDate: expDateCycle1 + 3*DEFAULT_PERIOD_LENGTH,
  minValue: 1,
  maxValue: 7,
  numOutcomes: 7,
  takerFee: "0.02",
  makerFee: "0.01",
  tags: ["reporting", "testing", "categorical"],
  extraInfo: "",
  resolution: ""
}, {
  description: "Scalar Reporting Test Market (Cycle 4): correct answer is 0",
  expDate: expDateCycle1 + 3*DEFAULT_PERIOD_LENGTH,
  minValue: -5,
  maxValue: 20,
  numOutcomes: 2,
  takerFee: "0.02",
  makerFee: "0.01",
  tags: ["reporting", "testing", "scalar"],
  extraInfo: "",
  resolution: ""
}, {
  description: "What will be the status of the U.S. electoral college on January 1, 2020?~|>Unchanged from 2016|Undermined but still in existence (e.g., National Popular Vote bill)|Formally abolished",
  expDate: parseInt(new Date("1/2/2020").getTime() / 1000, 10),
  minValue: 1,
  maxValue: 3,
  numOutcomes: 3,
  takerFee: "0.02",
  makerFee: "0.01",
  tags: ["elections", "US politics", "popular vote"],
  extraInfo: "The National Popular Vote bill would guarantee the Presidency to the candidate who receives the most popular votes nationwide (i.e., all 50 states and the District of Columbia).  It has been enacted into law in 11 states with 165 electoral votes, and will take effect when enacted by states with 105 more electoral votes. The bill has passed one chamber in 12 additional states with 96 electoral votes.   Most recently, the bill was passed by a bipartisan 40–16 vote in the Republican-controlled Arizona House, 28–18 in Republican-controlled Oklahoma Senate, 57–4 in Republican-controlled New York Senate, and 37–21 in Democratic-controlled Oregon House. http://www.nationalpopularvote.com",
  resolution: ""
}, {
  description: "Will California secede from the United States before January 1, 2020?",
  expDate: parseInt(new Date("1/1/2020").getTime() / 1000, 10),
  minValue: 1,
  maxValue: 2,
  numOutcomes: 2,
  takerFee: "0.03",
  makerFee: "0.01",
  tags: ["Calexit", "California", "secession"],
  extraInfo: "In the Spring of 2019, Californians will go to the polls in a historic vote to decide by referendum if California should exit the Union, a #Calexit vote. http://www.yescalifornia.org",
  resolution: ""
}, {
  description: "What will the maximum temperature be (in degrees Fahrenheit) on " + today.toLocaleDateString() + " at the San Francisco International Airport, as reported by Weather Underground?",
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
  description: "Will the Dow Jones Industrial Average close at a higher price on " + today.toLocaleDateString() + " than it closed at the previous day?",
  expDate: parseInt(closingBell.getTime() / 1000, 10),
  minValue: 1,
  maxValue: 2,
  numOutcomes: 2,
  takerFee: "0.05",
  makerFee: "0.015",
  tags: ["Dow Jones", "stock market", "DJIA"],
  extraInfo: "The Daily Dow market lives again! https://en.wikipedia.org/wiki/Dow_Jones_Industrial_Average",
  resolution: "https://www.google.com/finance?q=INDEXDJX:.DJI"
}, {
  description: "Will Augur's live release happen by the end of 2016?",
  expDate: parseInt(new Date("1/1/2017").getTime() / 1000, 10),
  minValue: 1,
  maxValue: 2,
  numOutcomes: 2,
  takerFee: "0.03",
  makerFee: "0.01",
  tags: ["Augur", "release date", "Ethereum"],
  extraInfo: "https://www.augur.net",
  resolution: "https://www.augur.net"
}, {
  description: "Will Augur's live release happen by the end of February, 2017?",
  expDate: parseInt(new Date("3/1/2017").getTime() / 1000, 10),
  minValue: 1,
  maxValue: 2,
  numOutcomes: 2,
  takerFee: "0.03",
  makerFee: "0.01",
  tags: ["Augur", "release date", "Ethereum"],
  extraInfo: "https://www.augur.net",
  resolution: "https://www.augur.net"
}, {
  description: "Will Augur's live release happen by the end of June, 2017?",
  expDate: parseInt(new Date("7/1/2017").getTime() / 1000, 10),
  minValue: 1,
  maxValue: 2,
  numOutcomes: 2,
  takerFee: "0.03",
  makerFee: "0.01",
  tags: ["Augur", "release date", "Ethereum"],
  extraInfo: "https://www.augur.net",
  resolution: "https://www.augur.net"
}, {
  description: "Who will win the University of Georgia vs. University of Florida football game in 2017?~|>Georgia|Florida|Vanderbilt",
  expDate: parseInt(new Date("10/30/2017").getTime() / 1000, 10),
  minValue: 1,
  maxValue: 3,
  numOutcomes: 3,
  takerFee: "0.02",
  makerFee: "0.01",
  tags: ["college football", "football", "Jacksonville"],
  extraInfo: "",
  resolution: ""
}, {
  description: "Will REP tokens be worth more than 100 USD each any time on or before 1.1.2017 on CoinMarketCap?",
  expDate: parseInt(new Date("1/1/2017").getTime() / 1000, 10),
  minValue: 1,
  maxValue: 2,
  numOutcomes: 2,
  takerFee: "0.09",
  makerFee: "0.04",
  tags: ["Augur", "Reputation", "REP"],
  extraInfo: "https://www.reddit.com/r/reptrader",
  resolution: "http://coinmarketcap.com"
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
  description: "Which city will have the highest median single-family home price for September 2017?~|>London|New York|Los Angeles|San Francisco|Tokyo|Palo Alto|Hong Kong|other",
  expDate: parseInt(new Date("10-2-2017").getTime() / 1000, 10),
  minValue: 1,
  maxValue: 8,
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
  maxValue: 10000,
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
  maxValue: 6,
  numOutcomes: 6,
  takerFee: "0.02",
  makerFee: "0.01",
  tags: ["mortality", "United States", "science"],
  extraInfo: "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?",
  resolution: "CDC"
}, {
  description: "Who will win the NFC Championship?~|>Dallas Cowboys|Atlanta Falcons|Green Bay Packers|Seattle Seahawks|New York Giants|Detriot Lions",
  expDate: parseInt(new Date("1-22-2017").getTime() / 1000, 10),
  minValue: 1,
  maxValue: 6,
  numOutcomes: 6,
  takerFee: "0.02",
  makerFee: "0.01",
  tags: ["football", "NFL", "sports"],
  extraInfo: "",
  resolution: "espn.com",
  orderBook: {
    buy: {
      "1": [
        {shares: "200", price: "0.38"},
        {shares: "150", price: "0.37"},
        {shares: "200", price: "0.34"}
      ],
      "2": [
        {shares: "50", price: "0.21"},
        {shares: "100", price: "0.19"},
        {shares: "150", price: "0.16"}
      ],
      "3": [
        {shares: "100", price: "0.2"},
        {shares: "150", price: "0.18"},
        {shares: "100", price: "0.15"}
      ],
      "4": [
        {shares: "100", price: "0.15"},
        {shares: "200", price: "0.12"},
        {shares: "300", price: "0.1"}
      ],
      "5": [
        {shares: "100", price: "0.06"},
        {shares: "500", price: "0.04"},
        {shares: "1000", price: "0.02"}
      ],
      "6": [
        {shares: "200", price: "0.02"},
        {shares: "500", price: "0.01"}
      ]
    },
    sell: {
      "1": [
        {shares: "100", price: "0.42"},
        {shares: "150", price: "0.44"},
        {shares: "200", price: "0.48"}
      ],
      "2": [
        {shares: "100", price: "0.25"},
        {shares: "200", price: "0.29"},
        {shares: "250", price: "0.33"}
      ],
      "3": [
        {shares: "150", price: "0.23"},
        {shares: "250", price: "0.27"},
        {shares: "200", price: "0.3"}
      ],
      "4": [
        {shares: "50", price: "0.2"},
        {shares: "150", price: "0.24"},
        {shares: "100", price: "0.28"}
      ],
      "5": [
        {shares: "350", price: "0.1"},
        {shares: "500", price: "0.15"},
        {shares: "400", price: "0.18"}
      ],
      "6": [
        {shares: "300", price: "0.07"},
        {shares: "1000", price: "0.1"}
      ]
    }
  }
}, {
  description: "Will Tiger Woods win the Genesis Open?",
  expDate: parseInt(new Date("2-19-2017").getTime() / 1000, 10),
  minValue: 1,
  maxValue: 2,
  numOutcomes: 2,
  takerFee: "0.02",
  makerFee: "0.01",
  tags: ["golf", "PGA", "sports"],
  extraInfo: "",
  resolution: "espn.com",
  orderBook: {
    buy: {
      "2": [
        {shares: "100", price: "0.14"},
        {shares: "250", price: "0.11"},
        {shares: "400", price: "0.1"}
      ],
      "1": []
    },
    sell: {
      "2": [
        {shares: "300", price: "0.2"},
        {shares: "200", price: "0.23"},
        {shares: "500", price: "0.26"}
      ],
      "1": []
    }
  }
}, {
  description: "Who will the Cleveland Browns select with the first pick in the NFL draft?~|>Myles Garrett|Any Quarterback|Reuben Foster|Trade The Pick",
  expDate: parseInt(new Date("4-27-2017").getTime() / 1000, 10),
  minValue: 1,
  maxValue: 4,
  numOutcomes: 4,
  takerFee: "0.02",
  makerFee: "0.01",
  tags: ["football", "NFL", "sports"],
  extraInfo: "",
  resolution: "espn.com",
  orderBook: {
    buy: {
      "1": [
        {shares: "300", price: "0.48"},
        {shares: "150", price: "0.45"},
        {shares: "200", price: "0.41"}
      ],
      "2": [
        {shares: "150", price: "0.18"},
        {shares: "250", price: "0.15"},
        {shares: "200", price: "0.12"}
      ],
      "3": [
        {shares: "100", price: "0.13"},
        {shares: "150", price: "0.1"},
        {shares: "200", price: "0.08"}
      ],
      "4": [
        {shares: "100", price: "0.2"},
        {shares: "200", price: "0.18"},
        {shares: "300", price: "0.15"}
      ]
    },
    sell: {
      "1": [
        {shares: "150", price: "0.53"},
        {shares: "200", price: "0.57"},
        {shares: "250", price: "0.61"}
      ],
      "2": [
        {shares: "100", price: "0.21"},
        {shares: "100", price: "0.24"},
        {shares: "200", price: "0.27"}
      ],
      "3": [
        {shares: "150", price: "0.17"},
        {shares: "250", price: "0.2"},
        {shares: "150", price: "0.23"}
      ],
      "4": [
        {shares: "150", price: "0.23"},
        {shares: "100", price: "0.26"},
        {shares: "300", price: "0.29"}
      ]
    }
  }
}, {
  description: "How many total points will be scored in the NFL Pro Bowl Game?",
  expDate: parseInt(new Date("1-29-2017").getTime() / 1000, 10),
  minValue: 0,
  maxValue: 100,
  numOutcomes: 2,
  takerFee: "0.02",
  makerFee: "0.01",
  tags: ["football", "NFL", "sports"],
  extraInfo: "",
  resolution: "espn.com",
  orderBook: {
    buy: {
      "2": [
        {shares: "100", price: "44"},
        {shares: "250", price: "41"},
        {shares: "300", price: "37"}
      ],
      "1": []
    },
    sell: {
      "2": [
        {shares: "50", price: "50"},
        {shares: "200", price: "54"},
        {shares: "250", price: "58"}
      ],
      "1": []
    }
  }
}, {
  description: "What will win the Grammy Award for Album of the Year?~|>Lemonade - Beyonce|Views - Drake|Purpose - Justin Beiber|25 - Adele|A Sailors Guide to Earth - Sturgill Simpson",
  expDate: parseInt(new Date("2-12-2017").getTime() / 1000, 10),
  minValue: 1,
  maxValue: 5,
  numOutcomes: 5,
  takerFee: "0.02",
  makerFee: "0.01",
  tags: ["music", "Grammys", "award"],
  extraInfo: "",
  resolution: "grammy.com",
  orderBook: {
    buy: {
      "1": [
        {shares: "100", price: "0.27"},
        {shares: "150", price: "0.25"},
        {shares: "200", price: "0.23"}
      ],
      "2": [
        {shares: "150", price: "0.17"},
        {shares: "250", price: "0.15"},
        {shares: "200", price: "0.12"}
      ],
      "3": [
        {shares: "100", price: "0.13"},
        {shares: "150", price: "0.1"},
        {shares: "200", price: "0.08"}
      ],
      "4": [
        {shares: "100", price: "0.32"},
        {shares: "200", price: "0.28"},
        {shares: "300", price: "0.25"}
      ],
      "5": [
        {shares: "100", price: "0.08"},
        {shares: "100", price: "0.05"}
      ]
    },
    sell: {
      "1": [
        {shares: "150", price: "0.3"},
        {shares: "200", price: "0.33"},
        {shares: "250", price: "0.36"}
      ],
      "2": [
        {shares: "100", price: "0.21"},
        {shares: "100", price: "0.24"},
        {shares: "200", price: "0.27"}
      ],
      "3": [
        {shares: "150", price: "0.17"},
        {shares: "250", price: "0.2"},
        {shares: "150", price: "0.23"}
      ],
      "4": [
        {shares: "150", price: "0.35"},
        {shares: "100", price: "0.38"},
        {shares: "300", price: "0.41"}
      ],
      "5": [
        {shares: "100", price: "0.11"},
        {shares: "500", price: "0.13"}
      ]
    }
  }
}];

augur.connect({
  http: "http://127.0.0.1:8545",
  ipc: process.env.GETH_IPC,
  ws: "ws://127.0.0.1:8546"
}, function (connected) {
  if (!connected) return console.error("connect failed:", connected);
  augur.setCash(augur.from, "10000000000000", augur.utils.noop, function (r) {
    console.debug("setCash success:", r.callReturn);
    async.eachSeries(cannedMarkets, function (market, nextMarket) {
      if (!market.orderBook && parseInt(augur.network_id) === 9000) return nextMarket();
      market.branchId = augur.constants.DEFAULT_BRANCH_ID;
      market.onSent = function (r) {
        if (DEBUG) console.debug("createSingleEventMarket sent:", r);
      };
      market.onSuccess = function (r) {
        var i;
        if (DEBUG) console.debug("createSingleEventMarket success:", r.callReturn);
        console.log(chalk.green(r.callReturn), chalk.cyan.dim(market.description));
        var initialFairPrices = new Array(market.numOutcomes);
        var isScalar = false;
        if (market.numOutcomes === 2 && (market.minValue !== 1 || market.maxValue !== 2)) {
          var midpoint = ((market.maxValue - market.minValue) / 2).toString();
          initialFairPrices[0] = midpoint;
          initialFairPrices[1] = midpoint;
          isScalar = true;
        } else {
          for (i = 0; i < market.numOutcomes; ++i) {
            initialFairPrices[i] = (1 / market.numOutcomes).toString();
          }
        }
        var marketID = r.callReturn;
        if (!market.orderBook) {
          var orderBookParams = {
            market: marketID,
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
        } else {
          var scalarMinMax = null;
          if (isScalar) {
            scalarMinMax = {minValue: market.minValue, maxValue: market.maxValue};
          }
          var largestOutcomeShares = 0;
          for (var outcomeID in market.orderBook.sell) {
            if (!market.orderBook.sell.hasOwnProperty(outcomeID)) continue;
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
          // console.log('largestOutcomeShares:', largestOutcomeShares);
          augur.buyCompleteSets({
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
                      augur.buy({
                        amount: order.shares,
                        price: order.price,
                        market: marketID,
                        outcome: outcome,
                        scalarMinMax: scalarMinMax,
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
                      augur.sell({
                        amount: order.shares,
                        price: order.price,
                        market: marketID,
                        outcome: outcome,
                        scalarMinMax: scalarMinMax,
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
        }
      };
      market.onFailed = function (e) {
        console.error(chalk.red.bold("createSingleEventMarket failed:"), e);
        nextMarket();
      };
      augur.createSingleEventMarket(market);
    }, process.exit);
  }, process.exit);
});
