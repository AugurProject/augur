import { YES_NO, CATEGORICAL } from 'modules/markets/constants/market-types'
import { YES_NO_NO_ID, YES_NO_NO_OUTCOME_NAME, YES_NO_YES_ID, YES_NO_YES_OUTCOME_NAME } from 'modules/markets/constants/market-outcomes'

export const selectReportableOutcomes = (type, outcomes) => {
  switch (type) {
    case YES_NO:
      return [{
        id: `${YES_NO_NO_ID}`,
        name: YES_NO_NO_OUTCOME_NAME,
      }, {
        id: `${YES_NO_YES_ID}`,
        name: YES_NO_YES_OUTCOME_NAME,
      }]
    case CATEGORICAL:
      return outcomes.slice()
    default:
      return []
  }
}
