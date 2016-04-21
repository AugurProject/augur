import * as AugurJS from '../../../services/augurjs';

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