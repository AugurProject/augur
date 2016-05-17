/*
This is the most important and sensitive selector in the app.
It builds the fat, heavy, rigid, hierarchical market objects, that are used to render and display many parts of the ui.
This is the point where the shallow, light, loose, flexible, independent pieces of state come together to make each market.

IMPORTANT
The assembleMarket() function (where all the action happens) is heavily memoized, and performance sensitive.
Doing things sub-optimally here will cause noticeable performance degradation in the app.
The "trick" is to maximize memoization cache hits as much a spossible, and not have assembleMarket() run any more than it has to.

To achieve that, we pre-process the arguments passed in to it as much as possible.
For example, instead of passing in the entire "favorites" collection and letting the function find the one it needs for the market,
we instead pass in !!favorites[marketID], and the market only gets re-assembled if the specific favorite it is concerned with changes.
*/


import memoizerific from 'memoizerific';
import { formatNumber, formatEther, formatPercent, formatDate, makeDateFromBlock } from '../../../utils/format-number';
import { isMarketDataOpen } from '../../../utils/is-market-data-open';

import { BINARY, CATEGORICAL, SCALAR, COMBINATORIAL } from '../../markets/constants/market-types';
import { INDETERMINATE_OUTCOME_ID, INDETERMINATE_OUTCOME_NAME } from '../../markets/constants/market-outcomes';

import { toggleFavorite } from '../../markets/actions/update-favorites';
import { placeTrade } from '../../trade/actions/place-trade';
import { updateTradesInProgress } from '../../trade/actions/update-trades-in-progress';
import { submitReport } from '../../reports/actions/submit-report';

import store from '../../../store';

import { selectMarketLink } from '../../link/selectors/links';
import { selectOutcomeTradeOrders } from '../../trade/selectors/trade-orders';
import { selectTradeSummary } from '../../trade/selectors/trade-summary';
import { selectPositionsSummary } from '../../positions/selectors/positions-summary';

import { selectPriceTimeSeries } from '../../market/selectors/price-time-series';

import { selectPositionFromOutcomeAccountTrades } from '../../positions/selectors/position';

export default function() {
	var { selectedMarketID } = store.getState();
	return selectMarket(selectedMarketID);
}

export const selectMarket = (marketID) => {
	var { marketsData, favorites, reports, outcomes, accountTrades, tradesInProgress,
		blockchain, priceHistory } = store.getState(),
		endDate;

	if (!marketID || !marketsData || !marketsData[marketID] || !marketsData[marketID].description || !marketsData[marketID].eventID) {
		return {};
	}

	endDate = new Date(marketsData[marketID].endDate);

	return assembleMarket(
		marketID,
		marketsData[marketID],
		priceHistory[marketID],
		isMarketDataOpen(marketsData[marketID], blockchain && blockchain.currentBlockNumber),

		!!favorites[marketID],
		outcomes[marketID],

		reports[marketsData[marketID].eventID],
		accountTrades[marketID],
		tradesInProgress[marketID],
		endDate.getFullYear(),
		endDate.getMonth(),
		endDate.getDate(),
		blockchain && blockchain.isReportConfirmationPhase,
		store.dispatch);
};

export const selectMarketFromEventID = (eventID) => {
	var { marketsData } = store.getState();
	return selectMarket(Object.keys(marketsData).find(marketID => marketsData[marketID].eventID === eventID));
};

export const assembleMarket = memoizerific(1000)(function(
		marketID,
		marketData,
		marketPriceHistory,
		isOpen,
		isFavorite,
		marketOutcomes,
		marketReport,
		marketAccountTrades,
		marketTradeInProgress,
		endDateYear,
		endDateMonth,
		endDateDay,
		isReportConfirmationPhase,
		dispatch) { //console.log('>>assembleMarket<<');

	var o = {
			...marketData,
			id: marketID
		},
		tradeOrders = [],
		positions = { qtyShares: 0, totalValue: 0, totalCost: 0, list: [] };

	o.type = marketData.type;
	switch (o.type) {
		case BINARY:
			o.isBinary = true;
			o.isCategorical = false;
			o.isScalar = false;
			break;
		case CATEGORICAL:
			o.isBinary = false;
			o.isCategorical = true;
			o.isScalar = false;
			break;
		case SCALAR:
			o.isBinary = false;
			o.isCategorical = false;
			o.isScalar = true;
			break;
	}

	o.endBlock = parseInt(marketData.endDate, 10);
	o.endDate = endDateYear && endDateMonth && endDateDay && formatDate(new Date(endDateYear, endDateMonth, endDateDay));
	o.isOpen = isOpen;
	o.isExpired = !isOpen;

	o.isFavorite = isFavorite;

	o.tradingFeePercent = formatPercent(marketData.tradingFee * 100, { positiveSign: false });
	o.volume = formatNumber(marketData.volume, { positiveSign: false });

	o.isRequiredToReportByAccount = !!marketReport; // was the user chosen to report on this market
	o.isPendingReport = o.isRequiredToReportByAccount && !marketReport.reportHash && !isReportConfirmationPhase; // account is required to report on this unreported market during reporting phase
	o.isReportSubmitted = o.isRequiredToReportByAccount && !!marketReport.reportHash; // the user submitted a report that is not yet confirmed (reportHash === true)
	o.isReported = o.isReportSubmitted && !!marketReport.reportHash.length; // the user fully reported on this market (reportHash === [string])
	o.isMissedReport = o.isRequiredToReportByAccount && !o.isReported && !o.isReportSubmitted && isReportConfirmationPhase; // the user submitted a report that is not yet confirmed
	o.isMissedOrReported = o.isMissedReport || o.isReported;

	o.marketLink = selectMarketLink(o, dispatch);
	o.onClickToggleFavorite = () => dispatch(toggleFavorite(marketID));
	o.onSubmitPlaceTrade = () => dispatch(placeTrade(marketID));

	o.report = {
		...marketReport,
		onSubmitReport: (reportedOutcomeID, isUnethical) => dispatch(submitReport(o, reportedOutcomeID, isUnethical))
	};

	o.outcomes = [];

	o.outcomes = Object.keys(marketOutcomes || {}).map(outcomeID => {
		var outcomeData = marketOutcomes[outcomeID],
			outcomeTradeInProgress = marketTradeInProgress && marketTradeInProgress[outcomeID],
			outcomeTradeOrders,
			outcome;

		outcome = {
	        ...outcomeData,
	        id: outcomeID,
	        marketID,
	        lastPrice: formatEther(outcomeData.price, { positiveSign: false }),
	        lastPricePercent: formatPercent(outcomeData.price * 100, { positiveSign: false })
		};

		outcomeTradeOrders = selectOutcomeTradeOrders(o, outcome, outcomeTradeInProgress, dispatch);

		outcome.trade = {
			numShares: outcomeTradeInProgress && outcomeTradeInProgress.numShares || 0,
			limitPrice: outcomeTradeInProgress && outcomeTradeInProgress.limitPrice || 0,
			tradeSummary: selectTradeSummary(outcomeTradeOrders),
			onChangeTrade: (numShares, limitPrice) => dispatch(updateTradesInProgress(marketID, outcome.id, numShares, limitPrice))
		};

		if (marketAccountTrades && marketAccountTrades[outcomeID]) {
			outcome.position = selectPositionFromOutcomeAccountTrades(marketAccountTrades[outcomeID], outcome.price);
			if (outcome.position && outcome.position.qtyShares && outcome.position.qtyShares.value) {
				positions.qtyShares += outcome.position.qtyShares.value;
				positions.totalValue += outcome.position.totalValue.value || 0;
				positions.totalCost += outcome.position.totalCost.value || 0;
				positions.list.push(outcome);
			}
		}

		tradeOrders = tradeOrders.concat(outcomeTradeOrders);

		return outcome;
	}).sort((a, b) => (b.lastPrice.value - a.lastPrice.value) || (a.name < b.name ? -1 : 1));

	o.priceTimeSeries = selectPriceTimeSeries(o.outcomes, marketPriceHistory);

	o.reportableOutcomes = o.outcomes.slice();
	o.reportableOutcomes.push({ id: INDETERMINATE_OUTCOME_ID, name: INDETERMINATE_OUTCOME_NAME });

	o.tags = marketData.tags.filter((tag) => tag != null);
	o.tradeSummary = selectTradeSummary(tradeOrders);
	o.positionsSummary = selectPositionsSummary(positions.list.length, positions.qtyShares, positions.totalValue, positions.totalCost);
	o.positionOutcomes = positions.list;

	return o;
});
