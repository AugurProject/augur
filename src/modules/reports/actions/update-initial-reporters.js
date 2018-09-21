export const UPDATE_INITIAL_REPORTERS_DATA = "UPDATE_INITIAL_REPORTERS_DATA";
export const UPDATE_INITIAL_REPORTER_REP_BALANCE =
  "UPDATE_INITIAL_REPORTER_REP_BALANCE";

export const updateInitialReportersData = initialReportersDataUpdated => ({
  type: UPDATE_INITIAL_REPORTERS_DATA,
  data: { initialReportersDataUpdated }
});
export const updateInitialReporterRepBalance = (
  initialReporterID,
  repBalance
) => ({
  type: UPDATE_INITIAL_REPORTER_REP_BALANCE,
  data: {
    initialReporterID,
    repBalance
  }
});
