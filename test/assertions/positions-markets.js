

import assertFormattedNumber from 'assertions/common/formatted-number'

export default function (positionsMarkets) {
  assert.isDefined(positionsMarkets, `positionsMarkets isn't defined`)
  assert.isArray(positionsMarkets, `positionsMarkets isn't an array`)

  positionsMarkets.forEach(positionMarket => assertPositionMarket(positionMarket))
}

function assertPositionMarket(positionMarket) {
  describe('positionMarket', () => {
    it('id', () => {
      assert.isDefined(positionMarket.id, `'positionMarket.id' is not defined`)
      assert.isString(positionMarket.id, `'positionMarket.id' isn't a string`)
    })

    it('description', () => {
      assert.isDefined(positionMarket.description, `'positionMarket.description' is not defined`)
      assert.isString(positionMarket.description, `'positionMarket.description' isn't a string`)
    })

    positionMarket.myPositionOutcomes.forEach(positionOutcome => assertOutcome(positionOutcome))

    assertPositionMarketSummary(positionMarket.myPositionsSummary)
  })
}

function assertOutcome(outcome) {
  assert.isNumber(outcome.id, `id isn't a number`)
  assert.isString(outcome.name, `name isn't a string`)
  assertFormattedNumber(outcome.lastPrice, 'positionsMarkets.positionOutcomes[outcome].lastPrice')
  assertPosition(outcome.position)
}

function assertPosition(position) {
  assertFormattedNumber(position.numPositions, 'position.numPositions')
  assertFormattedNumber(position.qtyShares, 'position.qtyShares')
  assertFormattedNumber(position.purchasePrice, 'position.purchasePrice')
  assertFormattedNumber(position.unrealizedNet, 'position.unrealizedNet')
  assertFormattedNumber(position.realizedNet, 'position.realizedNet')
  assertFormattedNumber(position.totalNet, 'position.totalNet')
}

function assertPositionMarketSummary(summary) {
  assertFormattedNumber(summary.unrealizedNet, 'myPositionsSummary.unrealizedNet')
  assertFormattedNumber(summary.realizedNet, 'myPositionsSummary.realizedNet')
  assertFormattedNumber(summary.totalNet, 'myPositionsSummary.totalNet')
}
