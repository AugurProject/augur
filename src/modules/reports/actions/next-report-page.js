import { selectMarket } from 'modules/market/selectors/market';

import makePath from 'modules/app/helpers/make-path';
import makeQuery from 'modules/app/helpers/make-query';

import { MARKETS, MARKET } from 'modules/app/constants/views';
import { MARKET_DESCRIPTION_PARAM_NAME, MARKET_ID_PARAM_NAME } from 'modules/app/constants/param-names';

export function nextReportPage(history) {
  return (dispatch, getState) => {
    const { branch, reports } = getState();
    const branchReports = reports[branch.id];
    if (!branchReports) return history.push(makePath(MARKETS));
    const nextPendingReportMarket = selectMarket(Reflect.ownKeys(branchReports).find(
      marketID => !branchReports[marketID].isSubmitted
    ));
    if (!nextPendingReportMarket || !nextPendingReportMarket.id) return history.push(makePath(MARKETS));

    // Go To Next Report
    history.push({
      pathname: makePath(MARKET),
      search: makeQuery({
        [MARKET_DESCRIPTION_PARAM_NAME]: nextPendingReportMarket.formattedDescription,
        [MARKET_ID_PARAM_NAME]: nextPendingReportMarket.id
      })
    });
  };
}
