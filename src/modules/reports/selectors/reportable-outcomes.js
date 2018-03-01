import { augur } from 'services/augurjs'
import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { BINARY_NO_ID, BINARY_NO_OUTCOME_NAME, BINARY_YES_ID, BINARY_YES_OUTCOME_NAME, CATEGORICAL_SCALAR_INDETERMINATE_OUTCOME_ID, INDETERMINATE_OUTCOME_NAME } from 'modules/markets/constants/market-outcomes'

export const selectReportableOutcomes = (type, outcomes) => {
  switch (type) {
    case BINARY:
      return [{
        id: `${BINARY_NO_ID}`,
        name: BINARY_NO_OUTCOME_NAME,
      }, {
        id: `${BINARY_YES_ID}`,
        name: BINARY_YES_OUTCOME_NAME,
      }]
    case CATEGORICAL:
      return outcomes.slice()
    default:
      return []
  }
}

export function selectOutcomeName(outcomeId, marketType, marketOutcomesData = {}) {
  let outcomeName
  if (marketType === BINARY) {
    if (outcomeId === '1') {
      outcomeName = BINARY_NO_OUTCOME_NAME
    } else if (outcomeId === '2') {
      outcomeName = BINARY_YES_OUTCOME_NAME
    } else {
      outcomeName = INDETERMINATE_OUTCOME_NAME
    }
  } else if (outcomeId === CATEGORICAL_SCALAR_INDETERMINATE_OUTCOME_ID) {
    outcomeName = INDETERMINATE_OUTCOME_NAME
  } else if (marketType === SCALAR) {
    outcomeName = outcomeId
  } else {
    outcomeName = marketOutcomesData[outcomeId] ? marketOutcomesData[outcomeId].name : outcomeId
  }
  return outcomeName
}

export function formatReportedOutcome(rawReportedOutcome, minPrice, maxPrice, marketType, marketOutcomesData = {}) {
  const report = augur.reporting.format.unfixReport(rawReportedOutcome, minPrice, maxPrice, marketType)
  const outcomeName = report.isIndeterminate ? INDETERMINATE_OUTCOME_NAME : selectOutcomeName(report.report, marketType, marketOutcomesData || {})
  return outcomeName
}
