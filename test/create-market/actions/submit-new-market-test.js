<<<<<<< Updated upstream


import BigNumber from 'bignumber.js'
=======
import { describe, it } from 'mocha'
import { assert } from 'chai'
>>>>>>> Stashed changes
import sinon from 'sinon'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

describe.only('modules/create-market/actions/submit-new-market', () => {
  const mockStore = configureMockStore([thunk])
  const pendingTransaction = { type: 'addPendingTransaction' }
  const clearNewMarket = { type: 'clearNewMarket' }
  const invalidateMarketCreation = { type: 'invalidateMarketCreation' }
  const addNewMarketCreationTransactions =
    function addTransaction() {
      return pendingTransaction
    }

  const buildCreateMarketSuccess = (newMarket) => {
    const result = {
      createMarket: (options) => {
        options.onSent()
        options.onSuccess({ callReturn: 'marketId' })
      },
      formattedNewMarket: newMarket,
    }
    return result
  }

  const buildCreateMarketFailure = (newMarket) => {
    const result = {
      createMarket: (options) => {
        options.onSent()
        options.onFailed({ message: 'error' })
      },
      formattedNewMarket: newMarket,
    }
    return result
  }

  const { submitNewMarket, __RewireAPI__ } = require('modules/create-market/actions/submit-new-market')

  const history = {
    push: sinon.stub(),
  }

  const constants = {
    PARALLEL_LIMIT: '4',
  }

  beforeEach(() => {
    history.push.reset()
  })

  afterEach(() => {
    __RewireAPI__.__ResetDependency__('constants', constants)
    __RewireAPI__.__ResetDependency__('addNewMarketCreationTransactions', addNewMarketCreationTransactions)
    __RewireAPI__.__ResetDependency__('invalidateMarketCreation', () => (invalidateMarketCreation))
    __RewireAPI__.__ResetDependency__('clearNewMarket', () => (clearNewMarket))
  })

  const test = t => it(t.description, () => {
    __RewireAPI__.__Rewire__('clearNewMarket', () => (clearNewMarket))
    __RewireAPI__.__Rewire__('constants', constants)
    __RewireAPI__.__Rewire__('buildCreateMarket', t.buildCreateMarket)
    __RewireAPI__.__Rewire__('addNewMarketCreationTransactions', addNewMarketCreationTransactions)
    __RewireAPI__.__Rewire__('invalidateMarketCreation', () => (invalidateMarketCreation))

    const store = mockStore(t.state || {})

    t.assertions(store)
  })

  test({
    description: `should dispatch the expected action and call the expected function from the 'onSent' callback`,
    state: {
      universe: {
        id: '1010101',
      },
      contractAddresses: {
        Cash: 'domnination',
      },
      loginAccount: {
        meta: {
          test: 'object',
        },
        address: '0x1233',
      },
      newMarket: { properties: 'value', orderBook: {} },
    },
    buildCreateMarket: buildCreateMarketSuccess,
    assertions: (store) => {
      store.dispatch(submitNewMarket(store.getState().newMarket, history))
      assert.isTrue(history.push.calledOnce, `didn't push a new path to history`)
      const actual = store.getActions()
      const expected = [
        pendingTransaction,
        clearNewMarket,
      ]
      assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
    },
  })

  test({
    description: `should dispatch the expected actions from the 'onSuccess' callback when an orderbook IS NOT present`,
    state: {
      universe: {
        id: '1010101',
      },
      contractAddresses: {
        Cash: 'domnination',
      },
      loginAccount: {
        meta: {
          test: 'object',
        },
        address: '0x1233',
      },
      newMarket: { properties: 'value', orderBook: {} },
    },
    buildCreateMarket: buildCreateMarketSuccess,
    assertions: (store) => {
      store.dispatch(submitNewMarket(store.getState().newMarket, history))
      const actual = store.getActions()
      const expected = [pendingTransaction, clearNewMarket]
      assert.isTrue(history.push.calledOnce, `didn't push a new path to history`)
      assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
    },
  })

  test({
    description: `should dispatch the expected actions from the 'onSuccess' callback when an orderbook IS present`,
    state: {
      universe: {
        id: '1010101',
      },
      contractAddresses: {
        Cash: 'domnination',
      },
      loginAccount: {
        meta: {
          test: 'object',
        },
        address: '0x1233',
      },
      newMarket: { properties: 'value', orderBook: {} },
    },
    buildCreateMarket: buildCreateMarketSuccess,
    assertions: (store) => {
      __RewireAPI__.__Rewire__('updateTradesInProgress', (callReturn, outcomeId, type, quantity, price, nogo, cb) => {
        cb({})
        return {
          type: 'updateTradesInProgress',
          outcomeId,
        }
      })

      __RewireAPI__.__Rewire__('placeTrade', (callReturn, outcomeId, tradeToExecute, nogo, cb) => {
        cb()
        return {
          type: 'placeTrade',
          outcomeId,
        }
      })

      store.dispatch(submitNewMarket(store.getState().newMarket, history))

      const actual = store.getActions()

      const expected = [
        {
          outcomeId: 1,
          type: 'placeTrade',
        },
        {
          outcomeId: 1,
          type: 'updateTradesInProgress',
        },
        {
          outcomeId: 1,
          type: 'placeTrade',
        },
        {
          outcomeId: 1,
          type: 'updateTradesInProgress',
        },
        {
          outcomeId: 1,
          type: 'placeTrade',
        },
        {
          outcomeId: 1,
          type: 'updateTradesInProgress',
        },
        {
          outcomeId: 1,
          type: 'placeTrade',
        },
        {
          outcomeId: 1,
          type: 'updateTradesInProgress',
        },
        {
          outcomeId: 1,
          type: 'placeTrade',
        },
        {
          outcomeId: 1,
          type: 'updateTradesInProgress',
        },
        {
          outcomeId: 1,
          type: 'placeTrade',
        },
        {
          outcomeId: 1,
          type: 'updateTradesInProgress',
        },
        {
          outcomeId: 0,
          type: 'placeTrade',
        },
        {
          outcomeId: 0,
          type: 'updateTradesInProgress',
        },
        {
          outcomeId: 0,
          type: 'placeTrade',
        },
        {
          outcomeId: 0,
          type: 'updateTradesInProgress',
        },
        {
          outcomeId: 0,
          type: 'placeTrade',
        },
        {
          outcomeId: 0,
          type: 'updateTradesInProgress',
        },
        {
          outcomeId: 0,
          type: 'placeTrade',
        },
        {
          outcomeId: 0,
          type: 'updateTradesInProgress',
        },
        {
          outcomeId: 0,
          type: 'placeTrade',
        },
        {
          outcomeId: 0,
          type: 'updateTradesInProgress',
        },
        {
          outcomeId: 0,
          type: 'placeTrade',
        },
        {
          outcomeId: 0,
          type: 'updateTradesInProgress',
        },
      ]
      assert.isTrue(history.push.calledOnce, `didn't push a new path to history`)
      assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
    },
  })

  test({
    description: `should dispatch the expected actions from the 'onFailed' callback`,
    state: {
      universe: {
        id: '1010101',
      },
      contractAddresses: {
        Cash: 'domnination',
      },
      loginAccount: {
        meta: {
          test: 'object',
        },
        address: '0x1233',
      },
      newMarket: { properties: 'value', orderBook: {} },
    },
    buildCreateMarket: buildCreateMarketFailure,
    assertions: (store) => {
      store.dispatch(submitNewMarket(store.getState().newMarket, history))
      const actual = store.getActions()
      const expected = [pendingTransaction, clearNewMarket, invalidateMarketCreation]
      assert.isTrue(history.push.calledOnce, `didn't push a new path to history`)
      assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
    },
  })
})
