export const UPDATE_REPORTS = "UPDATE_REPORTS";
export const UPDATE_REPORT = "UPDATE_REPORT";
export const MARKETS_REPORT = "MARKETS_REPORT";

export const updateReports = reportsData => ({
  type: UPDATE_REPORTS,
  data: { reportsData }
});

export const addMarketsReport = (universeId, marketIds) => ({
  type: MARKETS_REPORT,
  data: {
    universeId,
    marketIds
  }
});
