import { formatBytes32String } from "ethers/utils";
import {
  today, thisYear,
  inOneMonths, inTwoMonths, inThreeMonths, inFourMonths, inFiveMonths, inSixMonths,
  closingBellTomorrow,
  midnightTomorrow,
} from "../time";

interface AskBid {
  shares: string;
  price: string;
}

interface BuySell {
  buy: AskBid[];
  sell: AskBid[];
}

export interface OrderBook {
  [outcome: string]: BuySell;
}

const singleOutcomeAsks: AskBid[] = [
  { shares: "10.01", price: "0.31" },
  { shares: "20.02", price: "0.35" },
  { shares: "30.03", price: "0.40" },
];
const singleOutcomeBids: AskBid[] = [
  { shares: "10.01", price: "0.28" },
  { shares: "20.02", price: "0.25" },
  { shares: "30.03", price: "0.19" },
];
const yesNoOrderBook: OrderBook = {
  2: {
    buy: singleOutcomeBids,
    sell: singleOutcomeAsks,
  },
};

export interface ExtraInfo {
  categories: string[];
  resolutionSource?: string;
  backupSource?: string;
  description: string;
  tags: string[];
  longDescription?: string;
  _scalarDenomination?: string;
}
export interface CannedMarket {
  marketType: string;
  endTime: number;
  minPrice?: string;
  maxPrice?: string;
  tickSize?: string;
  outcomes?: string[];
  affiliateFeeDivisor: number;
  extraInfo: ExtraInfo;
  orderBook: OrderBook;
}

function massageMarkets(markets: CannedMarket[]): CannedMarket[] {
  return markets.map((market): CannedMarket => {
    if (market.outcomes) {
      market.outcomes = market.outcomes.map(formatBytes32String);
    }
    return market;
  });
}

export const cannedMarkets: CannedMarket[] = massageMarkets([
  {
    marketType: "yesNo",
    endTime: inOneMonths.getTime() / 1000,
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["space"],
      description:
        "Will SpaceX successfully complete a manned flight to the International Space Station by the end of " +
        thisYear +
        "?",
      resolutionSource: "http://www.spacex.com",
      tags: ["SpaceX", "spaceflight"],
      longDescription: "",
    },
    orderBook: yesNoOrderBook,
  },
  {
    marketType: "yesNo",
    endTime: inOneMonths.getTime() / 1000,
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["space"],
      description:
        "Will SpaceX successfully complete a manned flight beyond Earth orbit by " +
        inOneMonths.toDateString() +
        "?",
      resolutionSource: "http://www.spacex.com",
      tags: ["SpaceX", "spaceflight"],
      longDescription: "",
    },
    orderBook: yesNoOrderBook,
  },
  {
    marketType: "yesNo",
    endTime: inTwoMonths.getTime() / 1000,
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["space"],
      description:
        "Will SpaceX successfully complete a Mars landing (manned or unmanned) by " +
        inTwoMonths.toDateString() +
        "?",
      resolutionSource: "http://www.spacex.com",
      tags: ["SpaceX", "spaceflight"],
      longDescription: "",
    },
    orderBook: yesNoOrderBook,
  },
  {
    marketType: "yesNo",
    endTime: inTwoMonths.getTime() / 1000,
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["politics"],
      description:
        "Will California secede from the United States before, " +
        inTwoMonths.toDateString() +
        "?",
      resolutionSource: "",
      tags: ["California", "Calexit"],
      longDescription:
        "In the Spring of 2019, Californians will go to the polls in a historic vote to decide by referendum if California should exit the Union, a #Calexit vote. http://www.yescalifornia.org",
    },
    orderBook: yesNoOrderBook,
  },
  {
    marketType: "yesNo",
    endTime: closingBellTomorrow.getTime() / 1000,
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["finance", "dow jones industrial average"],
      description:
        "Will the Dow Jones Industrial Average close at a higher price on " +
        closingBellTomorrow.toDateString() +
        " than it closed at the previous day?",
      resolutionSource: "https://www.google.com/finance?q=INDEXDJX:.DJI",
      tags: ["stocks", "Dow Jones"],
      longDescription:
        "The Daily Dow market lives again! https://en.wikipedia.org/wiki/Dow_Jones_Industrial_Average",
    },
    orderBook: yesNoOrderBook,
  },
  {
    marketType: "yesNo",
    endTime: inThreeMonths.getTime() / 1000,
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["augur"],
      description:
        "Will Augur's live release happen by " +
        inThreeMonths.toDateString() +
        "?",
      resolutionSource: "https://augur.net",
      tags: ["release date", "Ethereum"],
      longDescription: "",
    },
    orderBook: yesNoOrderBook,
  },
  {
    marketType: "yesNo",
    endTime: inThreeMonths.getTime() / 1000,
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["politics"],
      description:
        "Will Jair Messias Bolsonaro be elected the president of Brazil in " +
        inThreeMonths.toDateString() +
        "?",
      resolutionSource: "",
      tags: ["elections", "Brazil"],
      longDescription: "",
    },
    orderBook: yesNoOrderBook,
  },
  {
    marketType: "yesNo",
    endTime: inFourMonths.getTime() / 1000,
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["crypto", "ethereum"],
      description:
        "Will Ethereum trade at $2000 or higher at any time before the end of " +
        inFourMonths.toDateString() +
        "?",
      resolutionSource: "https://api.coinmarketcap.com/v1/ticker/ethereum",
      tags: ["Ethereum", "trading"],
      longDescription: "http://coinmarketcap.com/currencies/ethereum",
    },
    orderBook: yesNoOrderBook,
  },
  {
    marketType: "yesNo",
    endTime: inFourMonths.getTime() / 1000,
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["climate"],
      description:
        "Will the Larsen B ice shelf collapse by " +
        inFourMonths.toDateString() +
        "?",
      resolutionSource: "",
      tags: ["Antarctica", "warming"],
    },
    orderBook: yesNoOrderBook,
  },
  {
    marketType: "yesNo",
    endTime: inFiveMonths.getTime() / 1000,
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["sports", "golden state warriors"],
      description:
        "Will the Golden State Warriors win the Championship on " +
        inFiveMonths.toDateString() +
        "?",
      resolutionSource: "ESPN",
      tags: ["basketball", "Warriors"],
      longDescription: "",
    },
    orderBook: yesNoOrderBook,
  },
  {
    marketType: "yesNo",
    endTime: inFiveMonths.getTime() / 1000,
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["agriculture"],
      description:
        "Will antibiotics be outlawed for agricultural use in China by " +
        inFiveMonths.toDateString() +
        "?",
      tags: ["antibiotics", "China"],
      longDescription:
        "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?",
    },
    orderBook: yesNoOrderBook,
  },
  {
    marketType: "scalar",
    endTime: midnightTomorrow.getTime() / 1000,
    minPrice: "-10",
    maxPrice: "120",
    tickSize: "0.1",
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["temperature"],
      description:
        `High temperature (in degrees Fahrenheit) on ${today.toDateString()} at the San Francisco International Airport, as reported by Weather Underground`,
      resolutionSource:
        "https://www.wunderground.com/history/airport/KSFO/" +
        [
          today.getUTCFullYear(),
          today.getUTCMonth() + 1,
          today.getUTCDate(),
        ].join("/") +
        "/DailyHistory.html",
      tags: ["weather", "SFO"],
      longDescription: "https://www.penny-arcade.com/comic/2001/12/12",
      _scalarDenomination: "degrees Fahrenheit",
    },
    orderBook: {
      2: {
        buy: [
          { shares: "10.01", price: "20" },
          { shares: "20.01", price: "0" },
          { shares: "3.01", price: "-5" },
        ],
        sell: [
          { shares: "10.01", price: "25" },
          { shares: "20.01", price: "50" },
          { shares: "30.01", price: "51" },
        ],
      },
    },
  },
  {
    marketType: "scalar",
    endTime: inFiveMonths.getTime() / 1000,
    minPrice: "600",
    maxPrice: "5000",
    tickSize: ".01",
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["science"],
      description:
        "Average tropospheric methane concentration (in parts-per-billion) on " +
      inFiveMonths.toDateString(),
      resolutionSource: "https://www.esrl.noaa.gov/gmd/ccgg/trends_ch4",
      tags: ["climate", "atmosphere"],
      longDescription:
        'Vast quantities of methane are normally locked into the Earth\'s crust on the continental plateaus in one of the many deposits consisting of compounds of methane hydrate, a solid precipitated combination of methane and water much like ice. Because the methane hydrates are unstable, except at cool temperatures and high (deep) pressures, scientists have observed smaller "burps" due to tectonic events. Studies suggest the huge release of natural gas could be a major climatological trigger, methane itself being a greenhouse gas many times more powerful than carbon dioxide. References: https://en.wikipedia.org/wiki/Anoxic_event, https://en.wikipedia.org/wiki/Atmospheric_methane, https://en.wikipedia.org/wiki/Clathrate_gun_hypothesis',
      _scalarDenomination: "parts-per-billion",
    },
    orderBook: {},
  },
  {
    marketType: "scalar",
    endTime: inSixMonths.getTime() / 1000,
    minPrice: "0",
    maxPrice: "30",
    tickSize: "1",
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["medicine"],
      description:
        "New antibiotics approved by the FDA on " + inSixMonths.toDateString(),
      resolutionSource:
        "https://www.centerwatch.com/drug-information/fda-approved-drugs/year/" +
        thisYear,
      tags: ["science", "antibiotics"],
      longDescription:
        "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?",
    },
    orderBook: {
      2: {
        buy: [
          { shares: "10.01", price: "2" },
          { shares: "20.01", price: "18" },
          { shares: "30.01", price: "15" },
        ],
        sell: [
          { shares: "10.01", price: "23" },
          { shares: "20.01", price: "26" },
          { shares: "30.01", price: "29" },
        ],
      },
    },
  },
  {
    marketType: "scalar",
    endTime: midnightTomorrow.getTime() / 1000,
    minPrice: "0",
    maxPrice: "10000",
    tickSize: "1",
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["crypto"],
      description:
        "Millions of Tether tokens issued on " +
        today.toDateString() +
        " (round down)",
      resolutionSource:
        "http://omnichest.info/lookupadd.aspx?address=3MbYQMMmSkC3AgWkj9FMo5LsPTW1zBTwXL",
      tags: ["Tether", "trading"],
      longDescription:
        "The curious tale of Tethers: https://hackernoon.com/the-curious-tale-of-tethers-6b0031eead87",
      _scalarDenomination: "million Tethers",
    },
    orderBook: {
      2: {
        buy: [
            { shares: "10.01", price: "100" },
            { shares: "20.01", price: "150" },
            { shares: "30.01", price: "200" },
        ],
        sell: [
            { shares: "10.01", price: "225" },
            { shares: "20.01", price: "250" },
            { shares: "30.01", price: "300" },
        ],
      },
    },
  },
  {
    marketType: "categorical",
    endTime: midnightTomorrow.getTime() / 1000,
    outcomes: ["Georgia", "Florida"],
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["sports", "football", "college football"],
      description:
        "Who will win the University of Georgia vs. University of Florida football game on " +
        midnightTomorrow.toDateString() +
        "?",
      resolutionSource: "http://www.mcubed.net/ncaaf/series/fla/ga.shtml",
      tags: ["college football", "football"],
      longDescription:
        "The Florida–Georgia football rivalry is an American college football rivalry game played annually by the University of Florida Gators and the University of Georgia Bulldogs. https://en.wikipedia.org/wiki/Florida%E2%80%93Georgia_football_rivalry",
    },
    orderBook: {
      1: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      2: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
    },
  },
  {
    marketType: "categorical",
    endTime: midnightTomorrow.getTime() / 1000,
    outcomes: [
      "Unchanged from 2016",
      "Existing, but changed from 2016",
      "Formally abolished",
    ],
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["politics"],
      description:
        "What will be the status of the U.S. electoral college on " +
        midnightTomorrow.toDateString() +
        "?",
      resolutionSource: "",
      tags: ["elections", "US politics"],
      longDescription:
        "The National Popular Vote bill would guarantee the Presidency to the candidate who receives the most popular votes nationwide (i.e., all 50 states and the District of Columbia). http://www.nationalpopularvote.com",
    },
    orderBook: {},
  },
  {
    marketType: "categorical",
    endTime: inOneMonths.getTime() / 1000,
    outcomes: [
      "cancer",
      "heart attacks",
      "infectious diseases",
      "starvation",
      "lava",
      "other",
    ],
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["science"],
      description:
        "What will be the number one killer in the United States by " +
        inOneMonths.toDateString() +
        "?",
      resolutionSource: "https://www.cdc.gov/nchs/nvss/deaths.htm",
      tags: ["mortality", "United States"],
    },
    orderBook: {
      1: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      2: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      3: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      4: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      5: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      6: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
    },
  },
  {
    marketType: "categorical",
    endTime: inOneMonths.getTime() / 1000,
    outcomes: [
      "London",
      "New York",
      "Los Angeles",
      "San Francisco",
      "Tokyo",
      "Palo Alto",
      "Hong Kong",
    ],
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["housing"],
      description:
        "Which city will have the lowest median single-family home price on " +
        inOneMonths.toDateString() +
        "?",
      resolutionSource: "http://www.demographia.com",
      tags: ["economy", "bubble"],
    },
    orderBook: {
      1: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      2: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      3: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      4: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      5: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      6: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      7: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
    },
  },
  {
    marketType: "categorical",
    endTime: inTwoMonths.getTime() / 1000,
    outcomes: [
      "London",
      "New York",
      "Los Angeles",
      "San Francisco",
      "Tokyo",
      "Palo Alto",
      "Hong Kong",
    ],
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["housing"],
      description:
        "Which city will have the highest median single-family home price on " +
        inTwoMonths.toDateString() +
        "?",
      resolutionSource: "http://www.demographia.com",
      tags: ["economy", "bubble"],
    },
    orderBook: {
      1: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      2: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      3: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      4: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      5: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      6: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      7: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
    },
  },
]);
