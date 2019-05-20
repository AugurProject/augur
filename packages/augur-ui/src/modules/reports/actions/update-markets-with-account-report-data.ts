export const UPDATE_MARKETS_WITH_ACCOUNT_REPORT_DATA =
  "UPDATE_MARKETS_WITH_ACCOUNT_REPORT_DATA";

export function updateMarketsWithAccountReportData(accountReportData: any) {
  return {
    type: UPDATE_MARKETS_WITH_ACCOUNT_REPORT_DATA,
    data: { accountReportData }
  };
}
