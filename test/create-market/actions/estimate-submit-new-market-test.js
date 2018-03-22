
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { estimateSubmitNewMarket, __RewireAPI__ as estimateSubmitNewMarketReqireAPI } from 'modules/reporting/actions/estimate-submit-initial-report'

describe.only(`modules/create-market/actions/estimate-submit-new-market.js`, () => {
  const mockStore = configureMockStore([thunk])
  const newMarket = { properties: 'value' }
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
  const buildCreateMarketSuccess = (newMarket) => {
    const result = {
      createMarket: (options) => {
        options.onSuccess('gasCostValue')
      },
      formattedNewMarket: newMarket,
    }
    return result
  }

  const buildCreateMarketFailure = (newMarket) => {
    const result = {
      createMarket: (options) => {
        options.onFailed('Error')
      },
      formattedNewMarket: newMarket,
    }
    return result
  }

  after(() => {
    estimateSubmitNewMarketReqireAPI.__ResetDependency__('buildCreateMarket')
  })

  const test = t => it(t.description, () => {
    estimateSubmitNewMarketReqireAPI.__Rewire__('buildCreateMarket', t.buildCreateMarket)
    const store = mockStore(t.state || {})
    t.assertions(store)
  })

  test({
    desciption: `should call callback with success and gas cost value`,
    state: stateData,
    buildCreateMarket: buildCreateMarketSuccess,
    assertions: (store) => {
      store.dispatch(estimateSubmitNewMarket(newMarket, (value) => {
        assert.deepEqual(value, 'gasCostValue', `Didn't value as expected`)
      }))
    },
  })

  test({
    desciption: `should call callback with failure and gas cost value`,
    state: stateData,
    buildCreateMarket: buildCreateMarketFailure,
    assertions: (store) => {
      store.dispatch(estimateSubmitNewMarket(newMarket, (value) => {
        assert.deepEqual(value, 'Error', `Didn't value as expected`)
      }))
    },
  })

})
