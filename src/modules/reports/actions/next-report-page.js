import { selectMarketFromEventID } from 'modules/market/selectors/market';
import { selectMarketLink } from 'modules/link/selectors/links';

export function nextReportPage() {
  return (dispatch, getState) => {
    const links = require('modules/link/selectors/links');
    const marketsLink = links.default().marketsLink;
    const { branch, reports } = getState();
    const branchReports = reports[branch.id];
    if (!branchReports) return marketsLink.onClick();
    const nextPendingReportEventID = Reflect.ownKeys(branchReports).find(
      eventID => !branchReports[eventID].reportHash
    );
    if (!nextPendingReportEventID) return marketsLink.onClick();
    const nextPendingReportMarket = selectMarketFromEventID(nextPendingReportEventID);
    if (!nextPendingReportMarket || !nextPendingReportMarket.id) {
      return marketsLink.onClick();
    }
    selectMarketLink(nextPendingReportMarket, dispatch).onClick();
  };
}
