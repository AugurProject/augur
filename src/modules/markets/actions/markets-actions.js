import * as AugurJS from '../../../services/augurjs';

import { ParseMarketsData } from '../../../utils/parse-market-data';


import { BRANCH_ID } from '../../app/constants/network';

import { loadReports } from '../../reports/actions/update-reports';

export const UPDATE_MARKETS_DATA = 'UPDATE_MARKETS_DATA';
export const UPDATE_MARKET_DATA = 'UPDATE_MARKET_DATA';

export const UPDATE_OUTCOMES_DATA = 'UPDATE_OUTCOMES_DATA';
export const UPDATE_OUTCOME_PRICE = 'UPDATE_OUTCOME_PRICE';

export const UPDATE_KEYWORDS = 'UPDATE_KEYWORDS';
export const TOGGLE_FILTER = 'TOGGLE_FILTER';
export const UPDATE_SELECTED_SORT = 'UPDATE_SELECTED_SORT';

export const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';
export const UPDATED_SELECTED_MARKETS_HEADER = 'UPDATED_SELECTED_MARKETS_HEADER';

export const UPDATE_SELECTED_PAGE_NUM = 'UPDATE_SELECTED_PAGE_NUM';

export function loadMarkets() {
	var chunkSize = 25;

	return (dispatch, getState) => {
		AugurJS.loadNumMarkets(BRANCH_ID, (err, numMarkets) => {
			if (err) {
				return console.log('ERR loadNumMarkets()', err);
			}
//numMarkets = 70; //TEMPORARY OVERRIDE
			AugurJS.loadMarkets(BRANCH_ID, chunkSize, numMarkets, true, (err, marketsData) => {
				var { blockchain } = getState(),
					marketsDataOutcomesData;

				if (err) {
					console.log('ERROR loadMarkets()', err);
					return;
				}
				if (!marketsData) {
					console.log('WARN loadMarkets()', 'no markets data returned');
					return;
				}

				marketsDataOutcomesData = ParseMarketsData(marketsData);
				dispatch(updateMarketsData(marketsDataOutcomesData));
				dispatch(loadReports(marketsDataOutcomesData.marketsData));


/*
				AugurJS.loadMarketMetadata(Object.keys(marketsData)[0], (err, metadata) => {
					if (err) {
						console.log('ERROR: loadMarketMetadata', err);
						return;
					}
					if (!metadata) {
						console.log('WARN: loadMarketMetadata', 'no metadata');
						return;
					}
					dispatch({ type: UPDATE_MARKET_DATA, marketData: { ...metadata, id: metadata.marketId }});
				});
*/
			});
		});
	};
}

export function loadMarket(marketID) {
	return function(dispatch, getState) {
		AugurJS.loadMarket(marketID, (err, marketData) => {
			var marketDataOutcomesData;
			if (err) {
				return console.info("ERROR: loadMarket()", err);
			}
			marketDataOutcomesData = ParseMarketsData({ [marketData['_id']]: marketData });
			dispatch(updateMarketsData(marketDataOutcomesData));
		});
	};
}

export function loadPriceHistory(marketID) {
	return function(dispatch, getState) {
console.log('******priceHistory', marketID);
		AugurJS.loadPriceHistory(marketID, (err, priceHistory) => {
			if (err) {
				return console.info("ERROR: loadPriceHistory()", err);
			}
console.log('!!!!!!priceHistory', priceHistory);
/*
			var priceTimeSeries = [];
			var numPoints = {};
			var data = {};
			var colors = randomColor({
				count: market.numOutcomes,
				luminosity: "bright",
				seed: 123457,
				hue: "random"
			});
			var block = self.flux.store("network").getState().blockNumber;
			for (var i = 0; i < market.numOutcomes; ++i) {
				var outcomeId = market.outcomes[i].id;
				if (priceHistory[outcomeId] && priceHistory[outcomeId].length) {
					numPoints[outcomeId] = priceHistory[outcomeId].length;
				}
				else {
					numPoints[outcomeId] = 0;
				}
				var numPts = numPoints[outcomeId];
				data[outcomeId] = new Array(numPts);
				for (var j = 0; j < numPts; ++j) {
					data[outcomeId][j] = [
						utils.blockToDate(priceHistory[outcomeId][j].blockNumber, block).unix() * 1000,
						Number(priceHistory[outcomeId][j].price)
					];
				}
				priceTimeSeries.push({
					name: market.outcomes[i].label,
					data: data[outcomeId],
					color: colors[i]
				});
			}
			self.dispatch(constants.market.LOAD_PRICE_HISTORY_SUCCESS, {
				market,
				priceHistory,
				priceTimeSeries
			});
*/
		});
	};
}

export function updateMarketsData(marketsOutcomesData) {
	return { type: UPDATE_MARKETS_DATA, ...marketsOutcomesData };
}

export function updateOutcomePrice(marketID, outcomeID, price) {
	return { type: UPDATE_OUTCOME_PRICE, marketID, outcomeID, price };
}

export function updateKeywords(keywords) {
	return { type: UPDATE_KEYWORDS, keywords};
}

export function updateSelectedSort(selectedSort) {
	return { type: UPDATE_SELECTED_SORT, selectedSort};
}

export function toggleFilter(filterID) {
	return { type: TOGGLE_FILTER, filterID };
}

export function toggleFavorite(marketID) {
	return { type: TOGGLE_FAVORITE, marketID };
}

export function updateSelectedMarketsHeader(selectedMarketsHeader) {
	return { type: UPDATED_SELECTED_MARKETS_HEADER, selectedMarketsHeader };
}

export function updateSelectedPageNum(selectedPageNum) {
	return (dispatch, getState) => {
		dispatch({ type: UPDATE_SELECTED_PAGE_NUM, selectedPageNum });
		window && window.scrollTo(0, 0);
	};
}

