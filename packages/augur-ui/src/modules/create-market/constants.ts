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
} from 'modules/common/constants';
import { NewMarket } from 'modules/types';
import * as icons from 'modules/common/icons';
import { Popcorn } from 'modules/common/icons';
import {
  SPORTS,
  POLITICS,
  FINANCE,
  ENTERTAINMENT,
  CRYPTO,
  SOCCER,
  AMERICAN_FOOTBALL,
  BASEBALL,
  GOLF,
  BASKETBALL,
  TENNIS,
  HOCKEY,
  HORSE_RACING,
  NFL,
  NCAA,
  US_POLITICS,
  WORLD,
  STOCKS,
  INDEXES,
  BITCOIN,
  ETHEREUM,
  LITECOIN,
} from '@augurproject/artifacts';

export const INVALID_OUTCOME = 'Market is Invalid';

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
export const DEFAULT_TICK_SIZE = 0.01;

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
  scalarSmallNum: '',
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
  settlementFee: SETTLEMENT_FEE_DEFAULT,
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

export const EventDetailsContentTemplate = `template`;
export const EventDetailsContent = (type = `custom`) => ({
  title: 'Event details',
  largeHeader: `Create a ${type} market`,
  explainerBlockTitle: 'A market is invalid if:',
  explainerBlockSubtexts: [
    'The market question is subjective in nature.',
    'The result of the event was known at market creation time.',
    'The outcome was not known at event expiration time.',
    'The title, details and outcomes are in direct conflict with each other.',
    'There are strong arguments for the market resolving as multiple outcomes, unless it is explicitly stated how the market should be resolved in resolution details.',
    'If using a resolution source (a source is a noun that reports on or decides the result of a market), the source\'s URL or full name is NOT in the Market Question, regardless of it being in the resolution details.',
    'If using a resolution source, it is not referenced consistently between the Market Question and Resolution Details e.g. as either a URL or its full name',
    'If it’s a stock, currency or cryptocurrency and its ticker is not used in the market question.',
    'If it’s an index and the indexes full name is not in the market question.',
    'A market only covers events that occur after market creation time and on or before reporting start time. If the event occurs outside of these bounds it has a high probability as resolving as invalid.',
    'For any sports market that lists a player or team not in the correct league, division or conference, at the time the market was created, the market should resolve as invalid.',
  ],
  mainContent: type == EventDetailsContentTemplate ? TEMPLATE_FORM_DETAILS : FORM_DETAILS,
  firstButton: BACK,
  secondButton: NEXT,
  useBullets: true
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
  explainerBlockTitle: 'Double check the details',
  explainerBlockSubtexts: [
    'Event expiration must not conflict with the Market Question or Resolution Details. If they don’t match up there is a high probability that the market will resolve as invalid.',
  ],
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

// Market Subtemplates
export const AWARDS = 'Awards';
export const MOVIES = 'Movies';
export const MUSIC = 'Music';
export const TV = 'TV';
export const AUGUR = 'Augur';

const defaultDescription = '-  |  -';
export interface MarketCardTemplate {
  value: string;
  header: string;
  description: string;
  icon: JSX.Element;
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
    value: FINANCE,
    header: FINANCE,
    description: defaultDescription,
    icon: icons.Finance,
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
  [FINANCE]: [
    {
      value: STOCKS,
      header: STOCKS,
      description: defaultDescription,
      icon: icons.Stocks,
    },
    {
      value: INDEXES,
      header: INDEXES,
      description: defaultDescription,
      icon: icons.Indexes,
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
      value: MOVIES,
      header: MOVIES,
      description: defaultDescription,
      icon: icons.Movies,
    },
    {
      value: MUSIC,
      header: MUSIC,
      description: defaultDescription,
      icon: icons.Music,
    },
    {
      value: TV,
      header: TV,
      description: defaultDescription,
      icon: icons.TV,
    },
  ],
  [CRYPTO]: [
    {
      value: BITCOIN,
      header: BITCOIN,
      description: defaultDescription,
      icon: icons.BTC,
    },
    {
      value: ETHEREUM,
      header: ETHEREUM,
      description: defaultDescription,
      icon: icons.ETH,
    },
    {
      value: LITECOIN,
      header: LITECOIN,
      description: defaultDescription,
      icon: icons.LTC,
    },
    {
      value: AUGUR,
      header: AUGUR,
      description: defaultDescription,
      icon: icons.REP,
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
    checkDateGreaterMessage: 'Reporting start must be in the future',
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
    max: 50,
  },
  [AFFILIATE_FEE]: {
    label: AFFILIATE_FEE,
    readableName: 'Affiliate fee',
    checkBetween: true,
    checkFilledNumber: true,
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
  [INDEXES] : 'Enter the full name of the index to ensure the market resolves as valid, i.e. S & P 500 Index',
  [STOCKS] : 'Enter stock ticker symbol to ensure the market resolves as valid, i.e. AAPL'
}
