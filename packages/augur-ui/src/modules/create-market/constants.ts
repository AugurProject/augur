import {
  YES_NO,
  SCALAR,
  CATEGORICAL,
  YES_NO_OUTCOMES,
  EXPIRY_SOURCE_GENERIC,
  DESIGNATED_REPORTER_SELF,
  SETTLEMENT_FEE_DEFAULT,
  AFFILIATE_FEE_DEFAULT,
  ZERO,
  ONE,
} from 'modules/common/constants';
import { NewMarket } from 'modules/types';
import * as icons from 'modules/common/icons';
import { Popcorn } from 'modules/common/icons';

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

export const EMPTY_STATE: NewMarket = {
  isValid: false,
  validations: {
    description: null,
    categories: ['', '', ''],
    designatedReporterAddress: null,
    expirySourceType: null,
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
  expirySourceType: EXPIRY_SOURCE_GENERIC,
  expirySource: '',
  backupSource: '',
  designatedReporterType: DESIGNATED_REPORTER_SELF,
  designatedReporterAddress: '',
  endTime: null,
  setEndTime: null,
  tickSize: 0.01,
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

const EventDetailsContent = {
  title: 'Event details',
  largeHeader: 'Create a custom market',
  explainerBlockTitle: 'A note on choosing a market',
  explainerBlockSubtexts: [
    "Create markets that will have an objective outcome by the events end time. Avoid creating markets that have subjective or ambiguous outcomes. If you're not sure that the market's outcome will be known beyond a reasonable doubt by the reporting start time, you should not create the market.",
    'A market only covers events that occur after market creation time and on or before reporting start time. If the event occurs outside of these bounds it has a high probability as resolving as invalid.',
  ],
  mainContent: FORM_DETAILS,
  firstButton: BACK,
  secondButton: NEXT,
};

const LiquidityContent = {
  title: 'Fees & liquidity',
  largeHeader: 'Fee & liquidity',
  noDarkBackground: true,
  mainContent: FEES_LIQUIDITY,
  firstButton: BACK,
  secondButton: NEXT,
};

const ReviewContent = {
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
  EventDetailsContent,
  LiquidityContent,
  ReviewContent,
];

// template page content
export const SUB_CATEGORIES = 'subCategories';
export const MARKET_TYPE = 'marketType';
export const TEMPLATE_PICKER = 'templatePicker';

function checkValid(data) {
  return data === '' || !data;
}

export const TEMPLATE_CONTENT_PAGES = [
  { title: 'Category' },
  {
    title: 'Sub-Category',
    mainContent: SUB_CATEGORIES,
    firstButton: BACK,
    secondButton: NEXT,
    disabledFunction: newMarket => checkValid(newMarket.categories[1]),
  },
  {
    title: 'Market Type',
    mainContent: MARKET_TYPE,
    firstButton: BACK,
    secondButton: NEXT,
    disabledFunction: newMarket => checkValid(newMarket.marketType),
  },
  {
    title: 'Template',
    mainContent: TEMPLATE_PICKER,
    firstButton: BACK,
    secondButton: NEXT,
    disabledFunction: newMarket => checkValid(newMarket.template),
  },
  {
    title: 'Event Details',
    largeHeader: 'Enter the event details',
    explainerBlockTitle: 'A note on choosing a market',
    explainerBlockSubtexts: [
      "Create markets that will have an objective outcome by the events end time. Avoid creating markets that have subjective or ambiguous outcomes. If you're not sure that the market's outcome will be known beyond a reasonable doubt by the reporting start time, you should not create the market.Create markets that will have an objective outcome by the events end time. Avoid creating markets that have subjective or ambiguous outcomes. If you're not sure that the market's outcome will be known beyond a reasonable doubt by the reporting start time, you should not create the market.",
      'A market only covers events that occur after market creation time and on or before reporting start time. If the event occurs outside of these bounds it has a high probability of resolving as invalid.',
    ],
    mainContent: TEMPLATE_FORM_DETAILS,
    firstButton: BACK,
    secondButton: NEXT,
  },
  LiquidityContent,
  ReviewContent,
];

export const NO_CAT_TEMPLATE_CONTENT_PAGES = TEMPLATE_CONTENT_PAGES.filter(page => page.title !== 'Sub-Category');


// Market Type Names
export const MARKET_TYPE_NAME = {
  [YES_NO]: 'Yes/No',
  [SCALAR]: 'Scalar',
  [CATEGORICAL]: 'Categorical',
};

// Market templates
export const SPORTS = 'Sports';
export const POLITICS = 'Politics';
export const FINANCE = 'Finance';
export const ENTERTAINMENT = 'Entertainment';
export const CRYPTO = 'Crypto';

// Market Subtemplates
export const SOCCER = 'Soccer';
export const AMERICAN_FOOTBALL = 'American Football';
export const BASEBALL = 'Baseball';
export const GOLF = 'Golf';
export const BASKETBALL = 'Basketball';
export const TENNIS = 'Tennis';
export const HOCKEY = 'Hockey';
export const HORSE_RACING = 'Horse Racing';
export const US_ELECTIONS = 'US Elections';
export const US_POLITICS = 'US Politics';
export const WORLD = 'World';
export const STOCKS = 'Stocks';
export const COMMONDITIES = 'Commondities';
export const INDEXES = 'Indexes';
export const AWARDS = 'Awards';
export const MOVIES = 'Movies';
export const MUSIC = 'Music';
export const TV = 'TV';
export const BITCOIN = 'Bitcoin';
export const ETHEREUM = 'Ethereum';
export const LITECOIN = 'Litecoin';
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
  [POLITICS]: [
    {
      value: US_ELECTIONS,
      header: US_ELECTIONS,
      description: defaultDescription,
      icon: icons.USElections,
    },
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
      value: COMMONDITIES,
      header: COMMONDITIES,
      description: defaultDescription,
      icon: icons.Commodities,
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
export const EXPIRY_SOURCE = 'expirySource';

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
  [EXPIRY_SOURCE]: {
    label: EXPIRY_SOURCE,
    readableName: 'website',
    checkFilledString: true,
    checkFilledStringMessage: 'Enter a website',
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
