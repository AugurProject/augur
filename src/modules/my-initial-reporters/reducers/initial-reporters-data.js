import { UPDATE_INITIAL_REPORTERS_DATA, UPDATE_INITIAL_REPORTERS_ESCAPE_HATCH_GAS_COST, UPDATE_INITIAL_REPORTER_REP_BALANCE } from 'modules/my-initial-reporters/actions/update-initial-reporters'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (initialReportersData = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_INITIAL_REPORTERS_DATA: {
      const updatedInitialReporters = Object.keys(action.initialReportersData).reduce((p, initialReporterID) => {
        p[initialReporterID] = { ...initialReportersData[initialReporterID], ...action.initialReportersData[initialReporterID] }
        return p
      }, {})

      return {
        ...initialReportersData,
        ...updatedInitialReporters,
      }
    }
    case UPDATE_INITIAL_REPORTERS_ESCAPE_HATCH_GAS_COST: {
      if (!action.initialReporterID) return initialReportersData
      return {
        ...initialReportersData,
        [action.initialReporterID]: {
          ...initialReportersData[action.initialReporterID],
          escapeHatchGasCost: action.escapeHatchGasCost,
        },
      }
    }
    case UPDATE_INITIAL_REPORTER_REP_BALANCE: {
      if (!action.initialReporterID) return initialReportersData
      return {
        ...initialReportersData,
        [action.initialReporterID]: {
          ...initialReportersData[action.initialReporterID],
          repBalance: action.repBalance,
        },
      }
    }
    case RESET_STATE:
    default:
      return initialReportersData
  }
}
