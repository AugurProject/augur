import {
  YES_NO,
  SCALAR,
  CATEGORICAL,
  YES_NO_OUTCOMES,
  DESIGNATED_REPORTER_SELF,
  SETTLEMENT_FEE_DEFAULT,
  AFFILIATE_FEE_DEFAULT,
  ZERO,
  ONE,
  SETTLEMENT_FEE_PERCENT_DEFAULT,
} from 'modules/common/constants';
import { NewMarket } from 'modules/types';
import * as icons from 'modules/common/icons';
import { Popcorn } from 'modules/common/icons';
import {
  SPORTS,
  POLITICS,
  ECONOMICS,
  ENTERTAINMENT,
  CRYPTO,
  MEDICAL,
  SOCCER,
  AMERICAN_FOOTBALL,
  OLYMPICS,
  BASEBALL,
  SUMMER,
  WINTER,
  GOLF,
  BASKETBALL,
  TENNIS,
  HOCKEY,
  HORSE_RACING,
  NFL,
  NCAA,
  US_POLITICS,
  WORLD,
  STATISTICS,
  BITCOIN,
  ETHEREUM,
  COMPOUND,
  BALANCER,
  AUGUR,
  MAKER,
  AMPLE,
  ZEROX,
  CHAINLINK,
  ADDITIONAL_TOKENS,
  BOXING,
  MMA,
  CAR_RACING,
  AWARDS,
  TV_MOVIES,
  SOCIAL_MEDIA,
} from '@augurproject/sdk-lite';
import { formatPercent } from 'utils/format-number';
import { denomination } from 'modules/common/labels.styles.less';


// Button Types
export const BACK = 'back';
export const NEXT = 'next';
export const CREATE = 'create';

// Pages
export const LANDING = 'LANDING';
export const SCRATCH = 'SCRATCH';
export const TEMPLATE = 'TEMPLATE';

export const MARKET_CREATION_PAGES = [LANDING, SCRATCH, TEMPLATE];

// Scratch Page Content
export const REVIEW = 'review';
export const FEES_LIQUIDITY = 'feesLiquidity';
export const FORM_DETAILS = 'formDetails';
export const TEMPLATE_FORM_DETAILS = 'templateFormDetails';
export const DEFAULT_TICK_SIZE = 0.001;
export const OUTCOME_MAX_LENGTH = 32;

export const EMPTY_STATE: NewMarket = {
  isValid: false,
  validations: {
    description: null,
    categories: ['', '', ''],
    designatedReporterAddress: null,
    setEndTime: null,
    hour: null,
    minute: null,
    meridiem: null,
    scalarDenomination: null,
    outcomes: ['', ''],
    settlementFee: '',
    inputs: ['', ''],
  },
  currentStep: 0,
  marketType: YES_NO,
  outcomes: ['', ''],
  outcomesFormatted: YES_NO_OUTCOMES,
  scalarBigNum: '',
  scalarDenomination: '',
  description: '',
  designatedReporterType: DESIGNATED_REPORTER_SELF,
  designatedReporterAddress: '',
  endTime: null,
  setEndTime: null,
  tickSize: DEFAULT_TICK_SIZE,
  hour: null,
  minute: null,
  meridiem: 'AM',
  offset: 0,
  offsetName: null,
  timezone: null,
  detailsText: '',
  categories: ['', '', ''],
  navCategories: ['', '', ''],
  settlementFee: SETTLEMENT_FEE_DEFAULT,
  settlementFeePercent: formatPercent(SETTLEMENT_FEE_PERCENT_DEFAULT, {
    positiveSign: false,
    decimals: 4,
    decimalsRounded: 4,
  }),
  affiliateFee: AFFILIATE_FEE_DEFAULT,
  orderBook: {}, // for submit orders
  orderBookSorted: {}, // for order book table
  minPrice: '0',
  maxPrice: '1',
  minPriceBigNumber: ZERO,
  maxPriceBigNumber: ONE,
  initialLiquidityDai: ZERO,
  initialLiquidityGas: ZERO,
};

export const WarpSyncErrorHeader = 'Universe Warp Sync Hash is undefined';
export const WarpSyncErrorSubheader = 'Wait until warp sync hash is defined to report or dispute';
export const InvalidRules = [
  'The market question, resolution details  or its outcomes are ambiguous, subjective or unknown.',
  'The result of the event was known at market creation time.',
  'The outcome was not known at event expiration time.',
  'It can resolve without at least one of the outcomes listed being the winner, unless it is explicitly stated how the market will otherwise resolve in the resolution details .',
  'The title, details and outcomes are in direct conflict with each other.',
  'Any of the outcomes are duplicates',
  'The market can resolve with more than one winning outcome.',
  'Any of the outcomes don’t answer the market question ONLY. (outcomes cannot introduce a secondary question)',
  'If using a resolution source, it is not referenced consistently between the market question  and resolution details  e.g. as either a URL or its full name.',
  'Player or team is not in the correct league, division or conference, at the time the market was created.',
];
export const AugurMarkets = [
  'Invalid outcome pays $1.00 per share for Yes/No and Categorical markets if the market resolves as Invalid. Scalar markets pay out the upper bound. A lower price indicates a lower probability of the market resolving as invalid.',
  'Should resolve using general knowledge if the market does not have a resolution source.',
  'Cover events that occur between market start time and end time in the market question. If start time is not specified in the market question, market creation date/time is used. If no end time is specified in market question, the event expiration is to be used. If the event occurs outside of these bounds, the market should resolve as invalid',
  'Outcomes must be unique from one and other within a market.  If multiple outcomes share a common name, they must be easily distinguishable (ie. Serena Williams and Venus Williams)',
];
export const InvalidTradingTooltip = 'Invalid outcome pays $1.00 per share if the market resolves as Invalid. Click here to learn what makes a market Invalid';
export const InvalidTradingScalarTooltip = (maxPrice, denomination) => `Invalid outcome resolves at ${maxPrice} ${denomination} if the market resolves as Invalid. Click here to learn what makes a market Invalid`;
export const AugurMarketsContent = () => ({
  explainerBlockTitle: 'Augur Markets:',
  explainerBlockSubtexts: AugurMarkets,
  useBullets: true,
});
export const EventDetailsContentTemplate = `template`;
export const EventDetailsContent = (type = `custom`) => ({
  title: 'Event details',
  largeHeader: `Create a ${type} market`,
  explainerBlockTitle: 'A market is invalid if:',
  explainerBlockSubtexts: InvalidRules,
  mainContent:
    type == EventDetailsContentTemplate ? TEMPLATE_FORM_DETAILS : FORM_DETAILS,
  firstButton: BACK,
  secondButton: NEXT,
  useBullets: true,
});

export const LiquidityContent = {
  title: 'Fees & liquidity',
  largeHeader: 'Fee & liquidity',
  noDarkBackground: true,
  mainContent: FEES_LIQUIDITY,
  firstButton: BACK,
  secondButton: NEXT,
};

export const ReviewContent = {
  title: 'Review',
  largeHeader: 'Review market details',
  previewButton: true,
  explainerBlockTitle: 'Note that markets will resolve as invalid if:',
  explainerBlockSubtexts: InvalidRules,
  useBullets: true,
  mainContent: REVIEW,
  firstButton: BACK,
  secondButton: CREATE,
};

export const CUSTOM_CONTENT_PAGES = [
  EventDetailsContent(),
  LiquidityContent,
  ReviewContent,
];

// template page content
export const SUB_CATEGORIES = 'subCategories';
export const MARKET_TYPE = 'marketType';
export const TEMPLATE_PICKER = 'templatePicker';

// Market Type Names
export const MARKET_TYPE_NAME = {
  [YES_NO]: 'Yes/No',
  [SCALAR]: 'Scalar',
  [CATEGORICAL]: 'Categorical',
};

const defaultDescription = '-  |  -';
export interface MarketCardTemplate {
  value: string;
  header: string;
  description: string;
  icon: JSX.Element;
  count: number;
}

export const MARKET_TEMPLATES = [
  {
    value: SPORTS,
    header: SPORTS,
    description: defaultDescription,
    icon: icons.Sports,
  },
  {
    value: POLITICS,
    header: POLITICS,
    description: defaultDescription,
    icon: icons.Politics,
  },
  {
    value: ECONOMICS,
    header: ECONOMICS,
    description: defaultDescription,
    icon: icons.Economics,
  },
  {
    value: ENTERTAINMENT,
    header: ENTERTAINMENT,
    description: defaultDescription,
    icon: icons.Entertainment,
  },
  {
    value: CRYPTO,
    header: CRYPTO,
    description: defaultDescription,
    icon: icons.Crypto,
  },
  {
    value: MEDICAL,
    header: MEDICAL,
    description: defaultDescription,
    icon: icons.Medical,
  },
];

export const MARKET_SUB_TEMPLATES = {
  [SPORTS]: [
    {
      value: SOCCER,
      header: SOCCER,
      description: defaultDescription,
      icon: icons.Soccer,
    },
    {
      value: AMERICAN_FOOTBALL,
      header: AMERICAN_FOOTBALL,
      description: defaultDescription,
      icon: icons.AmericanFootball,
    },
    {
      value: BASEBALL,
      header: BASEBALL,
      description: defaultDescription,
      icon: icons.Baseball,
    },
    {
      value: GOLF,
      header: GOLF,
      description: defaultDescription,
      icon: icons.Golf,
    },
    {
      value: BASKETBALL,
      header: BASKETBALL,
      description: defaultDescription,
      icon: icons.Basketball,
    },
    {
      value: TENNIS,
      header: TENNIS,
      description: defaultDescription,
      icon: icons.Tennis,
    },
    {
      value: HOCKEY,
      header: HOCKEY,
      description: defaultDescription,
      icon: icons.Hockey,
    },
    {
      value: HORSE_RACING,
      header: HORSE_RACING,
      description: defaultDescription,
      icon: icons.HorseRacing,
    },
    {
      value: OLYMPICS,
      header: OLYMPICS,
      description: defaultDescription,
      icon: icons.Olympics,
    },
    {
      value: BOXING,
      header: BOXING,
      description: defaultDescription,
      icon: icons.Boxing,
    },
    {
      value: MMA,
      header: MMA,
      description: defaultDescription,
      icon: icons.MMA,
    },
    {
      value: CAR_RACING,
      header: CAR_RACING,
      description: defaultDescription,
      icon: icons.CarRacing,
    },
  ],
  [OLYMPICS]: [
    {
      value: SUMMER,
      header: SUMMER,
      description: defaultDescription,
      icon: icons.Olympics,
    },
    {
      value: WINTER,
      header: WINTER,
      description: defaultDescription,
      icon: icons.Olympics,
    },
  ],
  [AMERICAN_FOOTBALL]: [
    {
      value: NFL,
      header: NFL,
      description: defaultDescription,
      icon: icons.AmericanFootball,
    },
    {
      value: NCAA,
      header: NCAA,
      description: defaultDescription,
      icon: icons.AmericanFootball,
    },
  ],
  [POLITICS]: [
    {
      value: US_POLITICS,
      header: US_POLITICS,
      description: defaultDescription,
      icon: icons.USPolitics,
    },
    {
      value: WORLD,
      header: WORLD,
      description: defaultDescription,
      icon: icons.World,
    },
  ],
  [ECONOMICS]: [
    {
      value: STATISTICS,
      header: STATISTICS,
      description: defaultDescription,
      icon: icons.Statistics,
    },
  ],
  [ENTERTAINMENT]: [
    {
      value: AWARDS,
      header: AWARDS,
      description: defaultDescription,
      icon: icons.Awards,
    },
    {
      value: TV_MOVIES,
      header: TV_MOVIES,
      description: defaultDescription,
      icon: icons.Movies,
    },
    {
      value: SOCIAL_MEDIA,
      header: SOCIAL_MEDIA,
      description: defaultDescription,
      icon: icons.TwitterButton,
    },
  ],
  [CRYPTO]: [
    {
      value: BITCOIN,
      header: BITCOIN,
      description: defaultDescription,
      inverseFill: true,
      icon: icons.BTC,
    },
    {
      value: ETHEREUM,
      header: ETHEREUM,
      description: defaultDescription,
      icon: icons.ETH,
    },
    {
      value: MAKER,
      header: MAKER,
      description: defaultDescription,
      inverseFill: true,
      icon: icons.MKR,
    },
/*
    {
      value: AUGUR,
      header: AUGUR,
      description: defaultDescription,
      icon: icons.REP,
    },
*/
    {
      value: AMPLE,
      header: AMPLE,
      description: defaultDescription,
      icon: icons.AMPL,
    },
    {
      value: COMPOUND,
      header: COMPOUND,
      description: defaultDescription,
      inverseFill: true,
      icon: icons.COMP,
    },
    {
      value: BALANCER,
      header: BALANCER,
      description: defaultDescription,
      inverseFill: true,
      icon: icons.BAL,
    },
    {
      value: ZEROX,
      header: ZEROX,
      description: defaultDescription,
      inverseFill: true,
      icon: icons.ZRX,
    },
    {
      value: CHAINLINK,
      header: CHAINLINK,
      description: defaultDescription,
      inverseFill: true,
      icon: icons.LINK,
    },
    {
      value: ADDITIONAL_TOKENS,
      header: ADDITIONAL_TOKENS,
      description: defaultDescription,
      inverseFill: true,
      icon: icons.TOKENS,
    },
  ],
};

export const MARKET_TYPE_TEMPLATES = [
  {
    value: YES_NO,
    header: 'Yes / No',
    description: 'There are two possible outcomes: “Yes” or “No”',
    icon: Popcorn,
    useIconColors: true,
  },
  {
    value: CATEGORICAL,
    header: 'Multiple Choice',
    description: 'There are up to 7 possible outcomes: “A”, “B”, “C” etc ',
    icon: Popcorn,
    useIconColors: true,
  },
  {
    value: SCALAR,
    header: 'Scalar',
    description:
      'A range of numeric outcomes: “USD range” between “1” and “100”.',
    icon: Popcorn,
    useIconColors: true,
  },
];

export const DESCRIPTION_PLACEHOLDERS = {
  [YES_NO]: 'Example: Will [person] win the [year] [event]?',
  [SCALAR]: 'Example: Which Team will win: [Team A] vs [Team B] on [date]?',
  [CATEGORICAL]:
    'Example: How many [goals/points] will [person] score in the [year] [event]?',
};

// Create market fields for validations
export const DESCRIPTION = 'description';
export const END_TIME = 'setEndTime';
export const CATEGORIES = 'categories';
export const HOUR = 'hour';
export const DESIGNATED_REPORTER_ADDRESS = 'designatedReporterAddress';
export const SATURDAY_DAY_OF_WEEK = 6;
export const FRIDAY_DAY_OF_WEEK = 5;
export const SUNDAY_DAY_OF_WEEK = 0;
export const OUTCOMES = 'outcomes';

export const DENOMINATION = 'scalarDenomination';
export const MIN_PRICE = 'minPrice';
export const MAX_PRICE = 'maxPrice';
export const TICK_SIZE = 'tickSize';

export const SETTLEMENT_FEE = 'settlementFee';
export const AFFILIATE_FEE = 'affiliateFee';

export const TEMPLATE_INPUTS = 'inputs';

export const VALIDATION_ATTRIBUTES = {
  [DESCRIPTION]: {
    label: DESCRIPTION,
    readableName: 'Description',
    checkFilledString: true,
    checkFilledStringMessage: 'Enter a market question',
  },
  [HOUR]: {
    label: HOUR,
    readableName: 'time',
    checkFilledNumber: true,
    checkFilledNumberMessage: 'Choose a time',
  },
  [CATEGORIES]: {
    label: CATEGORIES,
    readableName: 'category',
    checkCategories: true,
  },
  [END_TIME]: {
    label: END_TIME,
    readableName: 'date',
    checkFilledNumber: true,
    checkDateGreater: true,
    checkDateGreaterMessage: 'Event expiration time must be in the future',
    checkFilledNumberMessage: 'Choose a date',
  },
  [DESIGNATED_REPORTER_ADDRESS]: {
    label: DESIGNATED_REPORTER_ADDRESS,
    readableName: 'wallet address',
    checkFilledString: true,
    checkFilledStringMessage: 'Enter a wallet address',
    checkForAddress: true,
  },
  [OUTCOMES]: {
    label: OUTCOMES,
    readableName: 'outcomes',
    checkOutcomes: true,
  },
  [DENOMINATION]: {
    label: DENOMINATION,
    readableName: 'Unit of measurement',
    checkFilledString: true,
    checkFilledStringMessage: 'Enter a unit of measurement',
  },
  [MIN_PRICE]: {
    label: MIN_PRICE,
    readableName: 'Min',
    checkFilledNumber: true,
    checkLessThan: true,
    lessThanMessage: "Min can't be higher than max",
  },
  [MAX_PRICE]: {
    label: MAX_PRICE,
    readableName: 'Max',
    checkFilledNumber: true,
    checkMoreThan: true,
  },
  [TICK_SIZE]: {
    label: TICK_SIZE,
    readableName: 'Precision',
    checkFilledNumber: true,
    checkFilledNumberMessage: 'Enter precision',
    checkPositive: true,
    checkLessThan: false,
    checkDividedBy: true,
    checkDecimals: true,
    decimals: 9,
  },
  [SETTLEMENT_FEE]: {
    label: SETTLEMENT_FEE,
    readableName: 'Market creator fee',
    checkBetween: true,
    checkFilledNumber: true,
    checkFee: true,
    min: 0,
    max: 15,
  },
  [AFFILIATE_FEE]: {
    label: AFFILIATE_FEE,
    readableName: 'Affiliate fee',
    checkBetween: true,
    checkFilledNumber: true,
    checkPositive: true,
    checkWholeNumber: true,
    min: 0,
    max: 100,
  },
  [TEMPLATE_INPUTS]: {
    label: TEMPLATE_INPUTS,
    readableName: 'Template inputs',
    checkUserInputFilled: true,
  },
};

export const TemplateBannerText = {
  index:
    'Enter the full name of the index to ensure the market resolves as valid, i.e. S & P 500 Index',
  'stocks/etfs':
    'Enter Stock/ETFs name and ticker symbol to ensure the market resolves as valid, i.e. Apple (AAPL)',
  stocks:
    'Enter Stock name and ticker symbol to ensure the market resolves as valid, i.e. Apple (AAPL)',
  etfs:
    'Enter ETF name and ticker symbol to ensure the market resolves as valid, i.e. S & P 500 Index (SPY)',
};

export const SelectEventNoticeText =
  'Choose an event in the market question in order to select outcomes.';

export const ExchangeClosingMessage = 'Event expiration can not be before exchange closing, earliest allowed time, ';
export const MovieWednesdayAfterOpeningMessage = 'Earliest this market can resolve is the Wednesday after opening weekend, '
export enum MARKET_COPY_LIST {
  USE_A_TEMPLATE = 'USE_A_TEMPLATE',
  DONT_SEE_CAT = 'DONT_SEE_CAT',
  FROM_SCRATCH = 'FROM_SCRATCH',
  MARKET_TYPE = 'MARKET_TYPE',
  EVENT_EXPIRATION = 'EVENT_EXPIRATION',
  MARKET_QUESTION = 'MARKET_QUESTION',
  RESOLUTION_DETAILS = 'RESOLUTION_DETAILS',
  DESIGNATED_REPORTER = 'DESIGNATED_REPORTER',
  CREATOR_FEE = 'CREATOR_FEE',
  AFFILIATE_FEE = 'AFFILIATE_FEE',
  INITIAL_LIQUIDITY = 'INITIAL_LIQUIDITY',
  VISIBILITY = 'VISIBILITY',
  VALIDITY_BOND = 'VALIDITY_BOND',
  NO_SHOW_BOND = 'NO_SHOW_BOND',
  UNIT_OF_MEASURMENT = 'UNIT_OF_MEASURMENT',
  NUMERIC_RANGE = 'UNIT_OF_MEASURMENT',
  PRECISION = 'PRECISION',
}

export const MARKET_CREATION_COPY = {
  [MARKET_COPY_LIST.USE_A_TEMPLATE]: {
    subheader: [
      'These are templates of the most popular markets across different market categories. Templates simplify the creation of new markets and reduce errors in the market creation process. Each template is carefully structured so users have to choose or enter the variable aspect of their market.',
      'For example, a popular sports market template is: Which team will win: [Team Name A] vs [Team Name B]. In this template the user only needs to enter the two team names and doesn’t need to worry about how the wording of the market should be structured.',
    ],
  },
  [MARKET_COPY_LIST.DONT_SEE_CAT]: {
    subheader: [
      'Market templates are currently only available for the categories shown. If you want to create a market with a different category, you will need to create a custom market in the “Start from scratch” section.',
    ],
  },
  [MARKET_COPY_LIST.FROM_SCRATCH]: {
    subheader: [
      'Creating a custom market allows for maximum flexibility in the market creation process. It is recommended for advanced users only because there is a higher risk of error that can lead to an invalid market.',
    ],
  },
  [MARKET_COPY_LIST.MARKET_TYPE]: {
    subheader: [
      'A Yes/No market has two possible outcomes, as well as invalid. For example, Will Donald Trump win the 2020 presidential election? If he wins, the outcome “yes” will settle at 100%. If he loses, the outcome “yes” will settle at 0%.',
      'A multiple choice market, e.g., who will win the Super Bowl, has at least two and up to seven possible outcomes, as well as invalid. The winning outcome will settle at 100%. The losing outcomes will settle at 0%.',
      'A scalar market is measured on a numerical outcome along a scale. Scalar markets are good for situations where you want to trade on a direction and you don’t want to expose yourself to winner take all risk. For example: How much will Google settle at on 21 August, 2019? With a range between 500$-1500$.',
      'If you purchase at 1100$ and Google settles at 1250$. You win 150$ per share. If you purchase at 1100$ and Google settles at 1050$. You lose 50$ per share. If you sold at 1100$ and Google settles at 1250$. You lose 150$ per share. If you sold at 1100$ and Google settles at 1050$. You win 50$ per share.',
      'If an event resolves outside of the range, the market will resolve at the closest bound.',
    ],
  },
  [MARKET_COPY_LIST.EVENT_EXPIRATION]: {
    subheader: [
      'This is the time at which Augur users can start reporting on the outcome of the market. Since Augur does not have any centralized operator, it uses a system of incentivized communal reporting (the Augur oracle) to deem what outcome occurred.',
      'The Event Expiration date and time should be set at an appropriate time at which the outcome of the market question will be known. If the outcome is not known by this time, then the market will almost certainly resolve Invalid.',
      'Provide a sufficient cushion of time between the event in question and Event Expiration to help ensure that the outcome will be known by this point. For example, if creating a market on the outcome of a sporting event, set the Event Expiration to at least several hours after the game will end to accommodate for potential delays due to weather and other factors.',
    ],
  },
  [MARKET_COPY_LIST.MARKET_QUESTION]: {
    subheader: [
      'Your market question should be about a future occurrence that will take place between the time of market creation and the start of market reporting. It should concern an outcome that is objective, verifiable, and unambiguous. A market that is subjective, unverifiable, or ambiguous will most likely be sparsely traded in and almost certainly resolve Invalid.',
      'At Event Expiration (described below), there must be one and only one clear outcome. If none of the listed outcomes or more than one of the listed outcomes occurred, the market will most likely resolve Invalid.',
      'If the market question contains a date and time, make sure that the date and time are before Reporting Start Time, and ideally, specify the time in UTC+0.',
    ],
  },
  [MARKET_COPY_LIST.RESOLUTION_DETAILS]: {
    subheader: [
      'Specify any further details that will help reporters resolve the outcome. To minimize the risk of Invalid resolution, remove as much potential ambiguity as possible and specify what will happen under different potential circumstances.',
      'Consider possible circumstances that could render the outcome ambiguous and account for such circumstances by doing one or more of the following: 1) make the market question more specific 2) add more outcomes (if a Multiple Choice market) or 3) address specific circumstances here.',
      'For example, if creating a market about the number of Twitter followers a public figure will have on a future date, you may specify here that if the individual changes their Twitter handle, the market shall resolve based on the following for the new handle.',
      'If you cite a website that has more than one data set, specify which data set will be used, as in a specific chart, table, or section of the website.',
    ],
  },
  [MARKET_COPY_LIST.DESIGNATED_REPORTER]: {
    subheader: [
      'The Designated Reporter is the Ethereum address selected to initially report on the market’s outcome. The Designated Reporter is most often set to the market creator, but it may be set to any Ethereum address.',
      'The Designated Reporter will have 24 hours after Reporting Start Time to submit a report (select a winning outcome). If a report is not submitted by this time, the market will enter Open Reporting, at which time anyone can report on it. If the Designated Reporter does not report within 24 hours of Reporting Start Time, then they will not receive back the no-show bond. Once the designated or open reporter submit a report, other Augur users will have the option of disputing it before the market resolves.',
    ],
  },
  [MARKET_COPY_LIST.CREATOR_FEE]: {
    subheader: [
      'The Market Creator fee is the percentage amount the market creator receives whenever market shares are settled, either during trading or upon market resolution.',
      'Set fees to under 2% in order for your market to show up to traders, by default. If you set your fees to zero or near zero, that may provide less incentive for affiliates to promote your market. However, if you set fees too high, that may dissuade traders. Markets currently average around 1% fees.',
    ],
  },
  [MARKET_COPY_LIST.AFFILIATE_FEE]: {
    subheader: [
      'This is the percentage of the Market Creator fee that Affiliates collect. The Affiliate Allocation helps markets get promoted and acquire more traders. Affiliate marketers share links to Augur and then collect a portion of fees whenever someone follows that link and trades in a market. So the Affiliate Allocation incentivizes marketers to spread your market.',
    ],
  },
  [MARKET_COPY_LIST.INITIAL_LIQUIDITY]: {
    subheader: [
      'It is essential to add liquidity to your market for users to see it. The tighter the spread and more liquidity you add, the higher your market will rank and the more people will see it.',
      'Markets that do not have a 10% or smaller spread (for at least one outcome, if a multiple choice market), between the highest bid and the lowest offer, will not show up to traders, by default.',
      'For instance, a Yes/No market with a .56 bid and .65 offer would have a 9% spread, so it will show up. A market with a .55 bid and .71 offer would have a 16% spread, so it will not show up.',
    ],
  },
  [MARKET_COPY_LIST.VISIBILITY]: {
    subheader: [
      'Markets are sorted based on their liquidity, and more liquid markets rank higher and are more visible to traders. To increase the rank and visibility of your market, add Buy and Sell offers in a tight spread with sizable volume on each side.',
      'A market must have a spread of 15% or smaller, inclusive of the Market Creator Fee, in order to be visible to traders in the default sort. If it’s a multiple choice market, it must have at least one outcome that satisfies these criteria.',
      'For instance, a Yes/No market with a .55 bid and .65 offer would have a 10% spread, so it will show up. A market with a .55 bid and .71 offer would have a 16% spread, so it will not show up. This calculation accounts for fees. For instance, if a market has a .30 bid and a .44 offer, it will not show up if fees are over 1%.',
    ],
  },
  [MARKET_COPY_LIST.VALIDITY_BOND]: {
    subheader: [
      'You must put up a “Validity Bond” denominated in DAI that will be returned upon market resolution if and only if the market does not resolve Invalid. A market may resolve Invalid if its outcome is ambiguous, subjective, unverifiable, or if the market’s listed outcomes do not include the actual outcome that occurred.',
      'If the market resolves Invalid, the Validity Bond is forfeited to reporters. The Validity Bond is set dynamically based on the recent rate of Invalid markets.'
    ],
  },
  [MARKET_COPY_LIST.NO_SHOW_BOND]: {
    subheader: [
      'You must put up a No-Show bond, denominated in REPv2 that will be returned upon market resolution if and only if the Designated Reporter submits a report within 24 hours of the market’s Reporting Start Time. If the Designated Reporter does not submit a report within 24 hours, the bond is forfeited to the first person to report the outcome in open reporting.'
    ],
  },
  [MARKET_COPY_LIST.UNIT_OF_MEASURMENT]: {
    subheader: [
      'The unit of measurement is the denomination by which a Scalar market’s outcome is quantified. For example, the USD or Euro could be the unit of measurement in a market on “What will the price of Bitcoin be on March 31st.” Each Scalar market must have one and only one unit of measurement.',
      'Markets can be denominated in any quantifiable and measurable unit such as USD, degrees Fahrenheit, inches of rainfall, or points. If using a generic currency symbol, such as $, make sure to specify which type e.g., USD, CAD, HKD, etc.'
    ],
  },
  [MARKET_COPY_LIST.NUMERIC_RANGE]: {
    subheader: [
      'The Numeric Range spans from the minimum to maximum price at which traders can buy or sell shares and determines how the end payout for long and short shares is calculated. Unlike other types of markets, Scalar markets are not winner takes all. The payout for long and short shares is the difference between the purchase price and settlement price.',
      'For instance, let’s say there’s a market on how many points will be scored in a basketball game with a range from 80 to 120 points. If 1 share is purchased at 90 and 100 points are scored in the game, 10 DAI is earned per share purchased. If 1 share is sold at 90 and the final score is 100 points, 10 DAI is lost per share purchased.'
    ],
  },
  [MARKET_COPY_LIST.PRECISION]: {
    subheader: [
      'The Precision is the smallest increment in which traders can price shares. For example, consider a market on the number of inches of rainfall in Chicago in April. If the Denomination is inches, the range is 0 to 3, and the precision is set to 1, then traders can buy or sell shares at 0, 1, 2, or 3. If the precision is set to .1, traders can buy or sell shares at 0, .1, .2 … 9.8, 9.9, 10.'
    ],
  },
};
