import { UPDATE_MARKETS_WITH_ACCOUNT_REPORT_DATA } from "modules/reports/actions/update-markets-with-account-report-data";
import { CLEAR_LOGIN_ACCOUNT } from "modules/auth/actions/update-login-account";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(
  marketsWithAccountReport = DEFAULT_STATE,
  { type, data }
) {
  switch (type) {
    case UPDATE_MARKETS_WITH_ACCOUNT_REPORT_DATA: {
      const { accountReportData } = data;
      const updatedMarkets = Object.keys(accountReportData).reduce(
        (p, marketId) => {
          p[marketId] = {
            ...marketsWithAccountReport[marketId],
            ...accountReportData[marketId]
          };
          return p;
        },
        {}
      );

      return {
        ...marketsWithAccountReport,
        ...updatedMarkets
      };
    }
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return marketsWithAccountReport;
  }
}
