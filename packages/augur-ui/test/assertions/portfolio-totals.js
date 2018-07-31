

import assertFormattedNumber from 'assertions/common/formatted-number'

export default function (portfolioTotals) {
  describe(`portfolioTotals' shape`, () => {
    assert.isDefined(portfolioTotals)
    assert.isObject(portfolioTotals)

    it('net', () => {
      assert.isDefined(portfolioTotals.netChange)
      assertFormattedNumber(portfolioTotals.netChange, 'portfolio.totals.netChange')
    })
  })
}
