import { YES_NO, SCALAR, CATEGORICAL } from 'modules/common/constants';
import * as icons from 'modules/categories/icons';

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
	title: "Review",
	largeHeader: "Review market details",
	previewButton: true,
	explainerBlockTitle: "Double check the details",
	explainerBlockSubtexts: [
		"Reporting Start Time must not conflict with the Market Question or Resolution Details. If they don’t match up there is a high probability that the market will resolve as invalid."
	],
	mainContent: REVIEW,
	firstButton: BACK,
	secondButton: CREATE
};

export const CUSTOM_CONTENT_PAGES = [
  EventDetailsContent,
  LiquidityContent,
  ReviewContent,
];

// template page content
export const SUB_CATEGORIES = 'subCategories';

export const TEMPLATE_CONTENT_PAGES = [
  { title: 'Category' },
  {
    title: 'Sub-Category',
    mainContent: SUB_CATEGORIES,
    firstButton: BACK,
    secondButton: NEXT,
  },
  { title: 'Market Type', firstButton: BACK, secondButton: NEXT },
  { title: 'Template', firstButton: BACK, secondButton: NEXT },
  { title: 'Event Details', firstButton: BACK, secondButton: NEXT },
  LiquidityContent,
  ReviewContent,
];

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

export const MARKET_TEMPLATES = [
  {
    value: SPORTS,
    header: SPORTS,
    description: '80 Markets  |  76.1k',
    icon: icons.Sports,
  },
  {
    value: POLITICS,
    header: POLITICS,
    description: '110 Markets  |  134.5k',
    icon: icons.Politics,
  },
  {
    value: FINANCE,
    header: FINANCE,
    description: '100 Markets  |  127.4k',
    icon: icons.Finance,
  },
  {
    value: ENTERTAINMENT,
    header: ENTERTAINMENT,
    description: '125 Markets  |  717.2k',
    icon: icons.Entertainment,
  },
  {
    value: CRYPTO,
    header: CRYPTO,
    description: '148 Markets  |  827.4k',
    icon: icons.Crypto,
  },
];

export const MARKET_SUB_TEMPLATES = {
  [SPORTS]: [
    {
      value: SOCCER,
      header: SOCCER,
      description: '128 Markets  |  727.4k',
      icon: icons.Soccer,
    },
    {
      value: AMERICAN_FOOTBALL,
      header: AMERICAN_FOOTBALL,
      description: '128 Markets  |  727.4k',
      icon: icons.AmericanFootball,
    },
    {
      value: BASEBALL,
      header: BASEBALL,
      description: '128 Markets  |  727.4k',
      icon: icons.Baseball,
    },
    {
      value: GOLF,
      header: GOLF,
      description: '128 Markets  |  727.4k',
      icon: icons.Golf,
    },
    {
      value: BASKETBALL,
      header: BASKETBALL,
      description: '128 Markets  |  727.4k',
      icon: icons.Basketball,
    },
    {
      value: TENNIS,
      header: TENNIS,
      description: '128 Markets  |  727.4k',
      icon: icons.Tennis,
    },
    {
      value: HOCKEY,
      header: HOCKEY,
      description: '128 Markets  |  727.4k',
      icon: icons.Hockey,
    },
    {
      value: HORSE_RACING,
      header: HORSE_RACING,
      description: '128 Markets  |  727.4k',
      icon: icons.HorseRacing,
    },
  ],
  [POLITICS]: [
    {
      value: US_ELECTIONS,
      header: US_ELECTIONS,
      description: '128 Markets  |  727.4k',
      icon: icons.USElections,
    },
    {
      value: US_POLITICS,
      header: US_POLITICS,
      description: '128 Markets  |  727.4k',
      icon: icons.USPolitics,
    },
    {
      value: WORLD,
      header: WORLD,
      description: '128 Markets  |  727.4k',
      icon: icons.World,
    },
  ],
  [FINANCE]: [
    {
      value: STOCKS,
      header: STOCKS,
      description: '128 Markets  |  727.4k',
      icon: icons.Stocks,
    },
    {
      value: COMMONDITIES,
      header: COMMONDITIES,
      description: '128 Markets  |  727.4k',
      icon: icons.Commodities,
    },
    {
      value: INDEXES,
      header: INDEXES,
      description: '128 Markets  |  727.4k',
      icon: icons.Indexes,
    },
  ],
  [ENTERTAINMENT]: [
    {
      value: AWARDS,
      header: AWARDS,
      description: '128 Markets  |  727.4k',
      icon: icons.Awards,
    },
    {
      value: MOVIES,
      header: MOVIES,
      description: '128 Markets  |  727.4k',
      icon: icons.Movies,
    },
    {
      value: MUSIC,
      header: MUSIC,
      description: '128 Markets  |  727.4k',
      icon: icons.Music,
    },
    {
      value: TV,
      header: TV,
      description: '128 Markets  |  727.4k',
      icon: icons.TV,
    },
  ],
  [CRYPTO]: [
    {
      value: BITCOIN,
      header: BITCOIN,
      description: '128 Markets  |  727.4k',
      icon: icons.BTC,
    },
    {
      value: ETHEREUM,
      header: ETHEREUM,
      description: '128 Markets  |  727.4k',
      icon: icons.ETH,
    },
    {
      value: LITECOIN,
      header: LITECOIN,
      description: '128 Markets  |  727.4k',
      icon: icons.LTC,
    },
    {
      value: AUGUR,
      header: AUGUR,
      description: '128 Markets  |  727.4k',
      icon: icons.REP,
    },
  ],
};

export const DESCRIPTION_PLACEHOLDERS = {
  [YES_NO]: 'Example: Will [person] win the [year] [event]?',
  [SCALAR]: 'Example: Which Team will win: [Team A] vs [Team B] on [date]?',
  [CATEGORICAL]:
    'Example: How many [goals/points] will [person] score in the [year] [event]?',
};

// Create market fields for validations
export const DESCRIPTION = 'description';
export const END_TIME = 'endTime';
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
    lessThanMessage: 'Min can\'t be higher than max'
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
    checkLessThan: true,
    checkDecimals: true,
    decimals: 9,
  },
  [SETTLEMENT_FEE]: {
    label: SETTLEMENT_FEE,
    readableName: 'Market creator fee',
    checkBetween: true,
    checkFilledNumber: true,
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
};
