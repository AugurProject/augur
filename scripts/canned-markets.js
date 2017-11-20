#!/usr/bin/env node
/**
 * Create a handful of canned markets for us to test with.
 */

"use strict";

var async = require("async");
var BigNumber = require("bignumber.js");
var chalk = require("chalk");
var speedomatic = require("speedomatic");
var Augur = require("../src");
var convertDecimalToFixedPoint = require("../src/utils/convert-decimal-to-fixed-point");
var constants = require("../src/constants");

var augur = new Augur();

var DEBUG = true;

augur.rpc.setDebugOptions({ connect: true, broadcast: false });

var ethereumNode = {
  http: "http://127.0.0.1:8545",
  ws: "ws://127.0.0.1:8546",
};
var augurNode = "ws://127.0.0.1:9001";

var closingBell = new Date();
closingBell.setHours(20, 0, 0, 0);
var midnightTomorrow = new Date();
midnightTomorrow.setDate(midnightTomorrow.getDate() + 1);
midnightTomorrow.setHours(0, 0, 0, 0);
var today = new Date();

var arbitrarySharesMultiplierThatExistsSolelyToAvoidAddingLotsOfZerosToAllTheSharesValues = new BigNumber(10, 10).toPower(11);

var cannedMarkets = [{
  _endTime: parseInt(new Date("1/1/2020").getTime() / 1000, 10),
  _numOutcomes: 2,
  _topic: "politics",
  _extraInfo: {
    marketType: "binary",
    resolutionSource: "",
    tags: ["California", "Calexit"],
    description: "Will California secede from the United States before January 1, 2020?",
    longDescription: "In the Spring of 2019, Californians will go to the polls in a historic vote to decide by referendum if California should exit the Union, a #Calexit vote. http://www.yescalifornia.org",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "100", price: "0.2" },
        { shares: "200", price: "0.18" },
        { shares: "300", price: "0.15" },
      ],
    },
    sell: {
      "0": [
        { shares: "150", price: "0.23" },
        { shares: "100", price: "0.26" },
        { shares: "300", price: "0.29" },
      ],
    },
  },
}, {
  _endTime: parseInt(midnightTomorrow.getTime() / 1000, 10),
  _minPrice: "-10",
  _maxPrice: "120",
  _numOutcomes: 2,
  _topic: "temperature",
  _extraInfo: {
    marketType: "scalar",
    resolutionSource: "https://www.wunderground.com/history/airport/KSFO/" + [today.getUTCFullYear(), today.getUTCMonth() + 1, today.getUTCDate()].join("/") + "/DailyHistory.html",
    tags: ["weather", "SFO"],
    description: "What will the maximum temperature be (in degrees Fahrenheit) on " + today.toLocaleDateString() + " at the San Francisco International Airport, as reported by Weather Underground?",
    longDescription: "https://www.penny-arcade.com/comic/2001/12/12",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "1", price: "20" },
        { shares: "2", price: "0" },
        { shares: "3", price: "-5" },
      ],
    },
    sell: {
      "0": [
        { shares: "1", price: "25" },
        { shares: "1", price: "50" },
        { shares: "3", price: "100" },
      ],
    },
  },
}, {
  _endTime: parseInt(closingBell.getTime() / 1000, 10),
  _numOutcomes: 2,
  _topic: "finance",
  _extraInfo: {
    marketType: "binary",
    resolutionSource: "https://www.google.com/finance?q=INDEXDJX:.DJI",
    tags: ["stocks", "Dow Jones"],
    description: "Will the Dow Jones Industrial Average close at a higher price on " + today.toLocaleDateString() + " than it closed at the previous day?",
    longDescription: "The Daily Dow market lives again! https://en.wikipedia.org/wiki/Dow_Jones_Industrial_Average",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "100", price: "0.2" },
        { shares: "200", price: "0.18" },
        { shares: "300", price: "0.15" },
      ],
    },
    sell: {
      "0": [
        { shares: "150", price: "0.23" },
        { shares: "100", price: "0.26" },
        { shares: "300", price: "0.29" },
      ],
    },
  },
}, {
  _endTime: parseInt(new Date("1/1/2018").getTime() / 1000, 10),
  _numOutcomes: 2,
  _topic: "Augur",
  _extraInfo: {
    marketType: "binary",
    resolutionSource: "https://www.augur.net",
    tags: ["release date", "Ethereum"],
    description: "Will Augur's live release happen by the end of December, 2017?",
    longDescription: "https://www.augur.net",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "100", price: "0.2" },
        { shares: "200", price: "0.18" },
        { shares: "300", price: "0.15" },
      ],
    },
    sell: {
      "0": [
        { shares: "150", price: "0.23" },
        { shares: "100", price: "0.26" },
        { shares: "300", price: "0.29" },
      ],
    },
  },
}, {
  _endTime: parseInt(new Date("10/30/2018").getTime() / 1000, 10),
  _numOutcomes: 2,
  _topic: "sports",
  _extraInfo: {
    marketType: "categorical",
    resolutionSource: "",
    tags: ["college football", "football"],
    outcomeNames: ["Georgia", "Florida"],
    description: "Who will win the University of Georgia vs. University of Florida football game in 2018?",
    longDescription: "",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "100", price: "0.2" },
        { shares: "200", price: "0.18" },
        { shares: "300", price: "0.15" },
      ],
      "1": [
        { shares: "300", price: "0.48" },
        { shares: "150", price: "0.45" },
        { shares: "200", price: "0.41" },
      ],
    },
    sell: {
      "0": [
        { shares: "150", price: "0.23" },
        { shares: "100", price: "0.26" },
        { shares: "300", price: "0.29" },
      ],
      "1": [
        { shares: "150", price: "0.53" },
        { shares: "200", price: "0.57" },
        { shares: "250", price: "0.61" },
      ],
    },
  },
}, {
  _endTime: parseInt(new Date("2/1/2019").getTime() / 1000, 10),
  _numOutcomes: 2,
  _topic: "politics",
  _extraInfo: {
    marketType: "binary",
    resolutionSource: "",
    tags: ["Trump", "impeachment"],
    description: "Will Donald Trump be impeached and removed from the Presidency within two years of his inauguration?",
    longDescription: "",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "100", price: "0.2" },
        { shares: "200", price: "0.18" },
        { shares: "300", price: "0.15" },
      ],
    },
    sell: {
      "0": [
        { shares: "150", price: "0.23" },
        { shares: "100", price: "0.26" },
        { shares: "300", price: "0.29" },
      ],
    },
  },
}, {
  _endTime: parseInt(new Date("12/31/2018").getTime() / 1000, 10),
  _numOutcomes: 2,
  _topic: "politics",
  _extraInfo: {
    marketType: "binary",
    resolutionSource: "",
    tags: ["elections", "Brazil"],
    description: "Will Jair Messias Bolsonaro be elected the president of Brazil in 2018?",
    longDescription: "",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "100", price: "0.2" },
        { shares: "200", price: "0.18" },
        { shares: "300", price: "0.15" },
      ],
    },
    sell: {
      "0": [
        { shares: "150", price: "0.23" },
        { shares: "100", price: "0.26" },
        { shares: "300", price: "0.29" },
      ],
    },
  },
}, {
  _endTime: parseInt(new Date("1/2/2018").getTime() / 1000, 10),
  _numOutcomes: 2,
  _topic: "trading",
  _extraInfo: {
    marketType: "binary",
    resolutionSource: "http://coinmarketcap.com",
    tags: ["Augur", "Reputation"],
    description: "Will REP tokens be worth more than 100 USD each any time on or before January 1, 2018 on CoinMarketCap?",
    longDescription: "https://www.reddit.com/r/reptrader",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "100", price: "0.2" },
        { shares: "200", price: "0.18" },
        { shares: "300", price: "0.15" },
      ],
    },
    sell: {
      "0": [
        { shares: "150", price: "0.23" },
        { shares: "100", price: "0.26" },
        { shares: "300", price: "0.29" },
      ],
    },
  },
}, {
  _endTime: parseInt(new Date("12/1/2018").getTime() / 1000, 10),
  _numOutcomes: 2,
  _topic: "trading",
  _extraInfo: {
    marketType: "binary",
    resolutionSource: "http://coinmarketcap.com",
    tags: ["trading", "Ethereum", "currencies"],
    description: "Will Ethereum trade at $400 or higher by midnight EST on November 30, 2018?",
    longDescription: "http://coinmarketcap.com/currencies/ethereum",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "100", price: "0.2" },
        { shares: "200", price: "0.18" },
        { shares: "300", price: "0.15" },
      ],
    },
    sell: {
      "0": [
        { shares: "150", price: "0.23" },
        { shares: "100", price: "0.26" },
        { shares: "300", price: "0.29" },
      ],
    },
  },
}, {
  _endTime: parseInt(new Date("1/1/2019").getTime() / 1000, 10),
  _numOutcomes: 2,
  _topic: "space",
  _extraInfo: {
    marketType: "binary",
    resolutionSource: "http://www.spacex.com",
    tags: ["SpaceX", "spaceflight"],
    description: "Will SpaceX successfully complete a manned flight to the International Space Station by the end of 2018?",
    longDescription: "SpaceX hit a big milestone on Friday with NASA confirming on Friday that the Elon Musk-led space cargo business will launch astronauts to the International Space Station by 2017.\n\nLast year, the space agency tentatively awarded a $2.6 billion contract to SpaceX to carry crew to space. NASA’s announcement on Friday formalizes the deal, which involves SpaceX loading its Crew Dragon spacecraft with astronauts and sending them beyond the stratosphere.",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "100", price: "0.2" },
        { shares: "200", price: "0.18" },
        { shares: "300", price: "0.15" },
      ],
    },
    sell: {
      "0": [
        { shares: "150", price: "0.23" },
        { shares: "100", price: "0.26" },
        { shares: "300", price: "0.29" },
      ],
    },
  },
}, {
  _endTime: parseInt(new Date("7-2-2018").getTime() / 1000, 10),
  _minPrice: "-10",
  _maxPrice: "120",
  _numOutcomes: 2,
  _topic: "temperature",
  _extraInfo: {
    marketType: "scalar",
    resolutionSource: "http://forecast.weather.gov",
    tags: ["San Francisco", "weather"],
    description: "What will the high temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2018?",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "10", price: "20" },
        { shares: "20", price: "0" },
        { shares: "30", price: "-5" },
      ],
    },
    sell: {
      "0": [
        { shares: "15", price: "25" },
        { shares: "10", price: "50" },
        { shares: "30", price: "100" },
      ],
    },
  },
}, {
  marketType: "binary",
  _endTime: parseInt(new Date("11-2-2018").getTime() / 1000, 10),
  _numOutcomes: 2,
  _topic: "climate",
  _extraInfo: {
    resolutionSource: "",
    tags: ["Antartica", "warming"],
    description: "Will the Larsen B ice shelf collapse by November 1, 2018?",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "100", price: "0.2" },
        { shares: "200", price: "0.18" },
        { shares: "300", price: "0.15" },
      ],
    },
    sell: {
      "0": [
        { shares: "150", price: "0.23" },
        { shares: "100", price: "0.26" },
        { shares: "300", price: "0.29" },
      ],
    },
  },
}, {
  _endTime: parseInt(new Date("1-2-2018").getTime() / 1000, 10),
  _minPrice: "0",
  _maxPrice: "10000",
  _numOutcomes: 2,
  _topic: "science",
  _extraInfo: {
    marketType: "scalar",
    resolutionSource: "science!",
    tags: ["extinction", "marine biology"],
    description: "How many marine species will go extinct between January 1, 2016 and January 1, 2018?",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "1", price: "1000" },
        { shares: "20", price: "500" },
        { shares: "300", price: "10" },
      ],
    },
    sell: {
      "0": [
        { shares: "1", price: "1050" },
        { shares: "1", price: "2500" },
        { shares: "3", price: "4000" },
      ],
    },
  },
}, {
  _endTime: parseInt(new Date("1-2-2019").getTime() / 1000, 10),
  _minPrice: "700",
  _maxPrice: "5000",
  _numOutcomes: 2,
  _topic: "science",
  _extraInfo: {
    marketType: "scalar",
    resolutionSource: "EPA",
    tags: ["climate", "atmosphere"],
    description: "What will the average tropospheric methane concentration (in parts-per-billion) be between January 1, 2018 and January 1, 2019?",
    longDescription: "Vast quantities of methane are normally locked into the Earth's crust on the continental plateaus in one of the many deposits consisting of compounds of methane hydrate, a solid precipitated combination of methane and water much like ice. Because the methane hydrates are unstable, except at cool temperatures and high (deep) pressures, scientists have observed smaller \"burps\" due to tectonic events. Studies suggest the huge release of natural gas could be a major climatological trigger, methane itself being a greenhouse gas many times more powerful than carbon dioxide. References: https://en.wikipedia.org/wiki/Anoxic_event, https://en.wikipedia.org/wiki/Atmospheric_methane, https://en.wikipedia.org/wiki/Clathrate_gun_hypothesis",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "100", price: "1000" },
        { shares: "200", price: "900" },
        { shares: "300", price: "775" },
      ],
    },
    sell: {
      "0": [
        { shares: "150", price: "1050" },
        { shares: "100", price: "2500" },
        { shares: "300", price: "4000" },
      ],
    },
  },
}, {
  _endTime: parseInt(new Date("6-20-2018").getTime() / 1000, 10),
  _numOutcomes: 2,
  _topic: "sports",
  _extraInfo: {
    marketType: "binary",
    resolutionSource: "ESPN",
    tags: ["basketball", "Warriors"],
    description: "Will the Golden State Warriors win the 2018 NBA Championship?",
    longDescription: "",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "100", price: "0.2" },
        { shares: "200", price: "0.18" },
        { shares: "300", price: "0.15" },
      ],
    },
    sell: {
      "0": [
        { shares: "150", price: "0.23" },
        { shares: "100", price: "0.26" },
        { shares: "300", price: "0.29" },
      ],
    },
  },
}, {
  _endTime: parseInt(new Date("1-1-2021").getTime() / 1000, 10),
  _minPrice: "0",
  _maxPrice: "30",
  _numOutcomes: 2,
  _topic: "medicine",
  _extraInfo: {
    marketType: "scalar",
    resolutionSource: "FDA",
    tags: ["science", "antibiotics"],
    description: "How many new antibiotics will be approved by the FDA between March 1, 2016 and the end of 2020?",
    longDescription: "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "100", price: "2" },
        { shares: "200", price: "18" },
        { shares: "300", price: "15" },
      ],
    },
    sell: {
      "0": [
        { shares: "150", price: "23" },
        { shares: "100", price: "26" },
        { shares: "300", price: "29" },
      ],
    },
  },
}, {
  _endTime: parseInt(new Date("1-1-2021").getTime() / 1000, 10),
  _numOutcomes: 2,
  _topic: "agriculture",
  _extraInfo: {
    marketType: "binary",
    tags: ["antibiotics", "China"],
    description: "Will antibiotics be outlawed for agricultural use in China by the end of 2020?",
    longDescription: "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "100", price: "0.2" },
        { shares: "200", price: "0.18" },
        { shares: "300", price: "0.15" },
      ],
    },
    sell: {
      "0": [
        { shares: "150", price: "0.23" },
        { shares: "100", price: "0.26" },
        { shares: "300", price: "0.29" },
      ],
    },
  },
// }, {
//   _endTime: parseInt(new Date("1/2/2020").getTime() / 1000, 10),
//   _numOutcomes: 3,
//   _topic: "politics",
//   _extraInfo: {
//     marketType: "categorical",
//     resolutionSource: "",
//     tags: ["elections", "US politics"],
//     description: "What will be the status of the U.S. electoral college on January 1, 2020?",
//     outcomeNames: ["Unchanged from 2016", "Undermined but still in existence (e.g., National Popular Vote bill)", "Formally abolished"],
//     longDescription: "The National Popular Vote bill would guarantee the Presidency to the candidate who receives the most popular votes nationwide (i.e., all 50 states and the District of Columbia).  It has been enacted into law in 11 states with 165 electoral votes, and will take effect when enacted by states with 105 more electoral votes. The bill has passed one chamber in 12 additional states with 96 electoral votes.   Most recently, the bill was passed by a bipartisan 40–16 vote in the Republican-controlled Arizona House, 28–18 in Republican-controlled Oklahoma Senate, 57–4 in Republican-controlled New York Senate, and 37–21 in Democratic-controlled Oregon House. http://www.nationalpopularvote.com",
//   },
//   orderBook: {
//     buy: {
//       "0": [
//         { shares: "100", price: "0.2" },
//         { shares: "200", price: "0.18" },
//         { shares: "300", price: "0.15" },
//       ],
//       "1": [
//         { shares: "300", price: "0.48" },
//         { shares: "150", price: "0.45" },
//         { shares: "200", price: "0.41" },
//       ],
//       "2": [
//         { shares: "150", price: "0.18" },
//         { shares: "250", price: "0.15" },
//         { shares: "200", price: "0.12" },
//       ],
//     },
//     sell: {
//       "0": [
//         { shares: "150", price: "0.23" },
//         { shares: "100", price: "0.26" },
//         { shares: "300", price: "0.29" },
//       ],
//       "1": [
//         { shares: "150", price: "0.53" },
//         { shares: "200", price: "0.57" },
//         { shares: "250", price: "0.61" },
//       ],
//       "2": [
//         { shares: "100", price: "0.21" },
//         { shares: "100", price: "0.24" },
//         { shares: "200", price: "0.27" },
//       ],
//     },
//   },
// }, {
//   _endTime: parseInt(new Date("10-2-2018").getTime() / 1000, 10),
//   _numOutcomes: 8,
//   _topic: "housing",
//   _extraInfo: {
//     marketType: "categorical",
//     tags: ["economy", "bubble"],
//     outcomeNames: ["London", "New York", "Los Angeles", "San Francisco", "Tokyo", "Palo Alto", "Hong Kong", "other"],
//     description: "Which city will have the highest median single-family home price for September 2018?",
//   },
//   orderBook: {
//     buy: {
//       "0": [
//         { shares: "100", price: "0.2" },
//         { shares: "200", price: "0.18" },
//         { shares: "300", price: "0.15" },
//       ],
//       "1": [
//         { shares: "300", price: "0.48" },
//         { shares: "150", price: "0.45" },
//         { shares: "200", price: "0.41" },
//       ],
//       "2": [
//         { shares: "150", price: "0.18" },
//         { shares: "250", price: "0.15" },
//         { shares: "200", price: "0.12" },
//       ],
//       "3": [
//         { shares: "100", price: "0.13" },
//         { shares: "150", price: "0.1" },
//         { shares: "200", price: "0.08" },
//       ],
//       "4": [
//         { shares: "100", price: "0.2" },
//         { shares: "200", price: "0.18" },
//         { shares: "300", price: "0.15" },
//       ],
//       "5": [
//         { shares: "100", price: "0.2" },
//         { shares: "200", price: "0.18" },
//         { shares: "300", price: "0.15" },
//       ],
//       "6": [
//         { shares: "100", price: "0.13" },
//         { shares: "150", price: "0.1" },
//         { shares: "200", price: "0.08" },
//       ],
//       "7": [
//         { shares: "100", price: "0.13" },
//         { shares: "150", price: "0.1" },
//         { shares: "200", price: "0.08" },
//       ],
//     },
//     sell: {
//       "0": [
//         { shares: "150", price: "0.23" },
//         { shares: "100", price: "0.26" },
//         { shares: "300", price: "0.29" },
//       ],
//       "1": [
//         { shares: "150", price: "0.53" },
//         { shares: "200", price: "0.57" },
//         { shares: "250", price: "0.61" },
//       ],
//       "2": [
//         { shares: "100", price: "0.21" },
//         { shares: "100", price: "0.24" },
//         { shares: "200", price: "0.27" },
//       ],
//       "3": [
//         { shares: "150", price: "0.17" },
//         { shares: "250", price: "0.2" },
//         { shares: "150", price: "0.23" },
//       ],
//       "4": [
//         { shares: "150", price: "0.23" },
//         { shares: "100", price: "0.26" },
//         { shares: "300", price: "0.29" },
//       ],
//       "5": [
//         { shares: "150", price: "0.23" },
//         { shares: "100", price: "0.26" },
//         { shares: "300", price: "0.29" },
//       ],
//       "6": [
//         { shares: "150", price: "0.17" },
//         { shares: "250", price: "0.2" },
//         { shares: "150", price: "0.23" },
//       ],
//       "7": [
//         { shares: "150", price: "0.17" },
//         { shares: "250", price: "0.2" },
//         { shares: "150", price: "0.23" },
//       ],
//     },
//   },
// }, {
//   _endTime: parseInt(new Date("1-2-2025").getTime() / 1000, 10),
//   _numOutcomes: 6,
//   _topic: "science",
//   _extraInfo: {
//     marketType: "categorical",
//     resolutionSource: "CDC",
//     tags: ["mortality", "United States"],
//     outcomeNames: ["cancer", "heart attacks", "infectious diseases", "starvation", "lava", "other"],
//     description: "What will be the number one killer in the United States by January 1, 2025?",
//     longDescription: "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?",
//   },
//   orderBook: {
//     buy: {
//       "0": [
//         { shares: "100", price: "0.2" },
//         { shares: "200", price: "0.18" },
//         { shares: "300", price: "0.15" },
//       ],
//       "1": [
//         { shares: "300", price: "0.48" },
//         { shares: "150", price: "0.45" },
//         { shares: "200", price: "0.41" },
//       ],
//       "2": [
//         { shares: "150", price: "0.18" },
//         { shares: "250", price: "0.15" },
//         { shares: "200", price: "0.12" },
//       ],
//       "3": [
//         { shares: "100", price: "0.13" },
//         { shares: "150", price: "0.1" },
//         { shares: "200", price: "0.08" },
//       ],
//       "4": [
//         { shares: "100", price: "0.2" },
//         { shares: "200", price: "0.18" },
//         { shares: "300", price: "0.15" },
//       ],
//       "5": [
//         { shares: "100", price: "0.2" },
//         { shares: "200", price: "0.18" },
//         { shares: "300", price: "0.15" },
//       ],
//     },
//     sell: {
//       "0": [
//         { shares: "150", price: "0.23" },
//         { shares: "100", price: "0.26" },
//         { shares: "300", price: "0.29" },
//       ],
//       "1": [
//         { shares: "150", price: "0.53" },
//         { shares: "200", price: "0.57" },
//         { shares: "250", price: "0.61" },
//       ],
//       "2": [
//         { shares: "100", price: "0.21" },
//         { shares: "100", price: "0.24" },
//         { shares: "200", price: "0.27" },
//       ],
//       "3": [
//         { shares: "150", price: "0.17" },
//         { shares: "250", price: "0.2" },
//         { shares: "150", price: "0.23" },
//       ],
//       "4": [
//         { shares: "150", price: "0.23" },
//         { shares: "100", price: "0.26" },
//         { shares: "300", price: "0.29" },
//       ],
//       "5": [
//         { shares: "150", price: "0.23" },
//         { shares: "100", price: "0.26" },
//         { shares: "300", price: "0.29" },
//       ],
//     },
//   },
}];

function approveAugurEternalApprovalValue(callback) {
  var augurContract = augur.contracts.addresses[augur.rpc.getNetworkID()].Augur;
  augur.api.Cash.allowance({ _owner: augur.rpc.getCoinbase(), _spender: augurContract }, function (err, allowance) {
    if (err) return callback(err);
    if (new BigNumber(allowance, 10).eq(new BigNumber(constants.ETERNAL_APPROVAL_VALUE, 16))) return callback(null);
    augur.api.Cash.approve({
      _spender: augurContract,
      _value: constants.ETERNAL_APPROVAL_VALUE,
      onSent: function (res) {
        if (DEBUG) console.log("Augur.approve sent:", res.hash);
      },
      onSuccess: function (res) {
        if (DEBUG) console.log("Augur.approve success:", res.callReturn);
        callback(null);
      },
      onFailed: function (err) {
        if (DEBUG) console.error("Augur.approve failed:", err);
        callback(err);
      },
    });
  });
}

function createOrder(marketID, outcome, numOutcomes, maxPrice, minPrice, orderType, order, callback) {
  var normalizedPrice = augur.trading.normalizePrice({ price: order.price, maxPrice: maxPrice, minPrice: minPrice });
  var bnNumTicks = new BigNumber(maxPrice, 10).minus(new BigNumber(minPrice, 10)).times(constants.DEFAULT_NUM_TICKS[numOutcomes]);
  var bnShares = new BigNumber(order.shares, 10).times(arbitrarySharesMultiplierThatExistsSolelyToAvoidAddingLotsOfZerosToAllTheSharesValues);
  var bnPrice = new BigNumber(convertDecimalToFixedPoint(normalizedPrice, bnNumTicks.toFixed()), 16);
  var orderTypeCode, bnCost;
  if (orderType === "buy") {
    orderTypeCode = 0;
    bnCost = bnShares.times(bnPrice);
  } else {
    orderTypeCode = 1;
    bnCost = bnShares.times(bnNumTicks.minus(bnPrice));
  }
  if (DEBUG) console.log("cost:", speedomatic.unfix(bnCost, "string"));
  var params = {
    tx: { value: "0x" + bnCost.toString(16) },
    _type: orderTypeCode,
    _attoshares: "0x" + bnShares.toString(16),
    _displayPrice: "0x" + bnPrice.toString(16),
    _market: marketID,
    _outcome: outcome,
    _betterOrderId: 0,
    _worseOrderId: 0,
    _tradeGroupId: 0,
    onSent: function (res) {
      if (DEBUG) console.log("publicCreateOrder sent:", order, res.hash);
    },
    onSuccess: function (res) {
      if (DEBUG) console.log("publicCreateOrder success:", order, res.callReturn);
      callback(null);
    },
    onFailed: function (err) {
      if (DEBUG) console.error("publicCreateOrder failed:", order);
      callback(err);
    },
  };
  if (DEBUG) console.log("createOrder params:", params);
  augur.api.CreateOrder.publicCreateOrder(params);
}

function createOrderBook(marketID, numOutcomes, maxPrice, minPrice, orderBook, callback) {
  async.forEachOf(orderBook, function (orders, orderType, nextOrderType) {
    if (DEBUG) console.log("orderType:", orderType);
    async.forEachOf(orders, function (outcomeOrders, outcome, nextOutcome) {
      if (DEBUG) console.log("outcome:", outcome);
      // TODO remove shareToken approvals after contracts upgraded
      augur.api.Market.getShareToken({ tx: { to: marketID }, _outcome: outcome }, function (err, shareToken) {
        if (err) return nextOutcome(err);
        augur.api.ShareToken.allowance({
          tx: { to: shareToken },
          _owner: augur.rpc.getCoinbase(),
          _spender: augur.contracts.addresses[augur.rpc.getNetworkID()].Order,
        }, function (err, allowance) {
          if (err) return callback(err);
          if (new BigNumber(allowance, 10).eq(new BigNumber(constants.ETERNAL_APPROVAL_VALUE, 16))) {
            async.each(outcomeOrders, function (order, nextOrder) {
              createOrder(marketID, parseInt(outcome, 10), numOutcomes, maxPrice, minPrice, orderType, order, nextOrder);
            }, nextOutcome);
          } else {
            augur.api.ShareToken.approve({
              tx: { to: shareToken },
              _spender: augur.contracts.addresses[augur.rpc.getNetworkID()].Order,
              _value: augur.constants.ETERNAL_APPROVAL_VALUE,
              onSent: function (res) {
                if (DEBUG) console.log("ShareToken.approve sent:", res.hash);
              },
              onSuccess: function (res) {
                if (DEBUG) console.log("ShareToken.approve success:", res.callReturn);
                async.each(outcomeOrders, function (order, nextOrder) {
                  createOrder(marketID, parseInt(outcome, 10), numOutcomes, maxPrice, minPrice, orderType, order, nextOrder);
                }, nextOutcome);
              },
              onFailed: function (err) {
                if (DEBUG) console.error("ShareToken.approve failed:", err);
                nextOutcome(err);
              },
            });
          }
        });
      });
    }, nextOrderType);
  }, callback);
}

function createNewMarket(market, callback) {
  var createMarket;
  switch (market._extraInfo.marketType) {
    case "categorical":
      createMarket = augur.createMarket.createCategoricalMarket;
      break;
    case "scalar":
      createMarket = augur.createMarket.createScalarMarket;
      market.maxPrice = market._maxPrice;
      market.minPrice = market._minPrice;
      break;
    case "binary":
    default:
      createMarket = augur.createMarket.createBinaryMarket;
  }
  createMarket(Object.assign({}, market, {
    universe: augur.contracts.addresses[augur.rpc.getNetworkID()].Universe,
    _feePerEthInWei: "0x123456",
    _denominationToken: augur.contracts.addresses[augur.rpc.getNetworkID()].Cash,
    _designatedReporterAddress: augur.rpc.getCoinbase(),
    onSent: function (res) {
      if (DEBUG) console.log("createMarket sent:", res.hash);
    },
    onSuccess: function (res) {
      if (DEBUG) console.log("createMarket success:", res.callReturn);
      callback(null, res.callReturn);
    },
    onFailed: function (err) {
      if (DEBUG) console.error(chalk.red.bold("createMarket failed:"), err);
      callback(err);
    },
  }));
}

augur.connect({ ethereumNode: ethereumNode, augurNode: augurNode }, function (err) {
  if (err) return console.error(err);
  approveAugurEternalApprovalValue(function (err) {
    if (err) return console.error(err);
    async.eachSeries(cannedMarkets, function (market, nextMarket) {
      createNewMarket(market, function (err, marketID) {
        if (err) return nextMarket(err);
        console.log(chalk.green(marketID), chalk.cyan.dim(market._extraInfo.description));
        var minPrice, maxPrice;
        if (market._extraInfo.marketType === "scalar") {
          minPrice = market._minPrice;
          maxPrice = market._maxPrice;
        } else {
          minPrice = "0";
          maxPrice = "1";
        }
        createOrderBook(marketID, market._numOutcomes, maxPrice, minPrice, market.orderBook, function (err) {
          if (err) return nextMarket(err);
          nextMarket();
        });
      });
    }, function (err) {
      if (err) console.error("canned market creation failed:", err);
      process.exit();
    });
  });
});
