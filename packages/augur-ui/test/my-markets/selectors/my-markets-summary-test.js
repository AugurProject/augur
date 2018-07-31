import { describe, it, before } from 'mocha'

import myMarketsSummaryAssertions from 'assertions/my-markets-summary'
import sinon from 'sinon'
import proxyquire from 'proxyquire'
import * as mockStore from 'test/mockStore'

describe('modules/my-markets/selectors/my-markets-summary', () => {
  proxyquire.noPreserveCache().noCallThru()
  let actual
  const { store } = mockStore.default
  const {
    loginAccount, allMarkets, marketTrades, priceHistory, marketCreatorFees,
  } = store.getState()

  const MarketsAll = () => allMarkets

  const SelectState = {
    selectLoginAccountAddress: () => loginAccount.address,
    selectMarketTradesState: () => marketTrades,
    selectPriceHistoryState: () => priceHistory,
    selectMarketCreatorFeesState: () => marketCreatorFees,
  }

  const proxiedMyMarkets = proxyquire('../../../src/modules/my-markets/selectors/my-markets', {
    '../../markets/selectors/markets-all': MarketsAll,
    '../../../select-state': SelectState,
    '../../../store': store,
  })

  const spiedMyMarkets = sinon.spy(proxiedMyMarkets, 'default')

  const proxiedSelector = proxyquire('../../../src/modules/my-markets/selectors/my-markets-summary', {
    './my-markets': proxiedMyMarkets,
  })

  const expected = {
    numMarkets: 2,
    totalValue: 21,
  }

  before(() => {
    actual = proxiedSelector.default()
  })

  it(`should call 'selectMyMarkets' once`, () => {
    assert(spiedMyMarkets.calledOnce, `Didn't call 'selectMyMarkets' once as expected`)
  })

  it(`should return the correct object`, () => {
    assert.deepEqual(expected, actual, `Didn't return the expected object`)
  })

  it('should return the correct object to augur-ui-react-components', () => {
    myMarketsSummaryAssertions(actual)
  })
})
