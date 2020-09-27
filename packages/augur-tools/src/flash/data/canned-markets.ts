import {
  AMERICAN_FOOTBALL,
  BASKETBALL,
  CRYPTO,
  ETHEREUM,
  ECONOMICS,
  GOLF,
  MENS_LEAGUES,
  NBA,
  NFL,
  NFL_DRAFT,
  PGA,
  POLITICS,
  SOCCER,
  SPORTS,
  US_POLITICS,
  HOCKEY,
  groupTypes,
  MMA,
  ENTERTAINMENT,
  SOCIAL_MEDIA,
  TWITTER,
  CUSTOMIZED,
} from '@augurproject/sdk-lite';
import {
  Template,
  TEMPLATES,
} from '@augurproject/templates';
import { formatBytes32String } from 'ethers/utils';
import moment from 'moment';
import { buildExtraInfo, getFilledInputs, fillInQuestion, getLongDescription } from '../../libs/templates';
import {
  inFiveMonths,
  inOneMonths,
  inSixMonths,
  inTenMonths,
  inThreeMonths,
  inTwoMonths,
  midnightTomorrow,
  thisYear,
  today,
} from '../time';
import { LIST_VALUES } from '../../templates-lists';

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
  { shares: '100.00', price: '0.311' },
  { shares: '200.00', price: '0.351' },
  { shares: '300.00', price: '0.401' },
];
export const singleOutcomeBids: AskBid[] = [
  { shares: '100.00', price: '0.301' },
  { shares: '200.00', price: '0.251' },
  { shares: '300.00', price: '0.191' },
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
  return markets.map(
    (market): CannedMarket => {
      if (market.outcomes) {
        market.outcomes = market.outcomes.map(formatBytes32String);
      }
      return market;
    }
  );
}

export const cannedMarkets: CannedMarket[] = massageMarkets([
  {
    marketType: 'yesNo',
    endTime: inTenMonths.getTime() / 1000,
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['space'],
      description:
        'Will SpaceX successfully complete a Mars landing (manned or unmanned) by ' +
        inTenMonths.toDateString() +
        ' according to http://www.spacex.com?',
      tags: ['SpaceX', 'spaceflight'],
      longDescription: '',
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
    marketType: 'scalar',
    endTime: midnightTomorrow.getTime() / 1000,
    minPrice: '-10',
    maxPrice: '120',
    tickSize: '0.1',
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['weather', 'temperature'],
      description:
        `High temperature (in degrees Fahrenheit) on ${today.toDateString()} at the San Francisco International Airport, as reported by Weather Underground (https://www.wunderground.com/history/airport/KSFO/) ` +
        [
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
        inFiveMonths.toDateString() +
        ' according to https://www.esrl.noaa.gov/gmd/ccgg/trends_ch4',
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
        'New antibiotics approved by the FDA on ' +
        inSixMonths.toDateString() +
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
    marketType: 'categorical',
    endTime: inOneMonths.getTime() / 1000,
    outcomes: [
      'cancer',
      'heart attacks',
      'infectious diseases',
      'starvation',
      'covid-19',
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

  const twitter = TEMPLATES[ENTERTAINMENT].children[SOCIAL_MEDIA].children[TWITTER]
    .templates as Template[];
  const twitterTemplate: Template = twitter[0];
  const twitterDate = moment().add(9, 'days');
  const twitterInputValues = ['realDonaldTrump', '999.9', 'Thousand', twitterDate.format('MMMM DD, YYYY')];
  let twitterInputs = getFilledInputs(twitterTemplate, twitterInputValues);
  twitterInputs[3].timestamp = twitterDate.unix();
  markets.push({
    marketType: 'yesNo',
    endTime: twitterDate.add(1, 'days').unix(),
    affiliateFeeDivisor: 0,
    creatorFeeDecimal: '0.01',
    extraInfo: {
      categories: [ENTERTAINMENT, SOCIAL_MEDIA,TWITTER ],
      description: fillInQuestion(twitterTemplate, twitterInputValues),
      tags: [],
      longDescription: getLongDescription(twitterTemplate),
      template: {
        hash: twitterTemplate.hash,
        question: twitterTemplate.question,
        inputs: twitterInputs,
      },
    },
    orderBook: yesNoOrderBook,
  });

  const usPoliticsTemplates = TEMPLATES[POLITICS].children[US_POLITICS]
    .templates as Template[];
  const template1: Template = usPoliticsTemplates[0];
  const usInputValues = ['Donald Trump', '2020'];
  markets.push({
    marketType: 'yesNo',
    endTime: inTenMonths.getTime() / 1000,
    affiliateFeeDivisor: 0,
    creatorFeeDecimal: '0.01',
    extraInfo: {
      categories: [POLITICS, US_POLITICS],
      description: fillInQuestion(template1, usInputValues),
      tags: [],
      longDescription: getLongDescription(template1),
      template: {
        hash: template1.hash,
        question: template1.question,
        inputs: getFilledInputs(template1, usInputValues),
      },
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
  markets.push({
    marketType: 'yesNo',
    endTime: unixEndTime,
    affiliateFeeDivisor: 0,
    creatorFeeDecimal: '0.01',
    extraInfo: buildExtraInfo(fbTemplate, inputValues, [
      SPORTS,
      AMERICAN_FOOTBALL,
      NFL,
    ]),
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
        'No Contest',
      ],
      extraInfo: buildExtraInfo(socTemplate, socInputValues, [
        SPORTS,
        SOCCER,
        MENS_LEAGUES,
      ]),
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
      },
    },
  ]);

  markets.push(convertedMarkets[0]);

  const draftTemplates = TEMPLATES[SPORTS].children[AMERICAN_FOOTBALL].children[
    NFL_DRAFT
  ].templates as Template[];
  const draftTemplate: Template = draftTemplates[1];
  const draftExpDate = moment().add(4, 'weeks');
  const draftEstTime = draftExpDate.unix();
  const draftEndTime = draftExpDate.add(50, 'hours').unix();
  const draftInputValues = ['2020', 'Wide Receiver', String(draftEstTime)];

  const draftMarkets = massageMarkets([
    {
      marketType: 'categorical',
      endTime: draftEndTime,
      affiliateFeeDivisor: 0,
      creatorFeeDecimal: '0.01',
      outcomes: ['Jonny B', 'Eric C', 'Mac D', 'Linny Q', 'Other (Field)'],
      extraInfo: buildExtraInfo(draftTemplate, draftInputValues, [
        SPORTS,
        AMERICAN_FOOTBALL,
        NFL_DRAFT,
      ]),
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
      },
    },
  ]);

  markets.push(draftMarkets[0]);

  const golfTemplates = TEMPLATES[SPORTS].children[GOLF].children[PGA]
    .templates as Template[];
  const golfTemplate: Template = golfTemplates[3];
  const golfExpDate = moment().add(4, 'weeks');
  const golfYear = golfExpDate.year();
  const golfEstTime = golfExpDate.unix();
  const golfInputValues = [String(golfYear), 'PGA Championship'];
  const converteGolfdMarkets = massageMarkets([
    {
      marketType: 'categorical',
      endTime: golfEstTime,
      affiliateFeeDivisor: 0,
      creatorFeeDecimal: '0.01',
      outcomes: [
        'Dustin Johnson',
        'Tiger Woods',
        'Brooks Koepka',
        'Rory Mcllroy',
        'Jason Day',
        'Other (Field)',
        'No Contest',
      ],
      extraInfo: buildExtraInfo(golfTemplate, golfInputValues, [
        SPORTS,
        GOLF,
        PGA,
      ]),
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
  ]);

  markets.push(converteGolfdMarkets[0]);

  const cryptoTemplates = TEMPLATES[CRYPTO].children[ETHEREUM]
    .templates as Template[];
  const cryptoTemplate: Template = cryptoTemplates[2];
  const cryptoExpDate = moment().add(1, 'weeks').startOf('day');
  const cryptoInputValues = [
    'ETH/USD',
    cryptoExpDate.format('MMMM DD, YYYY'),
    'ETHUSD (crypto - Bittrex)',
  ];
  let cryptoInputs = getFilledInputs(cryptoTemplate, cryptoInputValues);
  markets.push({
    marketType: 'scalar',
    endTime: cryptoExpDate.add(1, 'days').unix(),
    minPrice: '120',
    maxPrice: '200',
    tickSize: '0.01',
    affiliateFeeDivisor: 0,
    creatorFeeDecimal: '0.01',
    extraInfo: {
      categories: [CRYPTO, ETHEREUM, 'ETHUSD (crypto - Bittrex)'],
      description: fillInQuestion(cryptoTemplate, cryptoInputValues),
      tags: [],
      longDescription: getLongDescription(cryptoTemplate),
      template: {
        hash: cryptoTemplate.hash,
        question: cryptoTemplate.question,
        inputs: cryptoInputs,
      },
    },
    orderBook: {
      2: {
        buy: [
          { shares: '10.01', price: '131' },
          { shares: '20.01', price: '135' },
          { shares: '30.01', price: '140' },
        ],
        sell: [
          { shares: '10.01', price: '145' },
          { shares: '20.01', price: '150' },
          { shares: '30.01', price: '160' },
        ],
      },
    },
  });

  const bbTemplates = TEMPLATES[SPORTS].children[BASKETBALL].children[NBA]
    .templates as Template[];
  const bbTemplate: Template = bbTemplates.find(m => m.marketType === 'Scalar');
  const bbExpDate = moment()
    .add(2, 'weeks')
    .add(8, 'hours');
  const bbDateYear = bbExpDate.format('YY');
  const bbYears = `20${Number(bbDateYear)-1}-${bbDateYear}`;
  const bbInputValues = ['LA Lakers', bbYears];
  markets.push({
    marketType: 'scalar',
    endTime: bbExpDate.unix(),
    minPrice: '0',
    maxPrice: '82',
    tickSize: '0.1',
    affiliateFeeDivisor: 0,
    creatorFeeDecimal: '0.01',
    extraInfo: buildExtraInfo(bbTemplate, bbInputValues, [
      SPORTS,
      BASKETBALL,
      NBA,
    ]),
    orderBook: {
      2: {
        buy: [
          { shares: '10.01', price: '40' },
          { shares: '20.01', price: '45' },
          { shares: '30.01', price: '50' },
        ],
        sell: [
          { shares: '10.01', price: '51' },
          { shares: '20.01', price: '65' },
          { shares: '30.01', price: '60' },
        ],
      },
    },
  });

  return markets;
};

const calcDailyHockeyMarket = (): CannedMarket[] => {
  const fillMarketObject = (template, index, inputValues, outcomeValues) => ({
    marketType: 'categorical',
    endTime,
    affiliateFeeDivisor: 0,
    creatorFeeDecimal: '0.01',
    extraInfo: buildExtraInfo(template, inputValues[index], [
      SPORTS,
      HOCKEY
    ]),
    outcomes: outcomeValues[index],
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
    },
  });
  const estStartTime = moment().add(3, 'weeks');
  const unixEstStartTime = estStartTime.unix();
  const endTime = estStartTime.add(6, 'hours').unix();
  const hockeyTemplates = TEMPLATES[SPORTS].children[HOCKEY].templates as Template[];
  const teamA = LIST_VALUES.NHL_TEAMS[0];
  const teamB = LIST_VALUES.NHL_TEAMS[1];
  const moneyLine = hockeyTemplates.find(t => t.groupName === groupTypes.COMBO_MONEY_LINE);
  const spread = hockeyTemplates.find(t => t.groupName === groupTypes.COMBO_SPREAD);
  const overUnder = hockeyTemplates.find(t => t.groupName === groupTypes.COMBO_OVER_UNDER);
  const daily = [moneyLine, spread, overUnder];
  const inputValues = [
    [teamA, teamB, unixEstStartTime],
    [teamA, "2", teamB, unixEstStartTime],
    [teamA, teamB, "4", unixEstStartTime]
  ]

  const outcomeValues = [
    [teamA, teamB, `No Contest`],
    [`${teamA} -2.5`, `${teamB} +2.5`, `No Contest`],
    [`Over 4.5`, `Under 4.5`, `No Contest`],
  ]

  const marketObjects = daily.map((template, index) => fillMarketObject(template, index, inputValues, outcomeValues));
  const marketObjectsDoubling = daily.map((template, index) => fillMarketObject(template, index, inputValues, outcomeValues));

  const inputValuesAgain = [
    [teamA, teamB, unixEstStartTime],
    [teamA, "3", teamB, unixEstStartTime],
    [teamA, teamB, "5", unixEstStartTime]
  ]

  const outcomeValuesAgain = [
    [teamA, teamB, `No Contest`],
    [`${teamA} -3.5`, `${teamB} +3.5`, `No Contest`],
    [`Over 5.5`, `Under 5.5`, `No Contest`],
  ]

  const moreMarketObjects = daily.map((template, index) => fillMarketObject(template, index, inputValuesAgain, outcomeValuesAgain));
  return [...marketObjects, ...marketObjectsDoubling, ...moreMarketObjects];
}

const calcFuturesHockeyMarket = (): CannedMarket[] => {
  const estStartTime = moment().add(3, 'weeks');
  const endTime = estStartTime.unix();
  const hockeyTemplates = TEMPLATES[SPORTS].children[HOCKEY].templates as Template[];
  const templates = hockeyTemplates.filter(t => t.groupName === groupTypes.FUTURES);
  const inputValues = [
    [LIST_VALUES.YEAR_RANGE[0], LIST_VALUES.HOCKEY_EVENT[0]],
    ['Bob Smith'],
    [LIST_VALUES.YEAR_RANGE[0], LIST_VALUES.HOCKEY_AWARD[2]],
  ];
  const outcomes = [
    [...LIST_VALUES.NHL_TEAMS.slice(0,5), 'Other (Field)'],
    [...LIST_VALUES.NHL_TEAMS.slice(0,5), 'Other (Field)', 'Unsigned'],
    ['Joe Pavelski', 'Jonathan Toews', 'Carey Price', 'Erik Karlsson', 'Drew Doughty', 'Other (Field)'],
  ]
  return templates.map((template, index) => ({
    marketType: 'categorical',
    endTime,
    affiliateFeeDivisor: 0,
    creatorFeeDecimal: '0.01',
    extraInfo: buildExtraInfo(template, inputValues[index], [
      SPORTS,
      HOCKEY,
    ]),
    outcomes: outcomes[index],
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
    },
  }));
}

const calcMMAMarkets = (): CannedMarket[] => {
  const fillMarketObject = (template, index, inputValues, outcomeValues) => ({
      marketType: 'categorical',
      endTime,
      affiliateFeeDivisor: 0,
      creatorFeeDecimal: '0.01',
      extraInfo: buildExtraInfo(template, inputValues[index], [
        SPORTS,
        MMA,
      ]),
      outcomes: outcomeValues[index],
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
      },
    });
  const estStartTime = moment().add(3, 'weeks');
  const unixEstStartTime = estStartTime.unix();
  const endTime = estStartTime.add(9, 'hours').unix();
  const templates = TEMPLATES[SPORTS].children[MMA].templates as Template[];
  const fighterA = 'Donald Cerrone';
  const fighterB = 'Anthony Pettis';
  const inputValues = [
    [fighterA, fighterB, unixEstStartTime],
    [fighterA, fighterB, '2', unixEstStartTime],
    [fighterA, fighterB, unixEstStartTime],
    [fighterA, fighterB, unixEstStartTime],
    [fighterA, fighterB, unixEstStartTime],
  ];
  const outcomeValues = [
    [fighterA, fighterB, 'Draw/No Contest'],
    ['Over 2.5', 'Under 2.5', 'No Contest'],
    [`${fighterA} by KO/TKO`, `${fighterA} by Submission`, `${fighterA} by Points`, `${fighterB} by KO/TKO`, `${fighterB} by Submission`, `${fighterB} by Points`, `Draw/No Contest`],
    ['KO/TKO', 'Submission', 'Points', 'Draw/No Contest'],
    ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Goes the distance', 'No Contest'],
  ]

  const marketObjects = templates.map((template, index) => fillMarketObject(template, index, inputValues, outcomeValues));

  const inputValuesAgain = [
    [fighterA, fighterB, unixEstStartTime],
    [fighterA, fighterB, '3', unixEstStartTime],
    [fighterA, fighterB, unixEstStartTime],
    [fighterA, fighterB, unixEstStartTime],
    [fighterA, fighterB, unixEstStartTime],
  ];
  const outcomeValuesAgain = [
    [fighterA, fighterB, 'Draw/No Contest'],
    ['Over 3.5', 'Under 3.5', 'No Contest'],
    [`${fighterA} by KO/TKO`, `${fighterA} by Submission`, `${fighterA} by Points`, `${fighterB} by KO/TKO`, `${fighterB} by Submission`, `${fighterB} by Points`, `Draw/No Contest`],
    ['KO/TKO', 'Submission', 'Points', 'Draw/No Contest'],
    ['Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5', 'Goes the distance', 'No Contest'],
  ]
  const marketObjectsAgain = templates.map((template, index) => fillMarketObject(template, index, inputValuesAgain, outcomeValuesAgain));

  return [...marketObjects, ...marketObjectsAgain];
}

const calcSoccerMarkets = (): CannedMarket[] => {
  const fillMarketObject = (template, index, inputValues, outcomeValues) => ({
    marketType: 'categorical',
    endTime,
    affiliateFeeDivisor: 0,
    creatorFeeDecimal: '0.01',
    extraInfo: buildExtraInfo(template, inputValues[index], [
      SPORTS,
      SOCCER,
      CUSTOMIZED,
    ]),
    outcomes: outcomeValues[index],
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
    },
  });
  const estStartTime = moment().add(3, 'weeks');
  const unixEstStartTime = estStartTime.unix();
  const endTime = estStartTime.add(6, 'hours').unix();
  const templates = TEMPLATES[SPORTS].children[SOCCER].children[CUSTOMIZED].templates as Template[];
  const teamA = 'Argentina';
  const teamB = 'Uruguay';
  const inputValues = [
    ["Men's", 'Copa America', teamA, teamB, unixEstStartTime],
    ["Men's", 'Copa America', teamA, 2, teamB, unixEstStartTime],
    ["Men's", 'Copa America', teamA, teamB, 4, unixEstStartTime],
    ["Men's", 'UEFA Champions League', LIST_VALUES.YEAR_RANGE[0]],
  ];
  const outcomeValues = [
    [teamA, teamB, `Draw`, `No Contest`],
    [`${teamA} -2.5`, `${teamB} +2.5`, `No Contest`],
    [`Over 4.5`, `Under 4.5`, `No Contest`],
    ['Milan', 'Liverpool', 'Real Madrid', 'Bayern Munich', 'Barcelona', 'Ajax', `Other (Field)`],
  ]
  const marketObjects = templates.map((template, index) => fillMarketObject(template, index, inputValues, outcomeValues));

  const inputValuesAgain = [
    ["Men's", 'Copa America', teamA, teamB, unixEstStartTime],
    ["Men's", 'Copa America', teamA, 3, teamB, unixEstStartTime],
    ["Men's", 'Copa America', teamA, teamB, 5, unixEstStartTime],
    ["Men's", 'UEFA Champions League', LIST_VALUES.YEAR_RANGE[0]],
  ];
  const outcomeValuesAgain = [
    [teamA, teamB, `Draw`, `No Contest`],
    [`${teamA} -3.5`, `${teamB} +3.5`, `No Contest`],
    [`Over 5.5`, `Under 5.5`, `No Contest`],
    ['Inter Milan', 'Manchester United', 'Juventus', 'Bayern Munich', 'Benfica', 'Ajax', `Other (Field)`],
  ]
  const marketObjectsAgain = templates.map((template, index) => fillMarketObject(template, index, inputValuesAgain, outcomeValuesAgain));

  const inputValuesAgain2 = [
    ["Men's", 'Copa America', teamA, teamB, unixEstStartTime],
    ["Men's", 'Copa America', teamA, 4, teamB, unixEstStartTime],
    ["Men's", 'Copa America', teamA, teamB, 6, unixEstStartTime],
    ["Men's", 'UEFA Champions League', LIST_VALUES.YEAR_RANGE[0]],
  ];
  const outcomeValuesAgain2 = [
    [teamA, teamB, `Draw`, `No Contest`],
    [`${teamA} -4.5`, `${teamB} +4.5`, `No Contest`],
    [`Over 6.5`, `Under 6.5`, `No Contest`],
    ['Team one', 'Team two', 'Team three', 'Team fource', `Other (Field)`],
  ]
  const marketObjectsAgain2 = templates.map((template, index) => fillMarketObject(template, index, inputValuesAgain2, outcomeValuesAgain2));

  return [...marketObjects, ...marketObjectsAgain, ...marketObjectsAgain2];
}

export const templatedCannedBettingMarkets = (): CannedMarket[] => {
  const markets = calcDailyHockeyMarket();
  const hockeyFutures = calcFuturesHockeyMarket();
  const mmaMarkets = calcMMAMarkets();
  const soccerMarkets = calcSoccerMarkets();
  return massageMarkets(markets.concat(hockeyFutures).concat(mmaMarkets).concat(soccerMarkets));
};

const badCryptoMarket = (): CannedMarket[] => {
  const cryptoTemplates = TEMPLATES[CRYPTO].children[ETHEREUM]
    .templates as Template[];
  const cryptoTemplate: Template = cryptoTemplates[2];
  const cryptoExpDate = moment().add(1, 'weeks');
  const cryptoInputValues = [
    'ETH/USD',
    cryptoExpDate.format('MMMM DD, YYYY'),
    'ETHUSD (crypto - Bittrex)',
  ];
  let cryptoInputs = getFilledInputs(cryptoTemplate, cryptoInputValues);
  return [{
    marketType: 'scalar',
    endTime: cryptoExpDate.add(1, 'days').unix(),
    minPrice: '120',
    maxPrice: '200',
    tickSize: '0.01',
    affiliateFeeDivisor: 0,
    creatorFeeDecimal: '0.01',
    extraInfo: {
      categories: [CRYPTO, ETHEREUM, 'ETHUSD (crypto - Bittrex)'],
      description: fillInQuestion(cryptoTemplate, cryptoInputValues),
      tags: [],
      longDescription: getLongDescription(cryptoTemplate),
      template: {
        hash: cryptoTemplate.hash,
        question: cryptoTemplate.question,
        inputs: cryptoInputs,
      },
    },
    orderBook: {},
  }];
}
export const testBadTemplateMarkets = (): CannedMarket[] => {
  return badCryptoMarket();
}
