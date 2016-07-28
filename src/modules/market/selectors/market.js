/*
This is one of the most important and sensitive selectors in the app.
It builds the fat, heavy, rigid, hierarchical market objects,
that are used to render and display many parts of the ui.
This is the point where the shallow, light, loose, flexible, independent
pieces of state come together to make each market.

IMPORTANT
The assembleMarket() function (where all the action happens) is heavily memoized, and performance sensitive.
Doing things sub-optimally here will cause noticeable performance degradation in the app.
The "trick" is to maximize memoization cache hits as much as possible, and not have assembleMarket()
run any more than it has to.

To achieve that, we pass in the minimum number of the shallowest arguments possible.
For example, instead of passing in the entire `favorites` collection and letting the
function find the one it needs for the market, we instead find the specific fvorite
for that market in advance, and only pass in a boolean: `!!favorites[marketID]`
That way the market only gets re-assembled when that specific favorite changes.

This is true for all selectors, but especially important for this one.
*/


import memoizerific from 'memoizerific';
import { formatShares, formatEther, formatPercent, formatNumber } from '../../../utils/format-number';
import { formatDate } from '../../../utils/format-date';
import { isMarketDataOpen } from '../../../utils/is-market-data-open';

import { BINARY, CATEGORICAL, SCALAR } from '../../markets/constants/market-types';
import { INDETERMINATE_OUTCOME_ID, INDETERMINATE_OUTCOME_NAME } from '../../markets/constants/market-outcomes';

import { toggleFavorite } from '../../markets/actions/update-favorites';
import { placeTrade } from '../../trade/actions/place-trade';
import { submitReport } from '../../reports/actions/submit-report';
import { toggleTag } from '../../markets/actions/toggle-tag';

import store from '../../../store';

import { selectMarketLink } from '../../link/selectors/links';
import { selectPositionsSummary } from '../../positions/selectors/positions-summary';
import selectUserOpenOrders from '../../user-open-orders/selectors/user-open-orders';

import { selectPriceTimeSeries } from '../../market/selectors/price-time-series';

import { selectPositionFromOutcomeAccountTrades } from '../../positions/selectors/position';

import { selectAggregateOrderBook, selectTopBid, selectTopAsk } from '../../bids-asks/selectors/select-order-book';

import { generateTrade, generateTradeSummary } from '../../market/selectors/helpers/generate-trade';

export default function () {
	const { selectedMarketID } = store.getState();
	return selectMarket(selectedMarketID);
}

export const selectMarket = (marketID) => {
	const { marketsData, favorites, reports, outcomes, accountTrades, tradesInProgress, blockchain, priceHistory, marketOrderBooks } = store.getState();

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

	const market = {
		...marketData,
		description: marketData.description || '',
		id: marketID
	};

	market.type = marketData.type;
	switch (market.type) {
	case BINARY:
		market.isBinary = true;
		market.isCategorical = false;
		market.isScalar = false;
		break;
	case CATEGORICAL:
		market.isBinary = false;
		market.isCategorical = true;
		market.isScalar = false;
		break;
	case SCALAR:
		market.isBinary = false;
		market.isCategorical = false;
		market.isScalar = true;
		break;
	default:
		break;
	}

	market.endDate = endDateYear >= 0 && endDateMonth >= 0 && endDateDay >= 0 && formatDate(new Date(endDateYear, endDateMonth, endDateDay)) || null;
	market.endDateLabel = (market.endDate < new Date()) ? 'ended' : 'ends';

	market.isOpen = isOpen;
	market.isExpired = !isOpen;
	market.isFavorite = isFavorite;

	market.takerFeePercent = formatPercent(marketData.takerFee * 100, { positiveSign: false });
	market.makerFeePercent = formatPercent(marketData.makerFee * 100, { positiveSign: false });
	market.volume = formatShares(marketData.volume, { positiveSign: false });

	market.isRequiredToReportByAccount = !!marketReport; // was the user chosen to report on this market
	market.isPendingReport = market.isRequiredToReportByAccount && !marketReport.reportHash && !isReportConfirmationPhase; // account is required to report on this unreported market during reporting phase
	market.isReportSubmitted = market.isRequiredToReportByAccount && !!marketReport.reportHash; // the user submitted a report that is not yet confirmed (reportHash === true)
	market.isReported = market.isReportSubmitted && !!marketReport.reportHash.length; // the user fully reported on this market (reportHash === [string])
	market.isMissedReport = market.isRequiredToReportByAccount && !market.isReported && !market.isReportSubmitted && isReportConfirmationPhase; // the user submitted a report that is not yet confirmed
	market.isMissedOrReported = market.isMissedReport || market.isReported;

	market.marketLink = selectMarketLink(market, dispatch);
	market.onClickToggleFavorite = () => dispatch(toggleFavorite(marketID));
	market.onSubmitPlaceTrade = () => dispatch(placeTrade(marketID));

	market.report = {
		...marketReport,
		onSubmitReport: (reportedOutcomeID, isUnethical) => dispatch(submitReport(market, reportedOutcomeID, isUnethical))
	};

	market.outcomes = [];

	let marketTradeOrders = [];
	const positions = { qtyShares: 0, totalValue: 0, totalCost: 0, list: [] };

	market.outcomes = Object.keys(marketOutcomes || {}).map(outcomeID => {
		const outcomeData = marketOutcomes[outcomeID];
		const outcomeTradeInProgress = marketTradeInProgress && marketTradeInProgress[outcomeID];

		const outcome = {
			...outcomeData,
			id: outcomeID,
			marketID,
			lastPrice: formatEther(outcomeData.price || 0, { positiveSign: false }),
			lastPricePercent: formatPercent((outcomeData.price || 0) * 100, { positiveSign: false })
		};

		outcome.trade = generateTrade(market, outcome, outcomeTradeInProgress);

		if (marketAccountTrades && marketAccountTrades[outcomeID]) {
			outcome.position = selectPositionFromOutcomeAccountTrades(marketAccountTrades[outcomeID], outcome.price);
			if (outcome.position && outcome.position.qtyShares && outcome.position.qtyShares.value) {
				positions.qtyShares += outcome.position.qtyShares.value;
				positions.totalValue += outcome.position.totalValue.value || 0;
				positions.totalCost += outcome.position.totalCost.value || 0;
				positions.list.push(outcome);
			}
		}

		const orderBook = selectAggregateOrderBook(outcome.id, marketOrderBooks);
		outcome.orderBook = orderBook;
		outcome.topBid = selectTopBid(orderBook);
		outcome.topAsk = selectTopAsk(orderBook);

		marketTradeOrders = marketTradeOrders.concat(outcome.trade.tradeSummary.tradeOrders);

		outcome.userOpenOrders = selectUserOpenOrders(outcomeID, marketOrderBooks);

		return outcome;
	}).sort((a, b) => (b.lastPrice.value - a.lastPrice.value) || (a.name < b.name ? -1 : 1));

	market.tags = (market.tags || []).map(tag => {
		const obj = {
			name: tag && tag.toString().toLowerCase().trim(),
			onClick: () => dispatch(toggleTag(tag))
		};
		return obj;
	}).filter(tag => !!tag.name);

	market.priceTimeSeries = selectPriceTimeSeries(market.outcomes, marketPriceHistory);

	market.reportableOutcomes = market.outcomes.slice();
	market.reportableOutcomes.push({ id: INDETERMINATE_OUTCOME_ID, name: INDETERMINATE_OUTCOME_NAME });

	market.tradeSummary = generateTradeSummary(marketTradeOrders);

	market.positionsSummary = selectPositionsSummary(
		positions.list.length,
		positions.qtyShares,
		positions.totalValue,
		positions.totalCost);

	market.positionOutcomes = positions.list;

	market.userOpenOrdersSummary = {
		openOrdersCount: formatNumber(0)
	};

	return market;
});
