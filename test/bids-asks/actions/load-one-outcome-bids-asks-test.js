

import proxyquire from 'proxyquire'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

describe(`modules/bids-asks/actions/load-one-outcome-bids-asks.js`, () => {
  proxyquire.noPreserveCache()
  const test = t => it(t.description, (done) => {
    const store = configureMockStore([thunk])({})
    const loadOneOutcomeBidsAsks = proxyquire('../../../src/modules/bids-asks/actions/load-one-outcome-bids-asks', {
      './load-one-outcome-bids-or-asks': t.stub.loadOneOutcomeBidsOrAsks,
    }).default
    store.dispatch(loadOneOutcomeBidsAsks(t.params.marketId, t.params.outcome, (err) => {
      t.assertions(err, store.getActions())
      store.clearActions()
      done()
    }))
  })
  test({
    description: 'short-circuit if market ID not provided',
    params: {
      marketId: null,
      outcome: 3,
    },
    stub: {
      loadOneOutcomeBidsOrAsks: {
        default: () => () => assert.fail(),
      },
    },
    assertions: (err, actions) => {
      assert.strictEqual(err, 'must specify market ID and outcome: null 3')
      assert.deepEqual(actions, [])
    },
  })
  test({
    description: 'short-circuit if outcome not provided',
    params: {
      marketId: 'MARKET_0',
      outcome: null,
    },
    stub: {
      loadOneOutcomeBidsOrAsks: {
        default: () => () => assert.fail(),
      },
    },
    assertions: (err, actions) => {
      assert.strictEqual(err, 'must specify market ID and outcome: MARKET_0 null')
      assert.deepEqual(actions, [])
    },
  })
  test({
    description: 'load bids and asks for single outcome',
    params: {
      marketId: 'MARKET_0',
      outcome: 3,
    },
    stub: {
      loadOneOutcomeBidsOrAsks: {
        default: (marketId, outcome, orderTypeLabel, callback) => (dispatch) => {
          dispatch({
            type: 'LOAD_ONE_OUTCOME_BIDS_OR_ASKS',
            marketId,
            outcome,
            orderTypeLabel,
          })
          callback(null)
        },
      },
    },
    assertions: (err, actions) => {
      assert.isNull(err)
      assert.deepEqual(actions, [{
        type: 'LOAD_ONE_OUTCOME_BIDS_OR_ASKS',
        marketId: 'MARKET_0',
        outcome: 3,
        orderTypeLabel: 'buy',
      }, {
        type: 'LOAD_ONE_OUTCOME_BIDS_OR_ASKS',
        marketId: 'MARKET_0',
        outcome: 3,
        orderTypeLabel: 'sell',
      }])
    },
  })
  test({
    description: 'propagate loadOneOutcomeBidsOrAsks error',
    params: {
      marketId: 'MARKET_0',
      outcome: 3,
    },
    stub: {
      loadOneOutcomeBidsOrAsks: {
        default: (marketId, outcome, orderTypeLabel, callback) => (dispatch) => {
          dispatch({
            type: 'LOAD_ONE_OUTCOME_BIDS_OR_ASKS',
            marketId,
            outcome,
            orderTypeLabel,
          })
          callback('ERROR_MESSAGE')
        },
      },
    },
    assertions: (err, actions) => {
      assert.strictEqual(err, 'ERROR_MESSAGE')
      assert.deepEqual(actions, [{
        type: 'LOAD_ONE_OUTCOME_BIDS_OR_ASKS',
        marketId: 'MARKET_0',
        outcome: 3,
        orderTypeLabel: 'buy',
      }])
    },
  })
})
