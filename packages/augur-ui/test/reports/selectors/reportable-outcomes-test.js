

import reportableOutcomesAssertions from 'assertions/reportable-outcomes'

import { selectReportableOutcomes } from 'modules/reports/selectors/reportable-outcomes'
import { YES_NO, CATEGORICAL } from 'modules/markets/constants/market-types'
import { YES_NO_NO_ID, YES_NO_NO_OUTCOME_NAME, YES_NO_YES_ID, YES_NO_YES_OUTCOME_NAME } from 'modules/markets/constants/market-outcomes'

describe('modules/reports/selectors/reportable-outcomes.js', () => {
  let actual
  let expected

  it('should return the correct array for a YES_NO market', () => {
    actual = selectReportableOutcomes(YES_NO)
    expected = [
      {
        id: `${YES_NO_NO_ID}`,
        name: YES_NO_NO_OUTCOME_NAME,
      },
      {
        id: `${YES_NO_YES_ID}`,
        name: YES_NO_YES_OUTCOME_NAME,
      },
    ]

    assert.deepEqual(actual, expected, `expected array for a yes/no  market was not returned`)
    // assertions.reportableOutcomes(actual);
  })

  it('should return the correct array for a CATEGORICAL market', () => {
    const outcomes = [
      {
        id: '3',
        name: 'out3',
      },
      {
        id: '1',
        name: 'out1',
      },
      {
        id: '2',
        name: 'out2',
      },
    ]

    actual = selectReportableOutcomes(CATEGORICAL, outcomes)
    expected = [
      {
        id: '3',
        name: 'out3',
      },
      {
        id: '1',
        name: 'out1',
      },
      {
        id: '2',
        name: 'out2',
      },
    ]

    assert.deepEqual(actual, expected, `expected array for a CATEGORICAL market was not returned`)
    reportableOutcomesAssertions(actual)
  })

  it('should return the correct array for DEFAULT case', () => {
    actual = selectReportableOutcomes(null)
    expected = []

    assert.deepEqual(actual, expected, `expected array for a DEFAULT case was not returned`)
  })
})
