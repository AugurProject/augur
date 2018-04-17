

import proxyquire from 'proxyquire'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

const marketsData = { MARKET_0: { numOutcomes: 3 } }

describe(`modules/bids-asks/actions/load-bids-asks.js`, () => {
  proxyquire.noPreserveCache()
  const test = t => it(t.description, (done) => {
    const store = configureMockStore([thunk])({ ...t.mock.state })
    const loadBidsAsks = proxyquire('../../../src/modules/bids-asks/actions/load-bids-asks', {
      './load-one-outcome-bids-asks': t.stub.loadOneOutcomeBidsAsks,
    }).default
    store.dispatch(loadBidsAsks(t.params.marketId, (err) => {
      t.assertions(err, store.getActions())
      store.clearActions()
      done()
    }))
  })
  test({
    description: 'short-circuit if market ID not provided',
    params: {
      marketId: undefined,
    },
    mock: {
      state: { marketsData },
    },
    stub: {
      loadOneOutcomeBidsAsks: {
        default: () => () => assert.fail(),
      },
    },
    assertions: (err, actions) => {
      assert.strictEqual(err, 'must specify market ID: undefined')
      assert.deepEqual(actions, [])
    },
  })
  test({
    description: 'short-circuit if market data not found',
    params: {
      marketId: 'MARKET_0',
    },
    mock: {
      state: { marketsData: {} },
    },
    stub: {
      loadOneOutcomeBidsAsks: {
        default: () => () => assert.fail(),
      },
    },
    assertions: (err, actions) => {
      assert.strictEqual(err, 'market MARKET_0 data not found')
      assert.deepEqual(actions, [])
    },
  })
  test({
    description: 'short-circuit if market numOutcomes not found',
    params: {
      marketId: 'MARKET_0',
    },
    mock: {
      state: {
        marketsData: { MARKET_0: { numOutcomes: undefined } },
      },
    },
    stub: {
      loadOneOutcomeBidsAsks: {
        default: () => () => assert.fail(),
      },
    },
    assertions: (err, actions) => {
      assert.strictEqual(err, 'market MARKET_0 numOutcomes not found')
      assert.deepEqual(actions, [])
    },
  })
  test({
    description: 'market with 2 outcomes',
    params: {
      marketId: 'MARKET_0',
    },
    mock: {
      state: {
        marketsData: {
          MARKET_0: { numOutcomes: 2 },
        },
      },
    },
    stub: {
      loadOneOutcomeBidsAsks: {
        default: (marketId, outcome, callback) => (dispatch) => {
          dispatch({
            type: 'LOAD_ONE_OUTCOME_BIDS_ASKS',
            marketId,
            outcome,
          })
          callback(null)
        },
      },
    },
    assertions: (err, actions) => {
      assert.isNull(err)
      assert.deepEqual(actions, [{
        type: 'LOAD_ONE_OUTCOME_BIDS_ASKS',
        marketId: 'MARKET_0',
        outcome: 0,
      }, {
        type: 'LOAD_ONE_OUTCOME_BIDS_ASKS',
        marketId: 'MARKET_0',
        outcome: 1,
      }])
    },
  })
  test({
    description: 'market with 3 outcomes',
    params: {
      marketId: 'MARKET_0',
    },
    mock: {
      state: { marketsData },
    },
    stub: {
      loadOneOutcomeBidsAsks: {
        default: (marketId, outcome, callback) => (dispatch) => {
          dispatch({
            type: 'LOAD_ONE_OUTCOME_BIDS_ASKS',
            marketId,
            outcome,
          })
          callback(null)
        },
      },
    },
    assertions: (err, actions) => {
      assert.isNull(err)
      assert.deepEqual(actions, [{
        type: 'LOAD_ONE_OUTCOME_BIDS_ASKS',
        marketId: 'MARKET_0',
        outcome: 0,
      }, {
        type: 'LOAD_ONE_OUTCOME_BIDS_ASKS',
        marketId: 'MARKET_0',
        outcome: 1,
      }, {
        type: 'LOAD_ONE_OUTCOME_BIDS_ASKS',
        marketId: 'MARKET_0',
        outcome: 2,
      }])
    },
  })
  test({
    description: 'propagate loadOneOutcomeBidsAsks error',
    params: {
      marketId: 'MARKET_0',
    },
    mock: {
      state: { marketsData },
    },
    stub: {
      loadOneOutcomeBidsAsks: {
        default: (marketId, outcome, callback) => (dispatch) => {
          dispatch({
            type: 'LOAD_ONE_OUTCOME_BIDS_ASKS',
            marketId,
            outcome,
          })
          callback('ERROR_MESSAGE')
        },
      },
    },
    assertions: (err, actions) => {
      assert.strictEqual(err, 'ERROR_MESSAGE')
      assert.deepEqual(actions, [{
        type: 'LOAD_ONE_OUTCOME_BIDS_ASKS',
        marketId: 'MARKET_0',
        outcome: 0,
      }])
    },
  })
})
