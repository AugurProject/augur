import { selectMarketFromEventID } from '../../market/selectors/market';
import { selectMarketLink } from '../../link/selectors/links';

export function nextReportPage() {
	return (dispatch, getState) => {
		const { links } = require('../../../selectors');
		const { branch, reports } = getState();
		const branchReports = reports[branch.id];
		if (!branchReports) return links.marketsLink.onClick();
		const nextPendingReportEventID = Reflect.ownKeys(branchReports).find(
			(eventID) => !branchReports[eventID].reportHash
		);
		if (!nextPendingReportEventID) return links.marketsLink.onClick();
		const nextPendingReportMarket = selectMarketFromEventID(nextPendingReportEventID);
		if (!nextPendingReportMarket || !nextPendingReportMarket.id) {
			return links.marketsLink.onClick();
		}
		selectMarketLink(nextPendingReportMarket, dispatch).onClick();
	};
}
