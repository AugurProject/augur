"use strict";

var binaryOrderBook = require("./binary-order-book");

var closingBell = new Date();
closingBell.setHours(20, 0, 0, 0);
var midnightTomorrow = new Date();
midnightTomorrow.setDate(midnightTomorrow.getDate() + 1);
midnightTomorrow.setHours(0, 0, 0, 0);
var today = new Date();

module.exports = [{
  marketType: "binary",
  _description: "Will SpaceX successfully complete a manned flight to the International Space Station by the end of 2018?",
  _endTime: parseInt(new Date("1/1/2019").getTime() / 1000, 10),
  _topic: "space",
  _extraInfo: {
    resolutionSource: "http://www.spacex.com",
    tags: ["SpaceX", "spaceflight"],
    longDescription: "SpaceX hit a big milestone on Friday with NASA confirming on Friday that the Elon Musk-led space cargo business will launch astronauts to the International Space Station by 2017.\n\nLast year, the space agency tentatively awarded a $2.6 billion contract to SpaceX to carry crew to space. NASA’s announcement on Friday formalizes the deal, which involves SpaceX loading its Crew Dragon spacecraft with astronauts and sending them beyond the stratosphere.",
  },
  orderBook: binaryOrderBook,
}, {
  marketType: "binary",
  _description: "Will California secede from the United States before January 1, 2020?",
  _endTime: parseInt(new Date("1/1/2020").getTime() / 1000, 10),
  _topic: "politics",
  _extraInfo: {
    resolutionSource: "",
    tags: ["California", "Calexit"],
    longDescription: "In the Spring of 2019, Californians will go to the polls in a historic vote to decide by referendum if California should exit the Union, a #Calexit vote. http://www.yescalifornia.org",
  },
  orderBook: binaryOrderBook,
}, {
  marketType: "binary",
  _description: "Will the Dow Jones Industrial Average close at a higher price on " + today.toLocaleDateString() + " than it closed at the previous day?",
  _endTime: parseInt(closingBell.getTime() / 1000, 10),
  _topic: "finance",
  _extraInfo: {
    resolutionSource: "https://www.google.com/finance?q=INDEXDJX:.DJI",
    tags: ["stocks", "Dow Jones"],
    longDescription: "The Daily Dow market lives again! https://en.wikipedia.org/wiki/Dow_Jones_Industrial_Average",
  },
  orderBook: binaryOrderBook,
}, {
  marketType: "binary",
  _description: "Will Augur's live release happen by the end of December, 2017?",
  _endTime: parseInt(new Date("1/1/2018").getTime() / 1000, 10),
  _topic: "Augur",
  _extraInfo: {
    resolutionSource: "https://www.augur.net",
    tags: ["release date", "Ethereum"],
    longDescription: "https://www.augur.net",
  },
  orderBook: binaryOrderBook,
}, {
  marketType: "binary",
  _description: "Will Donald Trump be impeached and removed from the Presidency within two years of his inauguration?",
  _endTime: parseInt(new Date("2/1/2019").getTime() / 1000, 10),
  _topic: "politics",
  _extraInfo: {
    resolutionSource: "",
    tags: ["Trump", "impeachment"],
    longDescription: "",
  },
  orderBook: binaryOrderBook,
}, {
  marketType: "binary",
  _description: "Will Jair Messias Bolsonaro be elected the president of Brazil in 2018?",
  _endTime: parseInt(new Date("12/31/2018").getTime() / 1000, 10),
  _topic: "politics",
  _extraInfo: {
    resolutionSource: "",
    tags: ["elections", "Brazil"],
    longDescription: "",
  },
  orderBook: binaryOrderBook,
}, {
  marketType: "binary",
  _description: "Will REP tokens be worth more than 100 USD each any time on or before January 1, 2018 on CoinMarketCap?",
  _endTime: parseInt(new Date("1/2/2018").getTime() / 1000, 10),
  _topic: "trading",
  _extraInfo: {
    resolutionSource: "http://coinmarketcap.com",
    tags: ["Augur", "Reputation"],
    longDescription: "https://www.reddit.com/r/reptrader",
  },
  orderBook: binaryOrderBook,
}, {
  marketType: "binary",
  _description: "Will Ethereum trade at $400 or higher by midnight EST on November 30, 2018?",
  _endTime: parseInt(new Date("12/1/2018").getTime() / 1000, 10),
  _topic: "trading",
  _extraInfo: {
    resolutionSource: "http://coinmarketcap.com",
    tags: ["trading", "Ethereum", "currencies"],
    longDescription: "http://coinmarketcap.com/currencies/ethereum",
  },
  orderBook: binaryOrderBook,
}, {
  marketType: "binary",
  _description: "Will the Larsen B ice shelf collapse by November 1, 2018?",
  _endTime: parseInt(new Date("11-2-2018").getTime() / 1000, 10),
  _topic: "climate",
  _extraInfo: {
    resolutionSource: "",
    tags: ["Antarctica", "warming"],
  },
  orderBook: binaryOrderBook,
}, {
  marketType: "binary",
  _description: "Will the Golden State Warriors win the 2018 NBA Championship?",
  _endTime: parseInt(new Date("6-20-2018").getTime() / 1000, 10),
  _topic: "sports",
  _extraInfo: {
    resolutionSource: "ESPN",
    tags: ["basketball", "Warriors"],
    longDescription: "",
  },
  orderBook: binaryOrderBook,
}, {
  marketType: "binary",
  _description: "Will antibiotics be outlawed for agricultural use in China by the end of 2020?",
  _endTime: parseInt(new Date("1-1-2021").getTime() / 1000, 10),
  _topic: "agriculture",
  _extraInfo: {
    tags: ["antibiotics", "China"],
    longDescription: "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?",
  },
  orderBook: binaryOrderBook,
}, {
  marketType: "scalar",
  _description: "High temperature (in degrees Fahrenheit) on " + today.toLocaleDateString() + " at the San Francisco International Airport, as reported by Weather Underground",
  _endTime: parseInt(midnightTomorrow.getTime() / 1000, 10),
  _minPrice: "-10",
  _maxPrice: "120",
  tickSize: "0.1",
  _topic: "temperature",
  _extraInfo: {
    resolutionSource: "https://www.wunderground.com/history/airport/KSFO/" + [today.getUTCFullYear(), today.getUTCMonth() + 1, today.getUTCDate()].join("/") + "/DailyHistory.html",
    tags: ["weather", "SFO"],
    longDescription: "https://www.penny-arcade.com/comic/2001/12/12",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "0.01", price: "20" },
        { shares: "0.01", price: "0" },
        { shares: "0.02", price: "-5" },
      ],
    },
    sell: {
      "0": [
        { shares: "0.02", price: "25" },
        { shares: "0.01", price: "50" },
        { shares: "0.01", price: "51" },
      ],
    },
  },
}, {
  marketType: "scalar",
  _description: "High temperature (in degrees Fahrenheit) in San Francisco, California, on July 1, 2018",
  _endTime: parseInt(new Date("7-2-2018").getTime() / 1000, 10),
  _minPrice: "-10",
  _maxPrice: "120",
  tickSize: "10",
  _topic: "temperature",
  _extraInfo: {
    resolutionSource: "http://forecast.weather.gov",
    tags: ["San Francisco", "weather"],
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "0.01", price: "20" },
        { shares: "0.02", price: "0" },
        { shares: "0.03", price: "-5" },
      ],
    },
    sell: {
      "0": [
        { shares: "0.01", price: "25" },
        { shares: "0.01", price: "50" },
        { shares: "0.005", price: "100" },
      ],
    },
  },
}, {
  marketType: "scalar",
  _description: "Marine species extinctions between January 1, 2016 and January 1, 2018",
  _endTime: parseInt(new Date("1-2-2018").getTime() / 1000, 10),
  _minPrice: "0",
  _maxPrice: "10000",
  tickSize: "500",
  _numOutcomes: 2,
  _topic: "science",
  _extraInfo: {
    resolutionSource: "science!",
    tags: ["extinction", "marine biology"],
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "0.01", price: "200" },
        { shares: "0.02", price: "100" },
        { shares: "0.05", price: "10" },
      ],
    },
    sell: {
      "0": [
        { shares: "0.02", price: "250" },
        { shares: "0.01", price: "350" },
        { shares: "0.005", price: "450" },
      ],
    },
  },
}, {
  marketType: "scalar",
  _description: "Average tropospheric methane concentration (in parts-per-billion) between January 1, 2018 and January 1, 2019",
  _endTime: parseInt(new Date("1-2-2019").getTime() / 1000, 10),
  _minPrice: "700",
  _maxPrice: "5000",
  tickSize: "100",
  _topic: "science",
  _extraInfo: {
    resolutionSource: "EPA",
    tags: ["climate", "atmosphere"],
    longDescription: "Vast quantities of methane are normally locked into the Earth's crust on the continental plateaus in one of the many deposits consisting of compounds of methane hydrate, a solid precipitated combination of methane and water much like ice. Because the methane hydrates are unstable, except at cool temperatures and high (deep) pressures, scientists have observed smaller \"burps\" due to tectonic events. Studies suggest the huge release of natural gas could be a major climatological trigger, methane itself being a greenhouse gas many times more powerful than carbon dioxide. References: https://en.wikipedia.org/wiki/Anoxic_event, https://en.wikipedia.org/wiki/Atmospheric_methane, https://en.wikipedia.org/wiki/Clathrate_gun_hypothesis",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "0.005", price: "1000" },
        { shares: "0.02", price: "900" },
        { shares: "0.03", price: "775" },
      ],
    },
    sell: {
      "0": [
        { shares: "0.01", price: "1050" },
        { shares: "0.005", price: "1250" },
        { shares: "0.0025", price: "1500" },
      ],
    },
  },
}, {
  marketType: "scalar",
  _description: "New antibiotics approved by the FDA between March 1, 2016 and the end of 2020",
  _endTime: parseInt(new Date("1-1-2021").getTime() / 1000, 10),
  _minPrice: "0",
  _maxPrice: "30",
  tickSize: "1",
  _numOutcomes: 2,
  _topic: "medicine",
  _extraInfo: {
    resolutionSource: "FDA",
    tags: ["science", "antibiotics"],
    longDescription: "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "0.05", price: "2" },
        { shares: "0.02", price: "18" },
        { shares: "0.01", price: "15" },
      ],
    },
    sell: {
      "0": [
        { shares: "0.02", price: "23" },
        { shares: "0.01", price: "26" },
        { shares: "0.01", price: "29" },
      ],
    },
  },
}, {
  marketType: "categorical",
  _description: "Who will win the University of Georgia vs. University of Florida football game in 2018?",
  _endTime: parseInt(new Date("10/30/2018").getTime() / 1000, 10),
  _numOutcomes: 2,
  _topic: "sports",
  _extraInfo: {
    resolutionSource: "",
    tags: ["college football", "football"],
    outcomeNames: ["Georgia", "Florida"],
    longDescription: "",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "0.10", price: "0.2" },
        { shares: "0.20", price: "0.18" },
        { shares: "0.30", price: "0.15" },
      ],
      "1": [
        { shares: "0.30", price: "0.48" },
        { shares: "0.15", price: "0.45" },
        { shares: "0.20", price: "0.41" },
      ],
    },
    sell: {
      "0": [
        { shares: "0.15", price: "0.23" },
        { shares: "0.10", price: "0.26" },
        { shares: "0.30", price: "0.29" },
      ],
      "1": [
        { shares: "0.15", price: "0.53" },
        { shares: "0.20", price: "0.57" },
        { shares: "0.25", price: "0.61" },
      ],
    },
  },
}, {
  marketType: "categorical",
  _description: "What will be the status of the U.S. electoral college on January 1, 2020?",
  _endTime: parseInt(new Date("1/2/2020").getTime() / 1000, 10),
  _numOutcomes: 3,
  _topic: "politics",
  _extraInfo: {
    resolutionSource: "",
    tags: ["elections", "US politics"],
    outcomeNames: ["Unchanged from 2016", "Undermined but still in existence (e.g., National Popular Vote bill)", "Formally abolished"],
    longDescription: "The National Popular Vote bill would guarantee the Presidency to the candidate who receives the most popular votes nationwide (i.e., all 50 states and the District of Columbia).  It has been enacted into law in 11 states with 165 electoral votes, and will take effect when enacted by states with 105 more electoral votes. The bill has passed one chamber in 12 additional states with 96 electoral votes.   Most recently, the bill was passed by a bipartisan 40–16 vote in the Republican-controlled Arizona House, 28–18 in Republican-controlled Oklahoma Senate, 57–4 in Republican-controlled New York Senate, and 37–21 in Democratic-controlled Oregon House. http://www.nationalpopularvote.com",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "0.10", price: "0.2" },
        { shares: "0.20", price: "0.18" },
        { shares: "0.30", price: "0.15" },
      ],
      "1": [
        { shares: "0.30", price: "0.48" },
        { shares: "0.15", price: "0.45" },
        { shares: "0.20", price: "0.41" },
      ],
      "2": [
        { shares: "0.15", price: "0.18" },
        { shares: "0.25", price: "0.15" },
        { shares: "0.20", price: "0.12" },
      ],
    },
    sell: {
      "0": [
        { shares: "0.15", price: "0.23" },
        { shares: "0.10", price: "0.26" },
        { shares: "0.30", price: "0.29" },
      ],
      "1": [
        { shares: "0.15", price: "0.53" },
        { shares: "0.20", price: "0.57" },
        { shares: "0.25", price: "0.61" },
      ],
      "2": [
        { shares: "0.10", price: "0.21" },
        { shares: "0.10", price: "0.24" },
        { shares: "0.20", price: "0.27" },
      ],
    },
  },
}, {
  marketType: "categorical",
  _description: "What will be the number one killer in the United States by January 1, 2025?",
  _endTime: parseInt(new Date("1-2-2025").getTime() / 1000, 10),
  _numOutcomes: 6,
  _topic: "science",
  _extraInfo: {
    resolutionSource: "CDC",
    tags: ["mortality", "United States"],
    outcomeNames: ["cancer", "heart attacks", "infectious diseases", "starvation", "lava", "other"],
    longDescription: "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?",
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "0.10", price: "0.2" },
        { shares: "0.20", price: "0.18" },
        { shares: "0.30", price: "0.15" },
      ],
      "1": [
        { shares: "0.30", price: "0.48" },
        { shares: "0.15", price: "0.45" },
        { shares: "0.20", price: "0.41" },
      ],
      "2": [
        { shares: "0.15", price: "0.18" },
        { shares: "0.25", price: "0.15" },
        { shares: "0.20", price: "0.12" },
      ],
      "3": [
        { shares: "0.10", price: "0.13" },
        { shares: "0.15", price: "0.1" },
        { shares: "0.20", price: "0.08" },
      ],
      "4": [
        { shares: "0.10", price: "0.2" },
        { shares: "0.20", price: "0.18" },
        { shares: "0.30", price: "0.15" },
      ],
      "5": [
        { shares: "0.10", price: "0.2" },
        { shares: "0.20", price: "0.18" },
        { shares: "0.30", price: "0.15" },
      ],
    },
    sell: {
      "0": [
        { shares: "0.15", price: "0.23" },
        { shares: "0.10", price: "0.26" },
        { shares: "0.30", price: "0.29" },
      ],
      "1": [
        { shares: "0.15", price: "0.53" },
        { shares: "0.20", price: "0.57" },
        { shares: "0.25", price: "0.61" },
      ],
      "2": [
        { shares: "0.10", price: "0.21" },
        { shares: "0.10", price: "0.24" },
        { shares: "0.20", price: "0.27" },
      ],
      "3": [
        { shares: "0.15", price: "0.17" },
        { shares: "0.25", price: "0.2" },
        { shares: "0.15", price: "0.23" },
      ],
      "4": [
        { shares: "0.15", price: "0.23" },
        { shares: "0.10", price: "0.26" },
        { shares: "0.30", price: "0.29" },
      ],
      "5": [
        { shares: "0.15", price: "0.23" },
        { shares: "0.10", price: "0.26" },
        { shares: "0.30", price: "0.29" },
      ],
    },
  },
}, {
  marketType: "categorical",
  _description: "Which city will have the highest median single-family home price for September 2018?",
  _endTime: parseInt(new Date("10-2-2018").getTime() / 1000, 10),
  _numOutcomes: 8,
  _topic: "housing",
  _extraInfo: {
    tags: ["economy", "bubble"],
    outcomeNames: ["London", "New York", "Los Angeles", "San Francisco", "Tokyo", "Palo Alto", "Hong Kong", "other"],
  },
  orderBook: {
    buy: {
      "0": [
        { shares: "0.10", price: "0.2" },
        { shares: "0.20", price: "0.18" },
        { shares: "0.30", price: "0.15" },
      ],
      "1": [
        { shares: "0.30", price: "0.48" },
        { shares: "0.15", price: "0.45" },
        { shares: "0.20", price: "0.41" },
      ],
      "2": [
        { shares: "0.15", price: "0.18" },
        { shares: "0.25", price: "0.15" },
        { shares: "0.20", price: "0.12" },
      ],
      "3": [
        { shares: "0.10", price: "0.13" },
        { shares: "0.15", price: "0.1" },
        { shares: "0.20", price: "0.08" },
      ],
      "4": [
        { shares: "0.10", price: "0.2" },
        { shares: "0.20", price: "0.18" },
        { shares: "0.30", price: "0.15" },
      ],
      "5": [
        { shares: "0.10", price: "0.2" },
        { shares: "0.20", price: "0.18" },
        { shares: "0.30", price: "0.15" },
      ],
      "6": [
        { shares: "0.10", price: "0.13" },
        { shares: "0.15", price: "0.1" },
        { shares: "0.20", price: "0.08" },
      ],
      "7": [
        { shares: "0.10", price: "0.13" },
        { shares: "0.15", price: "0.1" },
        { shares: "0.20", price: "0.08" },
      ],
    },
    sell: {
      "0": [
        { shares: "0.15", price: "0.23" },
        { shares: "0.10", price: "0.26" },
        { shares: "0.30", price: "0.29" },
      ],
      "1": [
        { shares: "0.15", price: "0.53" },
        { shares: "0.20", price: "0.57" },
        { shares: "0.25", price: "0.61" },
      ],
      "2": [
        { shares: "0.10", price: "0.21" },
        { shares: "0.10", price: "0.24" },
        { shares: "0.20", price: "0.27" },
      ],
      "3": [
        { shares: "0.15", price: "0.17" },
        { shares: "0.25", price: "0.2" },
        { shares: "0.15", price: "0.23" },
      ],
      "4": [
        { shares: "0.15", price: "0.23" },
        { shares: "0.10", price: "0.26" },
        { shares: "0.30", price: "0.29" },
      ],
      "5": [
        { shares: "0.15", price: "0.23" },
        { shares: "0.10", price: "0.26" },
        { shares: "0.30", price: "0.29" },
      ],
      "6": [
        { shares: "0.15", price: "0.17" },
        { shares: "0.25", price: "0.2" },
        { shares: "0.15", price: "0.23" },
      ],
      "7": [
        { shares: "0.15", price: "0.17" },
        { shares: "0.25", price: "0.2" },
        { shares: "0.15", price: "0.23" },
      ],
    },
  },
}];
