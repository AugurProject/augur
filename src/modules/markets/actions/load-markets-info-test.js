import { describe, it } from 'mocha'
import { assert } from 'chai'

import { augur } from 'src/services/augurjs'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import { stub } from 'sinon'

import { loadMarketsInfo } from './load-markets-info'

describe('load-markets-info', () => {
  let mockStore
  let store
  const marketIds = ['0x000000', '0x000000']

  before(() => {
    mockStore = configureMockStore([thunk])
    store = mockStore({})
  })

  beforeEach(() => {
    stub(augur.markets, 'getMarketsInfo')
  })

  afterEach(() => {
    augur.markets.getMarketsInfo.restore()
  })

  it('should pass marketIds to augur.js', () => {
    store.dispatch(loadMarketsInfo(marketIds))
    assert.ok(augur.markets.getMarketsInfo.calledWith({ marketIds }))
  })

  it('filter out undefined markets', () => {
    store.dispatch(loadMarketsInfo(marketIds))
    augur.markets.getMarketsInfo.args[0][1](null, [null, null])
  })
})
