

export default function (myMarketsSummary) {
  describe(`myMarketsSummary's shape`, () => {
    assert.isDefined(myMarketsSummary)
    assert.isObject(myMarketsSummary)

    assertMyMarketsSummary(myMarketsSummary)
  })
}

export function assertMyMarketsSummary(summary) {
  describe(`summary's shape`, () => {
    assert.isDefined(summary)
    assert.isObject(summary)

    it('numMarkets', () => {
      assert.isDefined(summary.numMarkets)
      assert.isNumber(summary.numMarkets)
    })
  })
}
