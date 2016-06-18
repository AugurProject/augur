import * as AugurJS from '../../../services/augurjs';

// import { BRANCH_ID } from '../../app/constants/network';
import { BINARY, CATEGORICAL, SCALAR } from '../../markets/constants/market-types';
import { CATEGORICAL_OUTCOMES_SEPARATOR, CATEGORICAL_OUTCOME_SEPARATOR, BINARY_NO_ID, BINARY_YES_ID, SCALAR_DOWN_ID, SCALAR_UP_ID } from '../../markets/constants/market-outcomes';

import { updateMarketsData } from '../../markets/actions/update-markets-data';
import { updateOutcomesData } from '../../markets/actions/update-outcomes-data';

export function loadMarketsInfo(marketIDs) {
	return (dispatch, getState) => {
		AugurJS.batchGetMarketInfo(marketIDs, (err, marketsData) => {
			if (err) {
				console.error('ERROR loadMarketsInfo()', err);
				return;
			}
			if (!marketsData) {
				return;
			}

			const finalMarketsData = {};
			const finalOutcomesData = {};
			let marketData;

			Object.keys(marketsData).forEach(marketID => {
				marketData = marketsData[marketID];

				// parse out event, currently we only support single event markets, no combinatorial
				parseEvent(marketData);

				// transform array of outcomes into an object and add their names
				finalOutcomesData[marketID] = parseOutcomes(marketData);

				// mark that details have been loaded
				marketData.isLoadedMarketInfo = true;

				// save market (without outcomes)
				finalMarketsData[marketID] = marketData;
			});

			dispatch(updateMarketsData(finalMarketsData));
			dispatch(updateOutcomesData(finalOutcomesData));
		});
	};

	function parseEvent(marketData) {
		if (!marketData.events || marketData.events.length !== 1) {
			console.warn('Market does not have correct number of events:', marketData);
			delete marketData.events;
			return;
		}

		const event = marketData.events[0];
		marketData.eventID = event.id;
		marketData.minValue = event.minValue;
		marketData.maxValue = event.maxValue;
		marketData.numOutcomes = event.numOutcomes;
		marketData.reportedOutcome = event.outcome;
		delete marketData.events;
	}

	function parseOutcomes(marketData) {
		if (!marketData.outcomes || !marketData.outcomes.length) {
			console.warn('Market does not have outcomes: ', marketData);
			return undefined;
		}

		let outcomes;
		let splitDescription;
		let categoricalOutcomeNames;

		switch (marketData.type) {
		case BINARY:
			outcomes = marketData.outcomes.map(outcome => {
				if (outcome.id === BINARY_NO_ID) {
					outcome.name = 'No';
				} else if (outcome.id === BINARY_YES_ID) {
					outcome.name = 'Yes';
				} else {
					console.warn('Invalid outcome ID for binary market: ', outcome, marketData);
				}
				return outcome;
			});
			break;

		case CATEGORICAL:
			// parse outcome names from description
			splitDescription = marketData.description.split(CATEGORICAL_OUTCOMES_SEPARATOR);
			if (splitDescription.length < 2) {
				console.warn('Missing outcome names in description for categorical market: ', marketData);
				break;
			}

			// parse individual outcomes from outcomes string
			categoricalOutcomeNames = splitDescription.pop().split(CATEGORICAL_OUTCOME_SEPARATOR);
			if (categoricalOutcomeNames.length !== marketData.outcomes.length) {
				console.warn('Number of outcomes parsed from description do not match number of outcomes in market for for categorical market: ', marketData);
				break;
			}

			// add names to outcomes
			outcomes = marketData.outcomes.map((outcome, i) => {
				outcome.name = categoricalOutcomeNames[i].toString().trim();
				return outcome;
			});

			// update market description to exclude outcome names
			marketData.description = splitDescription.join();
			break;

		case SCALAR:
			outcomes = marketData.outcomes.map(outcome => {
				if (outcome.id === SCALAR_DOWN_ID) {
					outcome.name = '⇩';
				} else if (outcome.id === SCALAR_UP_ID) {
					outcome.name = '⇧';
				} else {
					console.warn('Invalid outcome ID for scalar market: ', outcome, marketData);
				}
				return outcome;
			});
			break;

		default:
			console.warn('Unknown market type:', marketData.type, marketData);
			outcomes = undefined;
			break;
		}

		delete marketData.outcomes;

		return outcomes.reduce((p, outcome) => {
			p[outcome.id] = outcome;
			delete outcome.id;
			return p;
		}, {});
	}
}

export function loadMarketsInfoForDisplayedMarkets() {
	return (dispatch, getState) => {
		const { markets } = require('../../../selectors');
		const marketIDsMissingInfo = markets.filter(market => !market.isLoadedMarketInfo).map(market => market.id);

		if (marketIDsMissingInfo.length) {
			dispatch(loadMarketsInfo(marketIDsMissingInfo));
		}
	};
}
