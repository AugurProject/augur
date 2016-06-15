/*
This is one of the most important and sensitive selectors in the app.
It builds the fat, heavy, rigid, hierarchical market objects,
that are used to render and display many parts of the ui.
This is the point where the shallow, light, loose, flexible, independent
pieces of state come together to make each market.

IMPORTANT
The assembleMarket() function (where all the action happens) is heavily
 memoized, and performance sensitive.
Doing things sub-optimally here will cause noticeable performance degradation in the app.
The "trick" is to maximize memoization cache hits as much a spossible, and not have assembleMarket()
run any more than it has to.

To achieve that, we pass in the minimum number of the shallowest arguments possible.
For example, instead of passing in the entire `favorites` collection and letting the
function find the one it needs for the market, we instead find the specific fvorite
for that market in advance, and only pass in a boolean: `!!favorites[marketID]`
That way the market only gets re-assembled when that specific favorite changes.

This is true for all selectors, but especially important for this one.
*/


import memoizerific from 'memoizerific';
import { formatNumber, formatEther, formatPercent } from '../../../utils/format-number';
import { formatDate } from '../../../utils/format-date';
import { isMarketDataOpen } from '../../../utils/is-market-data-open';

import { BINARY, CATEGORICAL, SCALAR } from '../../markets/constants/market-types';
import { INDETERMINATE_OUTCOME_ID, INDETERMINATE_OUTCOME_NAME } from '../../markets/constants/market-outcomes';
import { BID } from '../../bids-asks/constants/bids-asks-types';

import { toggleFavorite } from '../../markets/actions/update-favorites';
import { placeTrade } from '../../trade/actions/place-trade';
import { updateTradesInProgress } from '../../trade/actions/update-trades-in-progress';
import { submitReport } from '../../reports/actions/submit-report';
import { toggleTag } from '../../markets/actions/toggle-tag';

import store from '../../../store';

import { selectMarketLink } from '../../link/selectors/links';
import { selectOutcomeTradeOrders } from '../../trade/selectors/trade-orders';
import { selectTradeSummary } from '../../trade/selectors/trade-summary';
import { selectPositionsSummary } from '../../positions/selectors/positions-summary';

import { selectPriceTimeSeries } from '../../market/selectors/price-time-series';

import { selectPositionFromOutcomeAccountTrades } from '../../positions/selectors/position';

import { selectAggregateOrderBook, selectTopBidPrice, selectTopAskPrice } from '../../bids-asks/selectors/select-order-book';

export default function () {
	const { selectedMarketID } = store.getState();
	return selectMarket(selectedMarketID);
}

export const selectMarket = (marketID) => {
	const { marketsData, favorites,
					reports, outcomes,
					accountTrades, tradesInProgress,
					blockchain, priceHistory, marketOrderBooks } = store.getState();

	if (!marketID || !marketsData || !marketsData[marketID]) {
		return {};
	}

	const endDate = new Date((marketsData[marketID].endDate * 1000) || 0);

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

		// the reason we pass in the date parts broken up like this, is because date objects are never equal, thereby always triggering re-assembly, and never hitting the memoization cache
		endDate.getFullYear(),
		endDate.getMonth(),
		endDate.getDate(),

		blockchain && blockchain.isReportConfirmationPhase,

		marketOrderBooks[marketID],
		store.dispatch);
};

export const selectMarketFromEventID = (eventID) => {
	const { marketsData } = store.getState();
	return selectMarket(Object.keys(marketsData).find(marketID =>
		marketsData[marketID].eventID === eventID)
	);
};

export const assembleMarket = memoizerific(1000)((
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
		marketOrderBooks,
		dispatch) => { // console.log('>>assembleMarket<<');

	const o = {
		...marketData,
		id: marketID
	};
	let tradeOrders = [];
	const positions = { qtyShares: 0, totalValue: 0, totalCost: 0, list: [] };

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
	default:
		break;
	}
	o.endDate = endDateYear >= 0 && endDateMonth >= 0 && endDateDay >= 0 && formatDate(new Date(endDateYear, endDateMonth, endDateDay)) || null;
	o.isOpen = isOpen;
	o.isExpired = !isOpen;

	o.isFavorite = isFavorite;

	o.tradingFeePercent = formatPercent(marketData.tradingFee * 100, { positiveSign: false });
	o.volume = formatNumber(marketData.volume, { positiveSign: false });

	o.isRequiredToReportByAccount = !!marketReport;
	// was the user chosen to report on this market
	o.isPendingReport = o.isRequiredToReportByAccount && !marketReport.reportHash && !isReportConfirmationPhase;
	// account is required to report on this unreported market during reporting phase
	o.isReportSubmitted = o.isRequiredToReportByAccount && !!marketReport.reportHash;
	// the user submitted a report that is not yet confirmed (reportHash === true)
	o.isReported = o.isReportSubmitted && !!marketReport.reportHash.length;
	// the user fully reported on this market (reportHash === [string])
	o.isMissedReport = o.isRequiredToReportByAccount && !o.isReported && !o.isReportSubmitted && isReportConfirmationPhase;
	// the user submitted a report that is not yet confirmed
	o.isMissedOrReported = o.isMissedReport || o.isReported;

	o.marketLink = selectMarketLink(o, dispatch);
	o.onClickToggleFavorite = () => dispatch(toggleFavorite(marketID));
	o.onSubmitPlaceTrade = () => dispatch(placeTrade(marketID));

	o.report = {
		...marketReport,
		onSubmitReport: (reportedOutcomeID, isUnethical) =>
			dispatch(submitReport(o, reportedOutcomeID, isUnethical))
	};

	o.outcomes = [];

	o.outcomes = Object.keys(marketOutcomes || {}).map(outcomeID => {
		const outcomeData = marketOutcomes[outcomeID];
		const	outcomeTradeInProgress = marketTradeInProgress && marketTradeInProgress[outcomeID];

		const outcome = {
			...outcomeData,
			id: outcomeID,
			marketID,
			lastPrice: formatEther(outcomeData.price || 0, { positiveSign: false }),
			lastPricePercent: formatPercent((outcomeData.price || 0) * 100, { positiveSign: false })
		};

		const outcomeTradeOrders = selectOutcomeTradeOrders(
																o,
																outcome,
																outcomeTradeInProgress,
																dispatch);

		outcome.trade = {
			side: outcomeTradeInProgress && outcomeTradeInProgress.side || BID,
			numShares: outcomeTradeInProgress && outcomeTradeInProgress.numShares || 0,
			limitPrice: outcomeTradeInProgress && outcomeTradeInProgress.limitPrice || 0,
			tradeSummary: selectTradeSummary(outcomeTradeOrders),
			updateTradeOrder: (outcomeId, shares, limitPrice, side) =>
				dispatch(updateTradesInProgress(
					marketID,
					outcome.id,
					shares,
					limitPrice,
					side))
		};

		if (marketAccountTrades && marketAccountTrades[outcomeID]) {
			outcome.position = selectPositionFromOutcomeAccountTrades(
				marketAccountTrades[outcomeID], outcome.price);
			if (outcome.position && outcome.position.qtyShares && outcome.position.qtyShares.value) {
				positions.qtyShares += outcome.position.qtyShares.value;
				positions.totalValue += outcome.position.totalValue.value || 0;
				positions.totalCost += outcome.position.totalCost.value || 0;
				positions.list.push(outcome);
			}
		}

		const orderBook = selectAggregateOrderBook(outcome.id, marketOrderBooks);
		outcome.orderBook = orderBook;
		outcome.topBid = selectTopBidPrice(orderBook);
		outcome.topAsk = selectTopAskPrice(orderBook);

		tradeOrders = tradeOrders.concat(outcomeTradeOrders);

		return outcome;
	}).sort((a, b) => (b.lastPrice.value - a.lastPrice.value) || (a.name < b.name ? -1 : 1));

	o.tags = (o.tags || []).map(tag => {
		const obj = {
			name: tag && tag.toString().toLowerCase().trim(),
			onClick: () => dispatch(toggleTag(tag))
		};
		return obj;
	}).filter(tag => !!tag.name);

	o.priceTimeSeries = selectPriceTimeSeries(o.outcomes, marketPriceHistory);

	o.reportableOutcomes = o.outcomes.slice();
	o.reportableOutcomes.push({ id: INDETERMINATE_OUTCOME_ID, name: INDETERMINATE_OUTCOME_NAME });

	o.tradeSummary = selectTradeSummary(tradeOrders);
	o.positionsSummary = selectPositionsSummary(
		positions.list.length,
		positions.qtyShares,
		positions.totalValue,
		positions.totalCost);
	o.positionOutcomes = positions.list;

	return o;
});
