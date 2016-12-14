import { UPDATE_MARKETS_DATA } from '../../markets/actions/update-markets-data';
import { UPDATE_OUTCOME_PRICE } from '../../markets/actions/update-outcome-price';

import { BINARY, CATEGORICAL, SCALAR } from '../../markets/constants/market-types';
import { CATEGORICAL_OUTCOMES_SEPARATOR, CATEGORICAL_OUTCOME_SEPARATOR, BINARY_YES_ID, SCALAR_UP_ID } from '../../markets/constants/market-outcomes';

export default function (outcomesData = {}, action) {
	switch (action.type) {
		case UPDATE_MARKETS_DATA:
			return {
				...outcomesData,
				...parseOutcomes(action.marketsData, outcomesData)
			};

		case UPDATE_OUTCOME_PRICE:
			if (!outcomesData || !outcomesData[action.marketID] || !outcomesData[action.marketID][action.outcomeID]) {
				return outcomesData;
			}
			return {
				...outcomesData,
				[action.marketID]: {
					...outcomesData[action.marketID],
					[action.outcomeID]: {
						...outcomesData[action.marketID][action.outcomeID],
						price: action.price
					}
				}
			};

		default:
			return outcomesData;
	}
}

function parseOutcomes(newMarketsData, outcomesData) {
	return Object.keys(newMarketsData).reduce((p, marketID) => {
		const marketData = newMarketsData[marketID];

		if (!marketData.type || !marketData.outcomes || !marketData.outcomes.length) {
			return p;
		}

		switch (marketData.type) {
			case BINARY:
				p[marketID] = {
					...outcomesData[marketID],
					...parseBinaryOutcomes(marketData)
				};
				return p;

			case CATEGORICAL:
				p[marketID] = {
					...outcomesData[marketID],
					...parseCategoricalOutcomes(marketData, marketID)
				};
				return p;

			case SCALAR:
				p[marketID] = {
					...outcomesData[marketID],
					...parseScalarOutcomes(marketData, marketID)
				};
				return p;

			default:
				console.warn('Unknown market type:', marketID, marketData.type, marketData);
				return p;
		}
	}, {});

	function parseBinaryOutcomes(marketData, marketID) {
		if (marketData.description.split(CATEGORICAL_OUTCOMES_SEPARATOR).length === 2) {
			return parseCategoricalOutcomes(marketData, marketID);
		}
		return marketData.outcomes.reduce((p, outcome) => {
			if (outcome.id !== BINARY_YES_ID) return p;
			p[outcome.id] = { ...outcome };
			p[outcome.id].name = 'Yes';
			return p;
		}, {});
	}

	function parseCategoricalOutcomes(marketData, marketID) {
		// parse outcome names from description
		const splitDescription = marketData.description.split(CATEGORICAL_OUTCOMES_SEPARATOR);
		if (splitDescription.length < 2) {
			console.warn('Missing outcome names in description for categorical market:', marketID, marketData);
			return {};
		}

		// parse individual outcomes from outcomes string
		const categoricalOutcomeNames = splitDescription.pop().split(CATEGORICAL_OUTCOME_SEPARATOR);
		if (categoricalOutcomeNames.length !== marketData.outcomes.length) {
			console.warn('Number of outcomes parsed from description do not match number of outcomes in market for for categorical market:', marketID, marketData);
			return {};
		}

		return marketData.outcomes.reduce((p, outcome, i) => {
			p[outcome.id] = { ...outcome };
			p[outcome.id].name = categoricalOutcomeNames[i].toString().trim();
			delete p[outcome.id].id;
			return p;
		}, {});
	}

	function parseScalarOutcomes(marketData, marketID) {
		return marketData.outcomes.reduce((p, outcome) => {
			if (outcome.id !== SCALAR_UP_ID) return p;
			p[outcome.id] = { ...outcome };
			p[outcome.id].name = '';
			return p;
		}, {});
	}
}
