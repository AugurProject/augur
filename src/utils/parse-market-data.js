import { BINARY, CATEGORICAL, SCALAR, COMBINATORIAL } from '../modules/markets/constants/market-types';
import { INDETERMINATE_OUTCOME_ID, INDETERMINATE_OUTCOME_NAME, YES, NO } from '../modules/markets/constants/market-outcomes';

const CATEGORICAL_CHOICES_SEPARATOR = '~|>';
const CATEGORICAL_CHOICE_SEPARATOR = '|';

export function ParseMarketsData(marketsData) {
	var o = {
			marketsData: {},
			outcomesData: {}
		},
		market,
		outcomes,
		categoricalOutcomeNames;

	Object.keys(marketsData).forEach(marketID => {
		market = marketsData[marketID];
		outcomes = market.outcomes;
		delete market.outcomes;

		if (!outcomes || !outcomes.length) {
			return;
		}

		o.marketsData[marketID] = market;

		// get outcomes embedded in market description for categorical
		if (market.type === CATEGORICAL && market.description && market.description.indexOf(CATEGORICAL_CHOICES_SEPARATOR) >= 0) {
			categoricalOutcomeNames = ParseCategoricalOutcomeNamesFromDescription(market);
		}

		// reduce array-of-outcomes to object-of-outcomes, with outcome ids as the object keys
		o.outcomesData[marketID] = outcomes.reduce((p, outcome, i) => {
			p[outcome.id] = {
				...outcome,
				originalSort: i
			};

			if (outcome.id === INDETERMINATE_OUTCOME_ID) {
				p[outcome.id].name = INDETERMINATE_OUTCOME_NAME;
				return p;
			}

			switch (market.type) {
				case BINARY:
					p[outcome.id].name = parseInt(outcome.id, 10) === NO ? 'No' : 'Yes';
					return p;

				case CATEGORICAL:
					if (categoricalOutcomeNames) {
						p[outcome.id].name = categoricalOutcomeNames[i] && categoricalOutcomeNames[i].trim() || outcome.id.toString();
					}
					else {
						p[outcome.id].name = outcome.id.toString();
					}
					return p;

				case SCALAR:
					p[outcome.id].name = parseInt(outcome.id, 10) === NO ? '⇩' : '⇧';
					return p;

				case COMBINATORIAL:
					return p;

				default:
					console.info("Unknown type:", market.type, market);
					return p;
			}
		}, {});
	});

	return o;
}

export function ParseCategoricalOutcomeNamesFromDescription(market) {
	var splitDescription = market.description.split(CATEGORICAL_CHOICES_SEPARATOR),
		categoricalOutcomeNames = splitDescription.pop().split(CATEGORICAL_CHOICE_SEPARATOR);

	market.description = splitDescription.join('').trim();

	return categoricalOutcomeNames;
}

export function MakeDescriptionFromCategoricalOutcomeNames(market) {
	var description = market.description + CATEGORICAL_CHOICES_SEPARATOR + market.outcomes.map(outcome => outcome.name).join(CATEGORICAL_CHOICE_SEPARATOR);
console.log('MakeDescriptionFromCategoricalOutcomeNames: ', description, ' --- ', market);
	return description;
}

/*
export function ParseMinMaxNumOutcomes(marketData) {
	switch(marketData.type) {
		case BINARY:
			marketData.minValue = 1;
			marketData.maxValue = 2;
			marketData.numOutcomes = 2;
			return;

		case CATEGORICAL:
			marketData.scalarSmallNum = 1;
			marketData.scalarBigNum = 2;
			marketData.numOutcomes = marketData.outcomes.length;
			return;

		case SCALAR:
			marketData.minValue = 1;
			marketData.maxValue = 2;
			marketData.numOutcomes = 2;
			return;
	}
}
*/