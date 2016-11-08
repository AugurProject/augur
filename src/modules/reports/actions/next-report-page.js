import { updateURL } from '../../link/actions/update-url';
import { selectMarketFromEventID } from '../../market/selectors/market';
import { selectMarketLink } from '../../link/selectors/links';

export function nextReportPage() {
	return (dispatch, getState) => {
		const { links } = require('../../../selectors');
		const { branch, reports } = getState();
		const branchReports = reports[branch.id];
		if (branchReports) {
			const nextPendingReportEventID = Reflect.ownKeys(branchReports).find(
				(eventID) => !branchReports[eventID].reportHash
			);
			const nextPendingReportMarket = selectMarketFromEventID(nextPendingReportEventID);
			if (nextPendingReportMarket && nextPendingReportMarket.id) {
				selectMarketLink(nextPendingReportMarket, dispatch).onClick();
			} else {
				dispatch(updateURL(links.marketsLink.href));
			}
		} else {
			dispatch(updateURL(links.marketsLink.href));
		}
	};
}
