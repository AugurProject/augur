import {
  YES_NO,
  SCALAR,
  CATEGORICAL
} from "modules/common/constants";
import { Sports, Politics, Finance, Crypto, Entertainment } from "modules/common/icons";

// Button Types
export const BACK = "back";
export const NEXT = "next";
export const CREATE = "create";

// Pages
export const LANDING = "LANDING";
export const SCRATCH = "SCRATCH";
export const TEMPLATE = "TEMPLATE";

export const MARKET_CREATION_PAGES = [
	LANDING,
	SCRATCH, 
	TEMPLATE
];

// Scratch Page Content
export const REVIEW = "review";
export const FORM_DETAILS = "formDetails";

const EventDetailsContent = {
	title: "Event details",
	largeHeader: "Create a custom market",
	explainerBlockTitle: "A note on choosing a market",
	explainerBlockSubtexts: [
	      "Create markets that will have an objective outcome by the events end time. Avoid creating markets that have subjective or ambiguous outcomes. If you're not sure that the market's outcome will be known beyond a reasonable doubt by the reporting start time, you should not create the market.",
	      "A market only covers events that occur after market creation time and on or before reporting start time. If the event occurs outside of these bounds it has a high probability as resolving as invalid."
	    ],
	mainContent: FORM_DETAILS,
	firstButton: BACK,
	secondButton: NEXT
};

const LiquidityContent = {
	title: "Fees & liquidity",
	largeHeader: "Fee & liquidity",
	firstButton: BACK,
	secondButton: NEXT
};

const ReviewContent = {
	title: "Review",
	largeHeader: "Review market details",
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
	ReviewContent
];

// Market Type Names
export const MARKET_TYPE_NAME = {
  [YES_NO]: "Yes/No",
  [SCALAR]: "Scalar",
  [CATEGORICAL]: "Categorical"
};

// Market templates
export const SPORTS = "Sports";
export const POLITICS = "Politics";
export const FINANCE = "Finance";
export const ENTERTAINMENT = "Entertainment";
export const CRYPTO = "Crypto";


export const MARKET_TEMPLATES = [
	{
	  value: SPORTS,
	  header: SPORTS,
	  description: "80 Markets  |  76.1k",
	  icon: Sports
	},
	{
	  value: POLITICS,
	  header: POLITICS,
	  description: "110 Markets  |  134.5k",
	  icon: Politics
	},
	{
	  value: FINANCE,
	  header: FINANCE,
	  description: "100 Markets  |  127.4k",
	  icon: Finance
	},
	{
	  value: ENTERTAINMENT,
	  header: ENTERTAINMENT,
	  description: "125 Markets  |  717.2k",
	  icon: Entertainment
	},
	{
	  value: CRYPTO,
	  header: CRYPTO,
	  description: "148 Markets  |  827.4k",
	  icon: Crypto
	},
]
