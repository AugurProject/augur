const CATEGORICAL_CHOICES_SEPARATOR = '~|>';
const CATEGORICAL_CHOICE_SEPARATOR = '|';

export default function makeDescription(market) {
	const description = market.description +
		CATEGORICAL_CHOICES_SEPARATOR +
		market.outcomes.map(outcome =>
			outcome.name).join(CATEGORICAL_CHOICE_SEPARATOR);
	return description;
};