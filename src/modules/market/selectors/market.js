import memoizerific from 'memoizerific';
import { formatNumber, formatBlockToDate, formatPercent } from '../../../utils/format-number';

import * as MarketsActions from '../../markets/actions/markets-actions';

import store from '../../../store';

import { selectOutcomes } from '../../market/selectors/outcomes';
import { selectMarketLink } from '../../link/selectors/links';

export default function() {
    var { selectedMarketID } = store.getState();
	return selectMarket(selectedMarketID);
}

export const selectMarket = (marketID) => {
    var { markets, recentlyExpiredMarkets, pendingReports, favorites, outcomes, blockchain } = store.getState(),
    	pendingReport;

    if (!marketID || !markets[marketID]|| !markets[marketID].description) {
    	return {};
    }

    pendingReport = pendingReports[recentlyExpiredMarkets[marketID]];

	return assembleMarket(
		marketID,
		markets[marketID],
		!!pendingReport,
		!!pendingReport && pendingReport.reportHash === true,
		!!pendingReport && !!pendingReport.reportHash && !!pendingReport.reportHash.length,
		!!favorites[marketID],
		outcomes[marketID],
		blockchain.currentBlockNumber,
		blockchain.currentBlockMillisSinceEpoch,
		blockchain.isReportConfirmationPhase,
		store.dispatch
	);
};

export const assembleMarket = memoizerific(1000)((marketID, market, isRequiredToReportByAccount, isReportSubmitted, isReported, isFavorite, marketOutcomes, currentBlockNumber, currentBlockMillisSinceEpoch, isReportConfirmationPhase, dispatch) => {//console.log('-- assembleMarket --');
    var o = {
        ...market,
        id: marketID
    };

	o.endBlock = market.endDate;
	o.endDate = formatBlockToDate(o.endBlock, currentBlockNumber, currentBlockMillisSinceEpoch);
	o.tradingFeePercent = formatPercent(market.tradingFee * 100, true);
	o.volume = formatNumber(market.volume);

    o.outcomes = selectOutcomes(marketID, marketOutcomes);

    o.isOpen = o.endBlock > currentBlockNumber;
    o.isRequiredToReportByAccount = isRequiredToReportByAccount; // was the user chosen to report on this market
    o.isPendingReport = isRequiredToReportByAccount && !isReportSubmitted && !isReported && !isReportConfirmationPhase; // the user has not yet reported on this market
    o.isReportSubmitted = isReportSubmitted; // the user submitted a report that is not yet confirmed
    o.isReported = isReported; // the user fully reported on this market
    o.isFavorite = isFavorite;

	if (isReported) {
    	o.detailsLabel = 'Reported';
    	o.detailsClassName = 'reported';
	}
	else if (isRequiredToReportByAccount) {
    	if (!isReportConfirmationPhase) {
	    	o.detailsLabel = 'Report';
	    	o.detailsClassName = 'report';
    	}
    	else {
	    	o.detailsLabel = 'Missed Report';
	    	o.detailsClassName = 'missed-report';
    	}
	}
    else if (!o.isOpen) {
    	o.detailsLabel = 'View';
    	o.detailsClassName = 'view';
    }
    else {
    	o.detailsLabel = 'Trade';
    	o.detailsClassName = 'trade';
    }

    o.marketLink = selectMarketLink(o, dispatch);

    o.onClickToggleFavorite = () => dispatch(MarketsActions.toggleFavorite(marketID));

    return o;
});