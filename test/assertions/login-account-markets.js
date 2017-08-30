import { describe } from 'mocha'
import { assert } from 'chai'

export default function (loginAccountMarkets) {
  describe(`loginAccountMarket's shape`, () => {
    assert.isDefined(loginAccountMarkets)
    assert.isObject(loginAccountMarkets)
  })
}
