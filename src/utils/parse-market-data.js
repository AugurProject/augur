import { BINARY, CATEGORICAL, SCALAR, COMBINATORIAL } from '../modules/markets/constants/market-types';
import { INDETERMINATE_OUTCOME_ID, INDETERMINATE_OUTCOME_NAME, YES, NO } from '../modules/markets/constants/market-outcomes';

const CATEGORICAL_CHOICES_SEPARATOR = '~|>';
const CATEGORICAL_CHOICE_SEPARATOR = '|';

const CATEGORICAL_CHOICES_SEPARATOR2 = 'Choices:';
const CATEGORICAL_CHOICE_SEPARATOR2 = ',';

export function ParseMarketsData(marketsData) {
	var o = {
			marketsData: {},
			outcomesData: {}
		},
		marketData,
		outcomes,
		categoricalOutcomeNames;

	Object.keys(marketsData).forEach(marketID => {
		marketData = marketsData[marketID];
		outcomes = marketData.outcomes;
		delete marketData.outcomes;

		if (!outcomes || !outcomes.length || !marketData.events || !marketData.events.length) {
			return;
		}

		marketData.eventID = marketData.events[0].id;
		marketData.minValue = marketData.events[0].minValue;
		marketData.maxValue = marketData.events[0].maxValue;
		marketData.numOutcomes = marketData.events[0].numOutcomes;
		delete marketData.events;

		o.marketsData[marketID] = marketData;

		// get outcomes embedded in market description for categorical
		if (marketData.description && (marketData.type === CATEGORICAL || marketData.type === BINARY)) {
			categoricalOutcomeNames = ParseCategoricalOutcomeNamesFromDescription(marketData);
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

			switch (marketData.type) {
				case BINARY:
					if (categoricalOutcomeNames) {
						p[outcome.id].name = categoricalOutcomeNames[i] && categoricalOutcomeNames[i].trim() || outcome.id.toString();
					} else {
						p[outcome.id].name = parseInt(outcome.id, 10) === NO ? 'No' : 'Yes';
					}
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
					console.info("Unknown type:", marketData.type, marketData);
					return p;
			}
		}, {});
	});

	return o;
}

export function ParseCategoricalOutcomeNamesFromDescription(marketData) {
	var splitDescription,
		categoricalOutcomeNames;

	if (marketData.description.indexOf(CATEGORICAL_CHOICES_SEPARATOR) >= 0) {
		splitDescription = marketData.description.split(CATEGORICAL_CHOICES_SEPARATOR),
		categoricalOutcomeNames = splitDescription.pop().split(CATEGORICAL_CHOICE_SEPARATOR);
	}
	else if (marketData.description.indexOf(CATEGORICAL_CHOICES_SEPARATOR2) >= 0) {
		splitDescription = marketData.description.split(CATEGORICAL_CHOICES_SEPARATOR2),
		categoricalOutcomeNames = splitDescription.pop().split(CATEGORICAL_CHOICE_SEPARATOR2);
	}
	else {
		return [];
	}

	marketData.description = splitDescription.join('').trim();

	return categoricalOutcomeNames.map(name => name.trim());
}

export function MakeDescriptionFromCategoricalOutcomeNames(market) {
	var description = market.description + CATEGORICAL_CHOICES_SEPARATOR + market.outcomes.map(outcome => outcome.name).join(CATEGORICAL_CHOICE_SEPARATOR);
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