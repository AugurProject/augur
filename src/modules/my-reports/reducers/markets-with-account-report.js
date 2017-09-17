import { UPDATE_MARKETS_WITH_ACCOUNT_REPORT_DATA } from 'modules/my-reports/actions/update-markets-with-account-report-data';
import { CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account';

export default function (marketsWithAccountReport = {}, action) {
  switch (action.type) {
    case UPDATE_MARKETS_WITH_ACCOUNT_REPORT_DATA: {
      const updatedMarkets = Object.keys(action.data).reduce((p, marketID) => {
        p[marketID] = { ...marketsWithAccountReport[marketID], ...action.data[marketID] };
        return p;
      }, {});

      return {
        ...marketsWithAccountReport,
        ...updatedMarkets
      };
    }
    case CLEAR_LOGIN_ACCOUNT:
      return {};
    default:
      return marketsWithAccountReport;
  }
}
