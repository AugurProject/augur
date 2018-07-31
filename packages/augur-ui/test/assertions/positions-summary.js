
import assertFormattedNumber from 'assertions/common/formatted-number'

export default function (positionsSummary) {
  assert.isDefined(positionsSummary, `positionsSummary isn't defined`)
  assert.isObject(positionsSummary, `positionsSummary isn't an object`)

  assertFormattedNumber(positionsSummary.numPositions, 'positionsSummary.numPositions')
  assertFormattedNumber(positionsSummary.purchasePrice, 'positionsSummary.purchasePrice')
  assertFormattedNumber(positionsSummary.qtyShares, 'positionsSummary.qtyShares')
  assertFormattedNumber(positionsSummary.realizedNet, 'positionsSummary.realizedNet')
  assertFormattedNumber(positionsSummary.unrealizedNet, 'positionsSummary.unrealizedNet')
  assertFormattedNumber(positionsSummary.totalNet, 'positionsSummary.totalNet')
}
