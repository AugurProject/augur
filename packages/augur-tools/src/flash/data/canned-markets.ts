import { formatBytes32String } from 'ethers/utils';
import {
  today, thisYear,
  inOneMonths, inTwoMonths, inThreeMonths, inFourMonths, inFiveMonths, inSixMonths, inTenMonths,
  closingBellTomorrow,
  midnightTomorrow,
} from '../time';
import moment from 'moment';
import { TEMPLATES, POLITICS, US_POLITICS, Template, REQUIRED, FINANCE, INDEXES, AMERICAN_FOOTBALL, SPORTS, NFL, SOCCER, MENS_LEAGUES } from '@augurproject/artifacts';

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

export const singleOutcomeAsks: AskBid[] = [
  { shares: '100.00', price: '0.31' },
  { shares: '200.00', price: '0.35' },
  { shares: '300.00', price: '0.40' },
];
export const singleOutcomeBids: AskBid[] = [
  { shares: '100.00', price: '0.30' },
  { shares: '200.00', price: '0.25' },
  { shares: '300.00', price: '0.19' },
];
const yesNoOrderBook: OrderBook = {
  1: {
    buy: singleOutcomeBids,
    sell: singleOutcomeAsks,
  },
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
  template?: object;
}
export interface CannedMarket {
  marketType: string;
  creatorFeeDecimal?: string; // 0.10 for 10%, 0.01 for 1%, ...
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
    marketType: 'yesNo',
    endTime: inOneMonths.getTime() / 1000,
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['space'],
      description:
        'Will SpaceX successfully complete a manned flight beyond Earth orbit by ' +
        inOneMonths.toDateString() +
        ' according to http://www.spacex.com?',
      tags: ['SpaceX', 'spaceflight'],
      longDescription: '',
    },
    orderBook: yesNoOrderBook,
  },
  {
    marketType: 'yesNo',
    endTime: inTwoMonths.getTime() / 1000,
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['space'],
      description:
        'Will SpaceX successfully complete a Mars landing (manned or unmanned) by ' +
        inTwoMonths.toDateString() +
        ' according to http://www.spacex.com?',
      tags: ['SpaceX', 'spaceflight'],
      longDescription: '',
    },
    orderBook: yesNoOrderBook,
  },
  {
    marketType: 'yesNo',
    endTime: closingBellTomorrow.getTime() / 1000,
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['finance', 'indexes'],
      description:
        'Will the Dow Jones Industrial Average close at a higher price on ' +
        closingBellTomorrow.toDateString() +
        ' than it closed at the previous day according to https://www.google.com/finance?q=INDEXDJX:.DJI?',
      tags: ['stocks', 'Dow Jones'],
      longDescription:
        'The Daily Dow market lives again! https://en.wikipedia.org/wiki/Dow_Jones_Industrial_Average',
    },
    orderBook: yesNoOrderBook,
  },
  {
    marketType: 'yesNo',
    endTime: inThreeMonths.getTime() / 1000,
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['augur'],
      description:
        "Will Augur's live release happen by " +
        inThreeMonths.toDateString() +
        ' according to https://augur.net?',
      tags: ['release date', 'Ethereum'],
      longDescription: '',
    },
    orderBook: yesNoOrderBook,
  },
  {
    marketType: 'yesNo',
    endTime: inFourMonths.getTime() / 1000,
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['crypto', 'ethereum'],
      description:
        'Will Ethereum trade at $2000 or higher at any time before the end of ' +
        inFourMonths.toDateString() +
        ' according to https://api.coinmarketcap.com/v1/ticker/ethereum?',
      tags: ['Ethereum', 'trading'],
      longDescription: 'http://coinmarketcap.com/currencies/ethereum',
    },
    orderBook: yesNoOrderBook,
  },
  {
    marketType: 'yesNo',
    endTime: inFourMonths.getTime() / 1000,
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['weather'],
      description:
        'Will the Larsen B ice shelf collapse by ' +
        inFourMonths.toDateString() +
        '?',
      tags: ['Antarctica', 'warming'],
    },
    orderBook: yesNoOrderBook,
  },
  {
    marketType: 'scalar',
    endTime: midnightTomorrow.getTime() / 1000,
    minPrice: '-10',
    maxPrice: '120',
    tickSize: '0.1',
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['weather', 'temperature'],
      description:
        `High temperature (in degrees Fahrenheit) on ${today.toDateString()} at the San Francisco International Airport, as reported by Weather Underground (https://www.wunderground.com/history/airport/KSFO/) `
         + [
          today.getUTCFullYear(),
          today.getUTCMonth() + 1,
          today.getUTCDate(),
        ].join('/') +
        '/DailyHistory.html',
      tags: ['weather', 'SFO'],
      longDescription: 'https://www.penny-arcade.com/comic/2001/12/12',
      _scalarDenomination: 'degrees Fahrenheit',
    },
    orderBook: {
      2: {
        buy: [
          { shares: '100.01', price: '24' },
          { shares: '200.01', price: '0' },
          { shares: '300.01', price: '-5' },
        ],
        sell: [
          { shares: '100.01', price: '25' },
          { shares: '200.01', price: '50' },
          { shares: '300.01', price: '51' },
        ],
      },
    },
  },
  {
    marketType: 'scalar',
    endTime: inFiveMonths.getTime() / 1000,
    minPrice: '600',
    maxPrice: '5000',
    tickSize: '.01',
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['science'],
      description:
        'Average tropospheric methane concentration (in parts-per-billion) on ' +
      inFiveMonths.toDateString() + ' according to https://www.esrl.noaa.gov/gmd/ccgg/trends_ch4',
      tags: ['climate', 'atmosphere'],
      longDescription:
        'Vast quantities of methane are normally locked into the Earth\'s crust on the continental plateaus in one of the many deposits consisting of compounds of methane hydrate, a solid precipitated combination of methane and water much like ice. Because the methane hydrates are unstable, except at cool temperatures and high (deep) pressures, scientists have observed smaller "burps" due to tectonic events. Studies suggest the huge release of natural gas could be a major climatological trigger, methane itself being a greenhouse gas many times more powerful than carbon dioxide. References: https://en.wikipedia.org/wiki/Anoxic_event, https://en.wikipedia.org/wiki/Atmospheric_methane, https://en.wikipedia.org/wiki/Clathrate_gun_hypothesis',
      _scalarDenomination: 'parts-per-billion',
    },
    orderBook: {},
  },
  {
    marketType: 'scalar',
    endTime: inSixMonths.getTime() / 1000,
    minPrice: '0',
    maxPrice: '30',
    tickSize: '1',
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['medicine'],
      description:
        'New antibiotics approved by the FDA on ' + inSixMonths.toDateString() +
        ' according to https://www.centerwatch.com/drug-information/fda-approved-drugs/year/' +
        thisYear,
      tags: ['science', 'antibiotics'],
      longDescription:
        'Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?',
    },
    orderBook: {
      2: {
        buy: [
          { shares: '100.01', price: '20' },
          { shares: '200.01', price: '18' },
          { shares: '300.01', price: '15' },
        ],
        sell: [
          { shares: '100.01', price: '21' },
          { shares: '200.01', price: '26' },
          { shares: '300.01', price: '29' },
        ],
      },
    },
  },
  {
    marketType: 'scalar',
    endTime: midnightTomorrow.getTime() / 1000,
    minPrice: '0',
    maxPrice: '10000',
    tickSize: '1',
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['crypto'],
      description:
        'Millions of Tether tokens issued on ' +
        today.toDateString() +
        ' (round down) according to http://omnichest.info/lookupadd.aspx?address=3MbYQMMmSkC3AgWkj9FMo5LsPTW1zBTwXL',
      tags: ['Tether', 'trading'],
      longDescription:
        'The curious tale of Tethers: https://hackernoon.com/the-curious-tale-of-tethers-6b0031eead87',
      _scalarDenomination: 'million Tethers',
    },
    orderBook: {
      2: {
        buy: [
            { shares: '10.01', price: '100' },
            { shares: '20.01', price: '150' },
            { shares: '30.01', price: '220' },
        ],
        sell: [
            { shares: '10.01', price: '225' },
            { shares: '20.01', price: '250' },
            { shares: '30.01', price: '300' },
        ],
      },
    },
  },
  {
    marketType: 'categorical',
    endTime: midnightTomorrow.getTime() / 1000,
    outcomes: ['NE Patriots', 'SF 49ers', 'Tie/No Winner'],
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['sports', 'American Football', 'NFL'],
      description:
        'Which NFL Team will win: NE Patriots vs. SF 49ers, Scheduled on ' +
        midnightTomorrow.toDateString() + '?',
      tags: [],
      longDescription:
        'Include Regulation and Overtime\nAt least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as Tie/No Winner',
    },
    orderBook: {
      1: {
        buy: [
          { shares: '100.00', price: '0.50' },
          { shares: '200.00', price: '0.48' },
          { shares: '250.00', price: '0.47' },
          { shares: '150.00', price: '0.45' },
          { shares: '500.00', price: '0.43' },
        ],
        sell: [
          { shares: '500.00', price: '0.60' },
          { shares: '350.00', price: '0.56' },
          { shares: '50.00', price: '0.55' },
          { shares: '150.00', price: '0.53' },
          { shares: '200.00', price: '0.52' },
        ],
      },
      2: {
        buy: [
          { shares: '150.00', price: '0.38' },
          { shares: '200.00', price: '0.37' },
          { shares: '250.00', price: '0.35' },
          { shares: '500.00', price: '0.33' },
        ],
        sell: [
          { shares: '500.00', price: '0.45' },
          { shares: '200.00', price: '0.43' },
          { shares: '100.00', price: '0.41' },
          { shares: '150.00', price: '0.40' },
        ],
      },
      3: {
        buy: [
          { shares: '100.00', price: '0.08' },
          { shares: '200.00', price: '0.06' },
          { shares: '500.00', price: '0.05' },
        ],
        sell: [
          { shares: '150.00', price: '0.15' },
          { shares: '200.00', price: '0.20' },
        ],
      },
    },
  },
  {
    marketType: 'categorical',
    endTime: midnightTomorrow.getTime() / 1000,
    outcomes: [
      'LSU Tigers',
      'Alabama Crimson Tide',
      'Cancelled/Unofficial game',
    ],
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['Sports', 'American Football', 'NCAA'],
      description:
        'NCAA FB: LSU Who will win, LSU Tigers vs Alabama Crimson Tide, scheduled on ' +
        midnightTomorrow.toDateString() +
        '?',
      tags: [],
      longDescription:
        "Includes Regulation and Overtime\nIf the game is not played, the market should resolve as 'NO' as Team A did NOT win vs. team B\nAt least 55 minutes of play must have elapsed for the game to be deemed official. If less than 55 minutes of play have been completed, there is no official winner of the game and the market should resolve as 'No'",
    },
    orderBook: {
      1: {
        buy: [
          { shares: '100.00', price: '0.54' },
          { shares: '200.00', price: '0.52' },
          { shares: '250.00', price: '0.50' },
          { shares: '150.00', price: '0.45' },
          { shares: '500.00', price: '0.42' },
        ],
        sell: [
          { shares: '200.00', price: '0.56' },
          { shares: '150.00', price: '0.57' },
          { shares: '50.00', price: '0.59' },
          { shares: '350.00', price: '0.60' },
          { shares: '500.00', price: '0.65' },
        ],
      },
      2: {
        buy: [
          { shares: '100.00', price: '0.42' },
          { shares: '150.00', price: '0.40' },
          { shares: '200.00', price: '0.37' },
          { shares: '250.00', price: '0.35' },
        ],
        sell: [
          { shares: '50.00', price: '0.45' },
          { shares: '100.00', price: '0.46' },
          { shares: '200.00', price: '0.48' },
          { shares: '500.00', price: '0.50' },
        ],
      },
      3: {
        buy: [
          { shares: '100.00', price: '0.02' },
          { shares: '500.00', price: '0.01' },
        ],
        sell: [
          { shares: '200.00', price: '0.10' },
        ],
      },
    },
  },
  {
    marketType: 'categorical',
    endTime: inOneMonths.getTime() / 1000,
    outcomes: [
      'cancer',
      'heart attacks',
      'infectious diseases',
      'starvation',
      'lava',
      'other',
    ],
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['science'],
      description:
        'What will be the number one killer in the United States by ' +
        inOneMonths.toDateString() +
        ' according to https://www.cdc.gov/nchs/nvss/deaths.htm?',
      tags: ['mortality', 'United States'],
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
    marketType: 'categorical',
    endTime: inTwoMonths.getTime() / 1000,
    outcomes: [
      'London',
      'New York',
      'Los Angeles',
      'San Francisco',
      'Tokyo',
      'Palo Alto',
      'Hong Kong',
    ],
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['housing'],
      description:
        'Which city will have the highest median single-family home price on ' +
        inTwoMonths.toDateString() +
        ' according to http://www.demographia.com?',
      tags: ['economy', 'bubble'],
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

export const templatedCannedMarkets = (): CannedMarket[] => {
  const markets = [];
  const usPoliticsTemplates = TEMPLATES[POLITICS].children[US_POLITICS]
    .templates as Template[];
  const template1: Template = usPoliticsTemplates[0];
  const usLongDescription = template1.resolutionRules[REQUIRED].map(
    m => m.text
  ).join('\n');
  const usInputValues = ['Donald Trump', '2020'];
  const usTemplate = {
    hash: template1.hash,
    question: template1.question,
    inputs: getFilledInputs(template1, usInputValues),
  };
  markets.push({
    marketType: 'yesNo',
    endTime: inTenMonths.getTime() / 1000,
    affiliateFeeDivisor: 0,
    creatorFeeDecimal: '0.01',
    extraInfo: {
      categories: ['Politics', 'US Politics'],
      description: 'Will Donald Trump win the 2020 U.S. Presidential election?',
      tags: ['Politics', 'US Politics'],
      longDescription: getLongDescription(template1),
      template: usTemplate,
    },
    orderBook: yesNoOrderBook,
  });

  const finTemplates = TEMPLATES[FINANCE].children[INDEXES]
    .templates as Template[];
  const finTemplate: Template = finTemplates[0];
  const wed = 3;
  const finExpDate = moment()
    .day(wed)
    .add(3, 'weeks')
    .add(6, 'hours');
  const date = finExpDate.format('MMMM DD, YYYY');
  const finUnixEndTime = finExpDate.unix();
  const finInputValues = ['Dow Jones Industrial Average', '25000', date];
  const finDescription = fillInQuestion(finTemplate, finInputValues);
  const finInputTemplate = {
    hash: finTemplate.hash,
    question: finTemplate.question,
    inputs: getFilledInputs(finTemplate, finInputValues),
  };
  markets.push({
    marketType: 'yesNo',
    endTime: finUnixEndTime,
    affiliateFeeDivisor: 0,
    creatorFeeDecimal: '0.015',
    extraInfo: {
      categories: [FINANCE, INDEXES],
      description: finDescription,
      tags: [],
      longDescription: getLongDescription(finTemplate),
      template: finInputTemplate,
    },
    orderBook: yesNoOrderBook,
  });

  const fbTemplates = TEMPLATES[SPORTS].children[AMERICAN_FOOTBALL].children[
    NFL
  ].templates as Template[];
  const fbTemplate: Template = fbTemplates[3];
  const expDate = moment().add(3, 'weeks');
  const year = expDate.year();
  const unixEndTime = expDate.unix();
  const inputValues = ['Dallas Cowboys', '9', String(year)];
  const description = fillInQuestion(fbTemplate, inputValues);
  const template = {
    hash: fbTemplate.hash,
    question: fbTemplate.question,
    inputs: getFilledInputs(fbTemplate, inputValues),
  };
  markets.push({
    marketType: 'yesNo',
    endTime: unixEndTime,
    affiliateFeeDivisor: 0,
    creatorFeeDecimal: '0.01',
    extraInfo: {
      categories: [SPORTS, AMERICAN_FOOTBALL, NFL],
      description,
      tags: [],
      longDescription: getLongDescription(fbTemplate),
      template,
    },
    orderBook: yesNoOrderBook,
  });

  const socTemplates = TEMPLATES[SPORTS].children[SOCCER].children[MENS_LEAGUES]
    .templates as Template[];
  const socTemplate: Template = socTemplates[0];
  const socExpDate = moment().add(3, 'weeks');
  const estTime = socExpDate.unix();
  const socEndTime = socExpDate.add(8, 'hours').unix();
  const socInputValues = [
    'English Premier League',
    'Liverpool',
    'Manchester United',
    String(estTime),
  ];
  const socDescription = fillInQuestion(socTemplate, socInputValues);
  const socInputTemplate = {
    hash: socTemplate.hash,
    question: socTemplate.question,
    inputs: getFilledInputs(socTemplate, socInputValues),
  };
  const convertedMarkets = massageMarkets([
    {
      marketType: 'categorical',
      endTime: socEndTime,
      affiliateFeeDivisor: 0,
      creatorFeeDecimal: '0.01',
      outcomes: [
        'Liverpool',
        'Manchester United',
        'Draw',
        'Unofficial game/Cancelled',
      ],
      extraInfo: {
        categories: [SPORTS, SOCCER, MENS_LEAGUES],
        description: socDescription,
        tags: [],
        longDescription: getLongDescription(socTemplate),
        template: socInputTemplate,
      },
      orderBook: yesNoOrderBook,
    },
  ]);

  markets.push(convertedMarkets[0]);

  return markets;
};

const fillInQuestion = (template, values) => {
  let description = template.question;
  template.inputs.forEach((input) => {
    let value = values[input.id];
    description = description.replace(`[${input.id}]`, `${value}`);
  });
  return description;
}

const getLongDescription = (template) => {
  return template.resolutionRules[REQUIRED].map(m => m.text).join('\n');
}

const getFilledInputs = (template, values) => {
  return values.map((value, index) => ({
    id: template.inputs[index].id,
    type: template.inputs[index].type,
    value,
    timestamp: !isNaN(value) ? value : null,
  }));
};
