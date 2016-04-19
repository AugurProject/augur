import memoizerific from 'memoizerific';
import { formatNumber, formatEther, formatPercent, formatBlockToDate } from '../../../utils/format-number';
import { isMarketDataOpen } from '../../../utils/is-market-data-open';

import { BINARY, CATEGORICAL, SCALAR, COMBINATORIAL } from '../../markets/constants/market-types';
import { INDETERMINATE_OUTCOME_ID, INDETERMINATE_OUTCOME_NAME } from '../../markets/constants/market-outcomes';

import * as MarketsActions from '../../markets/actions/markets-actions';
import * as TradeActions from '../../trade/actions/trade-actions';
import { submitReport } from '../../reports/actions/submit-report';

import store from '../../../store';

import { selectMarketLink } from '../../link/selectors/links';
import { selectOutcomeTradeOrders } from '../../trade/selectors/trade-orders';
import { selectTradeSummary } from '../../trade/selectors/trade-summary';
import { selectPositionsSummary } from '../../positions/selectors/positions-summary';

import { selectPositionFromOutcomeAccountTrades } from '../../positions/selectors/position';

export default function() {
	var { selectedMarketID } = store.getState();
	return selectMarket(selectedMarketID);
}

export const selectMarket = (marketID) => {
	var { marketsData, favorites, pendingReports, outcomes, accountTrades, tradesInProgress, blockchain } = store.getState();
	return assembleMarket(marketID, marketsData, favorites, pendingReports, outcomes, accountTrades, tradesInProgress, blockchain, store.dispatch);
};

export const selectMarketFromEventID = (eventID) => {
	var { marketsData } = store.getState();
	return selectMarket(Object.keys(marketsData).find(marketID => marketsData[marketID].eventID === eventID));
};

export const assembleMarket = memoizerific(1)((marketID, marketsData, favorites, pendingReports, outcomes, accountTrades, tradesInProgress, blockchain, dispatch) => {
	var market;

	if (!marketID || !marketsData[marketID]|| !marketsData[marketID].description) {
		return {};
	}

	market = assembleBaseMarket(
		marketID,
		marketsData[marketID],

		isMarketDataOpen(marketsData[marketID], blockchain.currentBlockNumber),
		!!favorites[marketID],

		outcomes[marketID],
		pendingReports[marketsData[marketID].eventID],
		accountTrades[marketID],
		tradesInProgress[marketID],

		blockchain.isReportConfirmationPhase,
		dispatch
	);

	// this changes too often causing too many memoization cache misses, so externalized here (we dont care if ui doesnt immediately show small changes (if any) in end date)
	market.endDate = formatBlockToDate(market.endBlock, blockchain.currentBlockNumber, blockchain.currentBlockMillisSinceEpoch);

	return market;
});

export const assembleBaseMarket = memoizerific(1000)((marketID, marketData, isOpen, isFavorite, marketOutcomes, pendingReport, marketAccountTrades, marketTradeInProgress, isReportConfirmationPhase, dispatch) => {//console.log('>>|<< assembleBaseMarket >>|<<');
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
	o.isOpen = isOpen;
	o.isExpired = !isOpen;

	o.isFavorite = isFavorite;

	o.tradingFeePercent = formatPercent(marketData.tradingFee * 100, { positiveSign: false });
	o.volume = formatNumber(marketData.volume, { positiveSign: false });

	o.isRequiredToReportByAccount = !!pendingReport; // was the user chosen to report on this market
	o.isPendingReport = o.isRequiredToReportByAccount && !pendingReport.reportHash && !isReportConfirmationPhase; // account is required to report on this unreported market during reporting phase
	o.isReportSubmitted = !!pendingReport && !!pendingReport.reportHash; // the user submitted a report that is not yet confirmed (reportHash === true)
	o.isReported = !!pendingReport && !!pendingReport.reportHash && !!pendingReport.reportHash.length; // the user fully reported on this market (reportHash === [string])
	o.isMissedReport = o.isRequiredToReportByAccount && !o.isReported && !o.isReportSubmitted && isReportConfirmationPhase; // the user submitted a report that is not yet confirmed
	o.isMissedOrReported = o.isMissedReport || o.isReported;

	o.marketLink = selectMarketLink(o, dispatch);
	o.onClickToggleFavorite = () => dispatch(MarketsActions.toggleFavorite(marketID));
	o.onSubmitPlaceTrade = () => dispatch(TradeActions.placeTrade(marketID));

	o.report = {
		...pendingReport,
		onSubmitReport: (reportedOutcomeID, isUnethical) => dispatch(submitReport(o, reportedOutcomeID, isUnethical))
	};

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
			onChangeTrade: (numShares, limitPrice) => dispatch(TradeActions.updateTradesInProgress(marketID, outcome.id, numShares, limitPrice))
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

	o.reportableOutcomes = o.outcomes.slice();
	o.reportableOutcomes.push({ id: INDETERMINATE_OUTCOME_ID, name: INDETERMINATE_OUTCOME_NAME });

	o.tradeSummary = selectTradeSummary(tradeOrders);
	o.positionsSummary = selectPositionsSummary(positions.list.length, positions.qtyShares, positions.totalValue, positions.totalCost);
	o.positionOutcomes = positions.list;

	return o;
});
