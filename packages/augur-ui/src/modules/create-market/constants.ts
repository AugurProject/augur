
// Button Types
export const BACK = "back";
export const NEXT = "next";
export const CREATE = "create";

// Page content
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