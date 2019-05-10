import { OrderBook, singleOutcomeAsks, singleOutcomeBids, yesNoOrderBook } from "./yes-no-order-book";

function daysInMonth(month:number, year:number) {
  return new Date(year, month, 0).getDate();
}

function addMonths(date:Date, months:number) {
  const target_month = date.getMonth() + months;
  const year = date.getFullYear() + (target_month / 12);
  const month = target_month % 12;
  const day = date.getDate();
  const last_day = daysInMonth(year, month);

  return new Date(year, month, (day > last_day) ? last_day : day);
}

const midnightTomorrow = new Date();
midnightTomorrow.setDate(midnightTomorrow.getDate() + 1);
midnightTomorrow.setHours(0, 0, 0, 0);
const closingBellTomorrow = new Date();
closingBellTomorrow.setDate(closingBellTomorrow.getDate() + 1);
closingBellTomorrow.setHours(20, 0, 0, 0);
const today = new Date();
// needs to be less than 90 days. todo: update when contracts allow for 6 months
today.setDate(today.getDate() - 3);
const inOneMonths = addMonths(today, 1);
const inTwoMonths = addMonths(today, 2);
const inThreeMonths = addMonths(today, 3);
const inFourMonths = addMonths(today, 1);
const inFiveMonths = addMonths(today, 2);
const inSixMonths = addMonths(today, 3);
const thisYear = today.getUTCFullYear();


interface BaseMarketData {

  _endTime: number;
  _affiliateFeeDivisor: number;
  _topic: string;
  _extraInfo: {
    description: string;
    longDescription?: string;
    resolutionSource?: string;
    _scalarDenomination?: string;
    tags?: string[]
  };
  orderBook?: OrderBook;

}

interface CategoricalMarket extends BaseMarketData {
  marketType: "categorical",
  _outcomes: Array<string>;
}

interface ScalarMarket extends BaseMarketData {
  marketType: "scalar";
  _minPrice: string;
  _maxPrice: string;
  _numTicks: string;
}

interface BinaryMarket extends BaseMarketData {
  marketType: "yesNo";
}

export type MarketData = CategoricalMarket | ScalarMarket | BinaryMarket;

export const cannedMarketsData:Array<MarketData> = [
  {
    marketType: "yesNo",
    _endTime: inOneMonths.getTime() / 1000,
    _affiliateFeeDivisor: 4,
    _topic: "space",
    _extraInfo: {
      description:
        "Will SpaceX successfully complete a manned flight to the International Space Station by the end of " +
        thisYear +
        "?",
      resolutionSource: "http://www.spacex.com",
      tags: ["SpaceX", "spaceflight"],
      longDescription: ""
    }
  },
  {
    marketType: "yesNo",

    _endTime: inOneMonths.getTime() / 1000,
    _affiliateFeeDivisor: 4,
    _topic: "space",
    _extraInfo: {
      description:
        "Will SpaceX successfully complete a manned flight beyond Earth orbit by " +
        inOneMonths.toDateString() +
        "?",
      resolutionSource: "http://www.spacex.com",
      tags: ["SpaceX", "spaceflight"],
      longDescription: ""
    }
  },
  {
    marketType: "yesNo",
    _endTime: inTwoMonths.getTime() / 1000,
    _affiliateFeeDivisor: 4,
    _topic: "space",
    _extraInfo: {
      description:
        "Will SpaceX successfully complete a Mars landing (manned or unmanned) by " +
        inTwoMonths.toDateString() +
        "?",
      resolutionSource: "http://www.spacex.com",
      tags: ["SpaceX", "spaceflight"],
      longDescription: ""
    },
    orderBook: yesNoOrderBook
  },
  {
    marketType: "yesNo",

    _endTime: inTwoMonths.getTime() / 1000,
    _affiliateFeeDivisor: 4,
    _topic: "politics",
    _extraInfo: {
      description:
        "Will California secede from the United States before, " +
        inTwoMonths.toDateString() +
        "?",
      resolutionSource: "",
      tags: ["California", "Calexit"],
      longDescription:
        "In the Spring of 2019, Californians will go to the polls in a historic vote to decide by referendum if California should exit the Union, a #Calexit vote. http://www.yescalifornia.org"
    },
    orderBook: yesNoOrderBook
  },
  {
    marketType: "yesNo",
    _endTime: closingBellTomorrow.getTime() / 1000,
    _affiliateFeeDivisor: 4,
    _topic: "finance",
    _extraInfo: {
  description:
    "Will the Dow Jones Industrial Average close at a higher price on " +
    closingBellTomorrow.toDateString() +
    " than it closed at the previous day?",
      resolutionSource: "https://www.google.com/finance?q=INDEXDJX:.DJI",
      tags: ["stocks", "Dow Jones"],
      longDescription:
        "The Daily Dow market lives again! https://en.wikipedia.org/wiki/Dow_Jones_Industrial_Average"
    },
    orderBook: yesNoOrderBook
  },
  {
    marketType: "yesNo",
    _endTime: inThreeMonths.getTime() / 1000,
    _affiliateFeeDivisor: 4,
    _topic: "Augur",
    _extraInfo: {
      description:
        "Will Augur's live release happen by " +
        inThreeMonths.toDateString() +
        "?",
      resolutionSource: "https://augur.net",
      tags: ["release date", "Ethereum"],
      longDescription: ""
    },
    orderBook: yesNoOrderBook
  },
  {
    marketType: "yesNo",

    _endTime: inThreeMonths.getTime() / 1000,
    _affiliateFeeDivisor: 4,
    _topic: "politics",
    _extraInfo: {
      description:
        "Will Jair Messias Bolsonaro be elected the president of Brazil in " +
        inThreeMonths.toDateString() +
        "?",
      resolutionSource: "",
      tags: ["elections", "Brazil"],
      longDescription: ""
    },
    orderBook: yesNoOrderBook
  },
  {
    marketType: "yesNo",
    _endTime: inFourMonths.getTime() / 1000,
    _affiliateFeeDivisor: 4,
    _topic: "crypto",
    _extraInfo: {
      description:
        "Will Ethereum trade at $2000 or higher at any time before the end of " +
        inFourMonths.toDateString() +
        "?",
      resolutionSource: "https://api.coinmarketcap.com/v1/ticker/ethereum",
      tags: ["Ethereum", "trading"],
      longDescription: "http://coinmarketcap.com/currencies/ethereum"
    },
    orderBook: yesNoOrderBook
  },
  {
    marketType: "yesNo",
    _endTime: inFourMonths.getTime() / 1000,
    _affiliateFeeDivisor: 4,
    _topic: "climate",
    _extraInfo: {
      description:
        "Will the Larsen B ice shelf collapse by " +
        inFourMonths.toDateString() +
        "?",
      resolutionSource: "",
      tags: ["Antarctica", "warming"]
    },
    orderBook: yesNoOrderBook
  },
  {
    marketType: "yesNo",
    _endTime: inFiveMonths.getTime() / 1000,
    _affiliateFeeDivisor: 4,
    _topic: "sports",
    _extraInfo: {
      description:
        "Will the Golden State Warriors win the Championship on " +
        inFiveMonths.toDateString() +
        "?",
      resolutionSource: "ESPN",
      tags: ["basketball", "Warriors"],
      longDescription: ""
    },
    orderBook: yesNoOrderBook
  },
  {
    marketType: "yesNo",
    _endTime: inFiveMonths.getTime() / 1000,
    _affiliateFeeDivisor: 4,
    _topic: "agriculture",
    _extraInfo: {
      description:
        "Will antibiotics be outlawed for agricultural use in China by " +
        inFiveMonths.toDateString() +
        "?",
      tags: ["antibiotics", "China"],
      longDescription:
        "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?"
    },
    orderBook: yesNoOrderBook
  },
  {
    marketType: "scalar",
    _endTime: midnightTomorrow.getTime() / 1000,
    _minPrice: "-1000000000000000000",
    _maxPrice: "12000000000000000000",
    _numTicks: "1000",
    _affiliateFeeDivisor: 4,
    _topic: "temperature",
    _extraInfo: {
      description:
        "High temperature (in degrees Fahrenheit) on " +
        today.toDateString() +
        " at the San Francisco International Airport, as reported by Weather Underground",
      resolutionSource:
        "https://www.wunderground.com/history/airport/KSFO/" +
        [
          today.getUTCFullYear(),
          today.getUTCMonth() + 1,
          today.getUTCDate()
        ].join("/") +
        "/DailyHistory.html",
      tags: ["weather", "SFO"],
      longDescription: "https://www.penny-arcade.com/comic/2001/12/12",
      _scalarDenomination: "degrees Fahrenheit"
    },
    orderBook: {
      buy: {
        "1": [
          { shares: "0.001", price: "20" },
          { shares: "0.001", price: "0" },
          { shares: "0.001", price: "-5" }
        ]
      },
      sell: {
        "1": [
          { shares: "0.001", price: "25" },
          { shares: "0.001", price: "50" },
          { shares: "0.001", price: "51" }
        ]
      }
    }
  },
  {
    marketType: "scalar",
    _endTime: inFiveMonths.getTime() / 1000,
    _minPrice: "60000000000000000000",
    _maxPrice: "500000000000000000000",
    _numTicks: "1000",
    _affiliateFeeDivisor: 4,
    _topic: "science",
    _extraInfo: {
      description:
        "Average tropospheric methane concentration (in parts-per-billion) on " +
        inFiveMonths.toDateString(),
      resolutionSource: "https://www.esrl.noaa.gov/gmd/ccgg/trends_ch4",
      tags: ["climate", "atmosphere"],
      longDescription:
        "Vast quantities of methane are normally locked into the Earth's crust on the continental plateaus in one of the many deposits consisting of compounds of methane hydrate, a solid precipitated combination of methane and water much like ice. Because the methane hydrates are unstable, except at cool temperatures and high (deep) pressures, scientists have observed smaller \"burps\" due to tectonic events. Studies suggest the huge release of natural gas could be a major climatological trigger, methane itself being a greenhouse gas many times more powerful than carbon dioxide. References: https://en.wikipedia.org/wiki/Anoxic_event, https://en.wikipedia.org/wiki/Atmospheric_methane, https://en.wikipedia.org/wiki/Clathrate_gun_hypothesis",
      _scalarDenomination: "parts-per-billion"
    }
  },
  {
    marketType: "scalar",
    _endTime: inSixMonths.getTime() / 1000,
    _minPrice: "0",
    _maxPrice: "3000000000000000000",
    _numTicks: "1000",
    _affiliateFeeDivisor: 4,
    _topic: "medicine",
    _extraInfo: {
      description:
        "New antibiotics approved by the FDA on " + inSixMonths.toDateString(),
      resolutionSource:
        "https://www.centerwatch.com/drug-information/fda-approved-drugs/year/" +
        thisYear,
      tags: ["science", "antibiotics"],
      longDescription:
        "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?"
    },
    orderBook: {
      buy: {
        "1": [
          { shares: "0.001", price: "2" },
          { shares: "0.001", price: "18" },
          { shares: "0.001", price: "15" }
        ]
      },
      sell: {
        "1": [
          { shares: "0.001", price: "23" },
          { shares: "0.001", price: "26" },
          { shares: "0.001", price: "29" }
        ]
      }
    }
  },
  {
    marketType: "scalar",
    _endTime: midnightTomorrow.getTime() / 1000,
    _minPrice: "0",
    _maxPrice: "1000000000000000000000",
    _numTicks: "1000",
    _affiliateFeeDivisor: 4,
    _topic: "crypto",
    _extraInfo: {
      description:
        "Millions of Tether tokens issued on " +
        today.toDateString() +
        " (round down)",
      resolutionSource:
        "http://omnichest.info/lookupadd.aspx?address=3MbYQMMmSkC3AgWkj9FMo5LsPTW1zBTwXL",
      tags: ["Tether", "trading"],
      longDescription:
        "The curious tale of Tethers: https://hackernoon.com/the-curious-tale-of-tethers-6b0031eead87",
      _scalarDenomination: "million Tethers"
    },
    orderBook: {
      buy: {
        "1": [
          { shares: "0.0001", price: "100" },
          { shares: "0.0001", price: "150" },
          { shares: "0.0001", price: "200" }
        ]
      },
      sell: {
        "1": [
          { shares: "0.00001", price: "225" },
          { shares: "0.00001", price: "250" },
          { shares: "0.00001", price: "300" }
        ]
      }
    }
  },
  {
    marketType: "categorical",
    _endTime: midnightTomorrow.getTime() / 1000,
    _outcomes: ["Georgia", "Florida"],
    _affiliateFeeDivisor: 4,
    _topic: "sports",
    _extraInfo: {
      description:
        "Who will win the University of Georgia vs. University of Florida football game on " +
        midnightTomorrow.toDateString() +
        "?",
      resolutionSource: "http://www.mcubed.net/ncaaf/series/fla/ga.shtml",
      tags: ["college football", "football"],
      longDescription:
        "The Florida–Georgia football rivalry is an American college football rivalry game played annually by the University of Florida Gators and the University of Georgia Bulldogs. https://en.wikipedia.org/wiki/Florida%E2%80%93Georgia_football_rivalry"
    },
    orderBook: {
      buy: {
        0: singleOutcomeBids,
        1: singleOutcomeBids
      },
      sell: {
        0: singleOutcomeAsks,
        1: singleOutcomeAsks
      }
    }
  },
  {
    marketType: "categorical",
    _endTime: midnightTomorrow.getTime() / 1000,
    _outcomes: [
      "Unchanged from 2016",
      "Existing, but changed from 2016",
      "Formally abolished"
    ],
    _affiliateFeeDivisor: 4,
    _topic: "politics",
    _extraInfo: {
      description:
        "What will be the status of the U.S. electoral college on " +
        midnightTomorrow.toDateString() +
        "?",
      resolutionSource: "",
      tags: ["elections", "US politics"],
      longDescription:
        "The National Popular Vote bill would guarantee the Presidency to the candidate who receives the most popular votes nationwide (i.e., all 50 states and the District of Columbia). http://www.nationalpopularvote.com"
    }
  },
  {
    marketType: "categorical",
    _endTime: inOneMonths.getTime() / 1000,
    _outcomes: [
      "cancer",
      "heart attacks",
      "infectious diseases",
      "starvation",
      "lava",
      "other"
    ],
    _affiliateFeeDivisor: 4,
    _topic: "science",
    _extraInfo: {
      description:
        "What will be the number one killer in the United States by " +
        inOneMonths.toDateString() +
        "?",
      resolutionSource: "https://www.cdc.gov/nchs/nvss/deaths.htm",
      tags: ["mortality", "United States"]
    },
    orderBook: {
      buy: {
        0: singleOutcomeBids,
        1: singleOutcomeBids,
        2: singleOutcomeBids,
        3: singleOutcomeBids,
        4: singleOutcomeBids,
        5: singleOutcomeBids
      },
      sell: {
        0: singleOutcomeAsks,
        1: singleOutcomeAsks,
        2: singleOutcomeAsks,
        3: singleOutcomeAsks,
        4: singleOutcomeAsks,
        5: singleOutcomeAsks
      }
    }
  },
  {
    marketType: "categorical",
    _endTime: inOneMonths.getTime() / 1000,
    _outcomes: [
      "London",
      "New York",
      "Los Angeles",
      "San Francisco",
      "Tokyo",
      "Palo Alto",
      "Hong Kong"
    ],
    _affiliateFeeDivisor: 4,
    _topic: "housing",
    _extraInfo: {
      description:
        "Which city will have the lowest median single-family home price on " +
        inOneMonths.toDateString() +
        "?",
      resolutionSource: "http://www.demographia.com",
      tags: ["economy", "bubble"]
    },
    orderBook: {
      buy: {
        0: singleOutcomeBids,
        1: singleOutcomeBids,
        2: singleOutcomeBids,
        3: singleOutcomeBids,
        4: singleOutcomeBids,
        5: singleOutcomeBids,
        6: singleOutcomeBids
      },
      sell: {
        0: singleOutcomeAsks,
        1: singleOutcomeAsks,
        2: singleOutcomeAsks,
        3: singleOutcomeAsks,
        4: singleOutcomeAsks,
        5: singleOutcomeAsks,
        6: singleOutcomeAsks
      }
    }
  },
  {
    marketType: "categorical",
    _endTime: inTwoMonths.getTime() / 1000,
    _outcomes: [
      "London",
      "New York",
      "Los Angeles",
      "San Francisco",
      "Tokyo",
      "Palo Alto",
      "Hong Kong"
    ],
    _affiliateFeeDivisor: 4,
    _topic: "housing",
    _extraInfo: {
      description:
        "Which city will have the highest median single-family home price on " +
        inTwoMonths.toDateString() +
        "?",
      resolutionSource: "http://www.demographia.com",
      tags: ["economy", "bubble"]
    },
    orderBook: {
      buy: {
        0: singleOutcomeBids,
        1: singleOutcomeBids,
        2: singleOutcomeBids,
        3: singleOutcomeBids,
        4: singleOutcomeBids,
        5: singleOutcomeBids,
        6: singleOutcomeBids,
        7: singleOutcomeBids
      },
      sell: {
        0: singleOutcomeAsks,
        1: singleOutcomeAsks,
        2: singleOutcomeAsks,
        3: singleOutcomeAsks,
        4: singleOutcomeAsks,
        5: singleOutcomeAsks,
        6: singleOutcomeAsks,
        7: singleOutcomeAsks
      }
    }
  }
];
