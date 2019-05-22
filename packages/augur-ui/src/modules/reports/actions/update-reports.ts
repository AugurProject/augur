export const MARKETS_REPORT = "MARKETS_REPORT";

export const addMarketsReport = (
  universeId: string,
  marketIds: Array<string>,
) => ({
  type: MARKETS_REPORT,
  data: {
    universeId,
    marketIds,
  },
});
