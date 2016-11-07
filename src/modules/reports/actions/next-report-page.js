import { selectMarketFromEventID } from '../../market/selectors/market';
import { selectMarketLink, selectMarketsLink } from '../../link/selectors/links';

export function nextReportPage() {
	return (dispatch, getState) => {
		const { branch, reports } = getState();
		const branchReports = reports[branch.id];
		if (!branchReports) return selectMarketsLink(dispatch).onClick();
		const nextPendingReportEventID = Reflect.ownKeys(branchReports).find(
			eventID => !branchReports[eventID].reportHash
		);
		const nextPendingReportMarket = selectMarketFromEventID(nextPendingReportEventID);
		if (nextPendingReportMarket && nextPendingReportMarket.id) {
			selectMarketLink(nextPendingReportMarket, dispatch).onClick();
		} else {
			selectMarketsLink(dispatch).onClick();
		}
	};
}
