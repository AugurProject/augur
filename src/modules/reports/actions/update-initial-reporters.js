export const UPDATE_INITIAL_REPORTERS_DATA = "UPDATE_INITIAL_REPORTERS_DATA";
export const UPDATE_INITIAL_REPORTER_REP_BALANCE =
  "UPDATE_INITIAL_REPORTER_REP_BALANCE";

export const updateInitialReportersData = initialReportersData => ({
  type: UPDATE_INITIAL_REPORTERS_DATA,
  initialReportersData
});
export const updateInitialReporterRepBalance = (
  initialReporterID,
  repBalance
) => ({
  type: UPDATE_INITIAL_REPORTER_REP_BALANCE,
  initialReporterID,
  repBalance
});
