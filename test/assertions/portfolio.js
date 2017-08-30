import { describe } from 'mocha'
import { assert } from 'chai'

export default function (portfolio) {
  describe('portfolio state', () => {
    assert.isDefined(portfolio)
    assert.isObject(portfolio)
  })
}
