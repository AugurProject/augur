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
  { shares: "100.01", price: "0.31" },
  { shares: "200.02", price: "0.35" },
  { shares: "300.03", price: "0.40" },
];
const singleOutcomeBids: AskBid[] = [
  { shares: "100.01", price: "0.30" },
  { shares: "200.02", price: "0.25" },
  { shares: "300.03", price: "0.19" },
];
const yesNoOrderBook: OrderBook = {
  2: {
    buy: singleOutcomeBids,
    sell: singleOutcomeAsks,
  },
};

export interface ExtraInfo {
  categories: string[];
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
        " according to http://www.spacex.com?",
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
        " according to http://www.spacex.com?",
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
        " according to http://www.spacex.com?",
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
        " than it closed at the previous day according to https://www.google.com/finance?q=INDEXDJX:.DJI?",
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
        " according to https://augur.net?",
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
        " according to https://api.coinmarketcap.com/v1/ticker/ethereum?",
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
        " according to ESPN.com?",
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
        `High temperature (in degrees Fahrenheit) on ${today.toDateString()} at the San Francisco International Airport, as reported by Weather Underground (https://www.wunderground.com/history/airport/KSFO/) `
         + [
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
          { shares: "100.01", price: "24" },
          { shares: "200.01", price: "0" },
          { shares: "300.01", price: "-5" },
        ],
        sell: [
          { shares: "100.01", price: "25" },
          { shares: "200.01", price: "50" },
          { shares: "300.01", price: "51" },
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
      inFiveMonths.toDateString() + " according to https://www.esrl.noaa.gov/gmd/ccgg/trends_ch4",
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
        "New antibiotics approved by the FDA on " + inSixMonths.toDateString() +
        " according to https://www.centerwatch.com/drug-information/fda-approved-drugs/year/" +
        thisYear,
      tags: ["science", "antibiotics"],
      longDescription:
        "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?",
    },
    orderBook: {
      2: {
        buy: [
          { shares: "100.01", price: "20" },
          { shares: "200.01", price: "18" },
          { shares: "300.01", price: "15" },
        ],
        sell: [
          { shares: "100.01", price: "21" },
          { shares: "200.01", price: "26" },
          { shares: "300.01", price: "29" },
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
        " (round down) according to http://omnichest.info/lookupadd.aspx?address=3MbYQMMmSkC3AgWkj9FMo5LsPTW1zBTwXL",
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
            { shares: "30.01", price: "220" },
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
    outcomes: ["NE Patriots", "SF 49ers", "Tie/No Winner"],
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["sports", "American Football", "NFL"],
      description:
        "Which NFL Team will win: NE Patriots vs. SF 49ers, Scheduled on " +
        midnightTomorrow.toDateString() + "?",
      tags: [],
      longDescription:
        "Include Regulation and Overtime\nAt least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as Tie/No Winner",
    },
    orderBook: {
      1: {
        buy: [
          { shares: "100.00", price: "0.50" },
          { shares: "200.00", price: "0.48" },
          { shares: "250.00", price: "0.47" },
          { shares: "150.00", price: "0.45" },
          { shares: "500.00", price: "0.43" },
        ],
        sell: [
          { shares: "500.00", price: "0.60" },
          { shares: "350.00", price: "0.56" },
          { shares: "50.00", price: "0.55" },
          { shares: "150.00", price: "0.53" },
          { shares: "200.00", price: "0.52" },
        ],
      },
      2: {
        buy: [
          { shares: "150.00", price: "0.38" },
          { shares: "200.00", price: "0.37" },
          { shares: "250.00", price: "0.35" },
          { shares: "500.00", price: "0.33" },
        ],
        sell: [
          { shares: "500.00", price: "0.45" },
          { shares: "200.00", price: "0.43" },
          { shares: "100.00", price: "0.41" },
          { shares: "150.00", price: "0.40" },
        ],
      },
      3: {
        buy: [
          { shares: "100.00", price: "0.08" },
          { shares: "200.00", price: "0.06" },
          { shares: "500.00", price: "0.05" },
        ],
        sell: [
          { shares: "150.00", price: "0.15" },
          { shares: "200.00", price: "0.20" },
        ],
      },
    },
  },
  {
    marketType: "categorical",
    endTime: midnightTomorrow.getTime() / 1000,
    outcomes: [
      "LSU Tigers",
      "Alabama Crimson Tide",
      "Cancelled/Unofficial game",
    ],
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ["Sports", "American Football", "NCAA"],
      description:
        "NCAA FB: LSU Who will win, LSU Tigers vs Alabama Crimson Tide, scheduled on " +
        midnightTomorrow.toDateString() +
        "?",
      tags: [],
      longDescription:
        "Includes Regulation and Overtime\nIf the game is not played, the market should resolve as 'NO' as Team A did NOT win vs. team B\nAt least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No'",
    },
    orderBook: {
      1: {
        buy: [
          { shares: "100.00", price: "0.54" },
          { shares: "200.00", price: "0.52" },
          { shares: "250.00", price: "0.50" },
          { shares: "150.00", price: "0.45" },
          { shares: "500.00", price: "0.42" },
        ],
        sell: [
          { shares: "200.00", price: "0.56" },
          { shares: "150.00", price: "0.57" },
          { shares: "50.00", price: "0.59" },
          { shares: "350.00", price: "0.60" },
          { shares: "500.00", price: "0.65" },
        ],
      },
      2: {
        buy: [
          { shares: "100.00", price: "0.42" },
          { shares: "150.00", price: "0.40" },
          { shares: "200.00", price: "0.37" },
          { shares: "250.00", price: "0.35" },
        ],
        sell: [
          { shares: "50.00", price: "0.45" },
          { shares: "100.00", price: "0.46" },
          { shares: "200.00", price: "0.48" },
          { shares: "500.00", price: "0.50" },
        ],
      },
      3: {
        buy: [
          { shares: "100.00", price: "0.02" },
          { shares: "500.00", price: "0.01" },
        ],
        sell: [
          { shares: "200.00", price: "0.10" },
        ],
      },
    },
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
        " according to https://www.cdc.gov/nchs/nvss/deaths.htm?",
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
        " according to http://www.demographia.com?",
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
        " according to http://www.demographia.com?",
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
