
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { estimateSubmitNewMarket, __RewireAPI__ as estimateSubmitNewMarketReqireAPI } from 'modules/create-market/actions/estimate-submit-new-market'
import { YES_NO, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'

describe(`modules/create-market/actions/estimate-submit-new-market.js`, () => {
  const mockStore = configureMockStore([thunk])
  const newBinaryMarket = { properties: 'value', type: YES_NO }
  const newScalarMarket = { properties: 'value', type: SCALAR }
  const newCatMarket = { properties: 'value', type: CATEGORICAL }
  const stateData = {
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
  }

  const augur = {
    constants: {
      CREATE_CATEGORICAL_MARKET_GAS: 'oxygen',
      CREATE_SCALAR_MARKET_GAS: 'helium',
      CREATE_YES_NO_MARKET_GAS: 'methane',
    },
  }

  after(() => {
    estimateSubmitNewMarketReqireAPI.__ResetDependency__('augur')
  })

  const test = t => it(t.description, () => {
    estimateSubmitNewMarketReqireAPI.__Rewire__('augur', augur)
    const store = mockStore(t.state || {})
    t.assertions(store)
  })

  test({
    description: 'should call callback with success and gas cost value',
    state: stateData,
    assertions: (store) => {
      store.dispatch(estimateSubmitNewMarket(newBinaryMarket, (err, value) => {
        assert.deepEqual(err, null, `Error value not as expected`)
        assert.deepEqual(value, 'methane', `Didn't value as expected`)
      }))
    },
  })

  test({
    description: 'should call callback with success and gas cost value',
    state: stateData,
    assertions: (store) => {
      store.dispatch(estimateSubmitNewMarket(newScalarMarket, (err, value) => {
        assert.deepEqual(err, null, `Error value not as expected`)
        assert.deepEqual(value, 'helium', `Didn't value as expected`)
      }))
    },
  })

  test({
    description: 'should call callback with success and gas cost value',
    state: stateData,
    assertions: (store) => {
      store.dispatch(estimateSubmitNewMarket(newCatMarket, (err, value) => {
        assert.deepEqual(err, null, `Error value not as expected`)
        assert.deepEqual(value, 'oxygen', `Didn't value as expected`)
      }))
    },
  })

})
