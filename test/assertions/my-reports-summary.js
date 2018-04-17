
import assertFormattedNumber from 'assertions/common/formatted-number'

export default function (reportsSummary) {
  assert.isDefined(reportsSummary, `reportsSummary isn't defined`)
  assert.isObject(reportsSummary, `reportsSummary isn't an object`)

  assertFormattedNumber(reportsSummary.numReports, 'reportsSummary.numReports')
  assertFormattedNumber(reportsSummary.netRep, 'reportsSummary.netRep')
}
