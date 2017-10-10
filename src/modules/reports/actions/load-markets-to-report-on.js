import { parallel } from 'async';
import { augur } from 'services/augurjs';
import { updateHasLoadedMarketsToReportOn } from 'modules/reports/actions/update-has-loaded-reports';
import { updateMarketsData } from 'modules/markets/actions/update-markets-data';
import { updateMarketsWithAccountReportData } from 'modules/my-reports/actions/update-markets-with-account-report-data';
import logError from 'utils/log-error';

export const loadMarketsToReportOn = (options, callback = logError) => (dispatch, getState) => {
  const { branch, loginAccount } = getState();
  if (!loginAccount.address) return callback(null);
  if (!loginAccount.rep || loginAccount.rep === '0') return callback(null);
  if (!branch.id) return callback(null);
  const query = { ...options, universe: branch.id, reporter: loginAccount.address };
  parallel({
    designatedReporting: next => augur.markets.getMarketsAwaitingDesignatedReporting(query, next),
    limitedReporting: next => augur.markets.getMarketsAwaitingLimitedReporting(query, next),
    allReporting: next => augur.markets.getMarketsAwaitingAllReporting(query, next),
  }, (err, marketsToReportOn) => { // marketsToReportOn: {designatedReporting: [marketIDs], allReporting: [marketIDs], limitedReporting: [marketIDs]}
    if (err) return callback(err);
    // TODO we have market IDs *only*, so we need to check if the market's data is already loaded (and call loadMarketsData if not)
    dispatch(updateMarketsData(marketsToReportOn));
    dispatch(updateMarketsWithAccountReportData(marketsToReportOn));
    dispatch(updateHasLoadedMarketsToReportOn(true));
    callback(null, marketsToReportOn);
  });
};
