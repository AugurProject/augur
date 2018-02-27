export const UPDATE_INITIAL_REPORTERS_DATA = 'UPDATE_INITIAL_REPORTERS_DATA'
export const UPDATE_INITIAL_REPORTERS_ESCAPE_HATCH_GAS_COST = 'UPDATE_INITIAL_REPORTERS_ESCAPE_HATCH_GAS_COST'
export const UPDATE_INITIAL_REPORTER_REP_BALANCE = 'UPDATE_INITIAL_REPORTER_REP_BALANCE'

export const updateInitialReportersData = initialReportersData => ({ type: UPDATE_INITIAL_REPORTERS_DATA, initialReportersData })
export const updateInitialReportersEscapeHatchGasCost = (initialReporterID, escapeHatchGasCost) => ({ type: UPDATE_INITIAL_REPORTERS_ESCAPE_HATCH_GAS_COST, initialReporterID, escapeHatchGasCost })
export const updateInitialReporterRepBalance = (initialReporterID, repBalance) => ({ type: UPDATE_INITIAL_REPORTER_REP_BALANCE, initialReporterID, repBalance })
