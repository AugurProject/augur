

export default function (loginAccountMarkets) {
  describe(`loginAccountMarket's shape`, () => {
    assert.isDefined(loginAccountMarkets)
    assert.isObject(loginAccountMarkets)
  })
}
