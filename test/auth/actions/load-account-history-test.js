
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import { loadAccountHistory, __RewireAPI__ } from 'modules/auth/actions/load-account-history'


describe(`modules/auth/actions/load-account-history.js`, () => {
  const store = configureMockStore([thunk])({
    loginAccount: {
      address: '0xb0b',
    },
  })
  const ACTIONS = {
    LOAD_ACCOUNT_TRADES: 'LOAD_ACCOUNT_TRADES',
    LOAD_FUNDING_HISTORY: 'LOAD_FUNDING_HISTORY',
    LOAD_CREATE_MARKET_HISTORY: 'LOAD_CREATE_MARKET_HISTORY',
    LOAD_REPORTING_HISTORY: 'LOAD_REPORTING_HISTORY',
    UPDATE_TRANSACTIONS_LOADING: 'UPDATE_TRANSACTIONS_LOADING',
    CLEAR_TRANSACTION_DATA: 'CLEAR_TRANSACTION_DATA',
  }

  beforeEach(() => {
    __RewireAPI__.__Rewire__('loadAccountTrades', () => ({
      type: ACTIONS.LOAD_ACCOUNT_TRADES,
    }))

    __RewireAPI__.__Rewire__('loadFundingHistory', () => ({
      type: ACTIONS.LOAD_FUNDING_HISTORY,
    }))

    __RewireAPI__.__Rewire__('loadCreateMarketHistory', () => ({
      type: ACTIONS.LOAD_CREATE_MARKET_HISTORY,
    }))

    __RewireAPI__.__Rewire__('loadReportingHistory', () => ({
      type: ACTIONS.LOAD_REPORTING_HISTORY,
    }))
  })

  afterEach(() => {
    store.clearActions()
    __RewireAPI__.__ResetDependency__('loadAccountTrades')
    __RewireAPI__.__ResetDependency__('loadFundingHistory')
    __RewireAPI__.__ResetDependency__('loadCreateMarketHistory')
    __RewireAPI__.__ResetDependency__('loadReportingHistory')
  })


  it('get actions for running through', () => {
    store.dispatch(loadAccountHistory(123456, 234567))
    const actual = store.getActions()
    const expected = [{
      data: {
        isLoading: true,
      },
      type: ACTIONS.UPDATE_TRANSACTIONS_LOADING,
    },
    {
      type: ACTIONS.CLEAR_TRANSACTION_DATA,
    }, {
      type: ACTIONS.LOAD_ACCOUNT_TRADES,
    }, {
      type: ACTIONS.LOAD_FUNDING_HISTORY,
    }, {
      type: ACTIONS.LOAD_CREATE_MARKET_HISTORY,
    }, {
      type: ACTIONS.LOAD_REPORTING_HISTORY,
    }]

    assert.deepEqual(actual, expected, `Dispatched unexpected actions.`)
  })

})
