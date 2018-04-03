

import { createBigNumber } from 'utils/create-big-number'
import sinon from 'sinon'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

import { BUY, SELL } from 'modules/transactions/constants/types'
import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { DESIGNATED_REPORTER_SELF, DESIGNATED_REPORTER_SPECIFIC } from 'modules/create-market/constants/new-market-constraints'

describe('modules/create-market/actions/submit-new-market', () => {
  const mockStore = configureMockStore([thunk])
  const addNewMarketCreationTransactions =
    function addTransaction() {
      return { type: 'addPendingTransaction' }
    }

  const test = t => it(t.description, () => {
    const store = mockStore(t.state || {})
    t.assertions(store)
  })

  test({
    description: `should submit well formed 'formattedNewMarket' object to 'createCategoricalMarket' for categorical market`,
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
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000,
        },
        expirySource: '',
        settlementFee: 2,
        designatedReporterType: DESIGNATED_REPORTER_SELF,
        makerFee: 1,
        detailsText: '',
        category: 'test category',
        tags: [],
        type: CATEGORICAL,
        outcomes: [
          'one',
          'two',
        ],
      },
    },
    assertions: (store) => {
      const { submitNewMarket, __RewireAPI__ } = require('modules/create-market/actions/submit-new-market')

      const mockAugur = {
        createMarket: { createCategoricalMarket: () => { } },
      }
      let formattedNewMarket = null
      sinon.stub(mockAugur.createMarket, 'createCategoricalMarket').callsFake((createMarketObject) => {
        delete createMarketObject.onSent
        delete createMarketObject.onSuccess
        delete createMarketObject.onFailed

        formattedNewMarket = createMarketObject
      })

      __RewireAPI__.__Rewire__('augur', mockAugur)
      __RewireAPI__.__Rewire__('addNewMarketCreationTransactions', addNewMarketCreationTransactions)

      store.dispatch(submitNewMarket(store.getState().newMarket))

      const expected = {
        meta: {
          test: 'object',
        },
        _designatedReporterAddress: '0x1233',
        universe: '1010101',
        _endTime: 1234567890000,
        _denominationToken: 'domnination',
        _description: 'test description',
        _extraInfo: {
          marketType: 'categorical',
          longDescription: '',
          resolutionSource: '',
          tags: [],
        },
        _outcomes: [
          'one',
          'two',
        ],
        _topic: 'test category',
        _feePerEthInWei: '0x470de4df820000',
      }

      assert.deepEqual(formattedNewMarket, expected, `Didn't form the formattedNewMarket object as expected`)
    },
  })

  test({
    description: `should submit well formed 'formattedNewMarket' object to 'createBinaryMarket' for binary market`,
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
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000,
        },
        expirySource: '',
        settlementFee: 2,
        designatedReporterAddress: '0x01234abcd',
        designatedReporterType: DESIGNATED_REPORTER_SPECIFIC,
        makerFee: 1,
        detailsText: '',
        category: 'test category',
        tags: [],
        type: BINARY,
      },
    },
    assertions: (store) => {
      const { submitNewMarket, __RewireAPI__ } = require('modules/create-market/actions/submit-new-market')

      const mockAugur = {
        createMarket: { createBinaryMarket: () => { } },
      }
      let formattedNewMarket = null
      sinon.stub(mockAugur.createMarket, 'createBinaryMarket').callsFake((createMarketObject) => {
        delete createMarketObject.onSent
        delete createMarketObject.onSuccess
        delete createMarketObject.onFailed

        formattedNewMarket = createMarketObject
      })

      __RewireAPI__.__Rewire__('augur', mockAugur)

      store.dispatch(submitNewMarket(store.getState().newMarket))

      const expected = {
        _designatedReporterAddress: '0x01234abcd',
        meta: {
          test: 'object',
        },
        universe: '1010101',
        _endTime: 1234567890000,
        _denominationToken: 'domnination',
        _description: 'test description',
        _extraInfo: {
          marketType: 'binary',
          longDescription: '',
          resolutionSource: '',
          tags: [],
        },
        _topic: 'test category',
        _feePerEthInWei: '0x470de4df820000',
      }

      assert.deepEqual(formattedNewMarket, expected, `Didn't form the formattedNewMarket object as expected`)
    },
  })

  test({
    description: `should submit well formed 'formattedNewMarket' object to 'createScalarMarket' for scalar market`,
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
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000,
        },
        expirySource: '',
        settlementFee: 2,
        makerFee: 1,
        designatedReporterAddress: '0x01234abcd',
        designatedReporterType: DESIGNATED_REPORTER_SPECIFIC,
        detailsText: '',
        category: 'test category',
        tags: [],
        type: SCALAR,
        scalarSmallNum: '-10', // String for the test case, normally a BigNumber
        scalarBigNum: '10', // String for the test case, normally a BigNumber
        scalarDenomination: '%',
        tickSize: 1000,
      },
    },
    assertions: (store) => {
      const { submitNewMarket, __RewireAPI__ } = require('modules/create-market/actions/submit-new-market')

      const mockAugur = {
        createMarket: { createScalarMarket: () => { } },
      }
      let formattedNewMarket = null
      sinon.stub(mockAugur.createMarket, 'createScalarMarket').callsFake((createMarketObject) => {
        delete createMarketObject.onSent
        delete createMarketObject.onSuccess
        delete createMarketObject.onFailed

        formattedNewMarket = createMarketObject
      })

      __RewireAPI__.__Rewire__('augur', mockAugur)

      store.dispatch(submitNewMarket(store.getState().newMarket))

      const expected = {
        meta: {
          test: 'object',
        },
        _designatedReporterAddress: '0x01234abcd',
        universe: '1010101',
        _endTime: 1234567890000,
        _denominationToken: 'domnination',
        _description: 'test description',
        _extraInfo: {
          _scalarDenomination: '%',
          marketType: 'scalar',
          longDescription: '',
          resolutionSource: '',
          tags: [],
        },
        _maxPrice: '10',
        _minPrice: '-10',
        tickSize: 1000,
        _topic: 'test category',
        _feePerEthInWei: '0x470de4df820000',
      }

      assert.deepEqual(formattedNewMarket, expected, `Didn't form the formattedNewMarket object as expected`)
    },
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
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000,
        },
        expirySource: '',
        settlementFee: 2,
        designatedReporterAddress: false,
        designatedReporterType: DESIGNATED_REPORTER_SELF,
        makerFee: 1,
        detailsText: '',
        category: 'test category',
        tags: [],
        type: BINARY,
      },
    },
    assertions: (store) => {
      const { submitNewMarket, __RewireAPI__ } = require('modules/create-market/actions/submit-new-market')

      const push = sinon.stub()
      const history = {
        push,
      }
      __RewireAPI__.__Rewire__('clearNewMarket', () => ({
        type: 'createNewMarket',
      }))

      const mockAugur = {
        createMarket: {
          createBinaryMarket: (createBinaryMarket) => {
            createBinaryMarket.onSent()
          },
        },
      }
      __RewireAPI__.__Rewire__('augur', mockAugur)

      store.dispatch(submitNewMarket(store.getState().newMarket, history))

      assert.isTrue(push.calledOnce, `didn't push a new path to history`)

      const actual = store.getActions()

      const expected = [
        {
          type: 'addPendingTransaction',
        },
        {
          type: 'createNewMarket',
        },

      ]

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
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000,
        },
        expirySource: '',
        designatedReporterAddress: false,
        designatedReporterType: DESIGNATED_REPORTER_SELF,
        settlementFee: 2,
        makerFee: 1,
        detailsText: '',
        category: 'test category',
        tags: [],
        type: BINARY,
      },
    },
    assertions: (store) => {
      const { submitNewMarket, __RewireAPI__ } = require('modules/create-market/actions/submit-new-market')

      __RewireAPI__.__Rewire__('invalidateMarketCreation', () => ({
        type: 'invalidateMarketCreation',
      }))

      const mockAugur = {
        createMarket: {
          createBinaryMarket: (createBinaryMarket) => {
            createBinaryMarket.onFailed({ message: null })
          },
        },
      }
      __RewireAPI__.__Rewire__('augur', mockAugur)

      store.dispatch(submitNewMarket(store.getState().newMarket))

      const actual = store.getActions()

      const expected = [
        {
          type: 'invalidateMarketCreation',
        },
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
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000,
        },
        expirySource: '',
        settlementFee: 2,
        designatedReporterAddress: false,
        designatedReporterType: DESIGNATED_REPORTER_SELF,
        makerFee: 1,
        detailsText: '',
        category: 'test category',
        tags: [],
        type: BINARY,
        orderBook: {},
      },
    },
    assertions: (store) => {
      const { submitNewMarket, __RewireAPI__ } = require('modules/create-market/actions/submit-new-market')

      const mockAugur = {
        createMarket: {
          createBinaryMarket: (createBinaryMarket) => {
            createBinaryMarket.onSuccess({
              callReturn: '0x11111111',
            })
          },
        },
      }
      __RewireAPI__.__Rewire__('augur', mockAugur)

      store.dispatch(submitNewMarket(store.getState().newMarket))

      const actual = store.getActions()

      const expected = []

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
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000,
        },
        expirySource: '',
        settlementFee: 2,
        makerFee: 1,
        designatedReporterAddress: false,
        designatedReporterType: DESIGNATED_REPORTER_SELF,
        detailsText: '',
        category: 'test category',
        tags: [],
        type: CATEGORICAL,
        outcomes: [
          'one',
          'two',
        ],
        orderBook: {
          one: [
            {
              type: BUY,
              price: createBigNumber('0.1'),
              quantity: createBigNumber('1'),
            },
            {
              type: SELL,
              price: createBigNumber('0.6'),
              quantity: createBigNumber('1'),
            },
            {
              type: BUY,
              price: createBigNumber('0.2'),
              quantity: createBigNumber('1'),
            },
            {
              type: SELL,
              price: createBigNumber('0.7'),
              quantity: createBigNumber('1'),
            },
            {
              type: BUY,
              price: createBigNumber('0.3'),
              quantity: createBigNumber('1'),
            },
            {
              type: SELL,
              price: createBigNumber('0.8'),
              quantity: createBigNumber('1'),
            },
          ],
          two: [
            {
              type: BUY,
              price: createBigNumber('0.1'),
              quantity: createBigNumber('1'),
            },
            {
              type: SELL,
              price: createBigNumber('0.6'),
              quantity: createBigNumber('1'),
            },
            {
              type: BUY,
              price: createBigNumber('0.2'),
              quantity: createBigNumber('1'),
            },
            {
              type: SELL,
              price: createBigNumber('0.7'),
              quantity: createBigNumber('1'),
            },
            {
              type: BUY,
              price: createBigNumber('0.3'),
              quantity: createBigNumber('1'),
            },
            {
              type: SELL,
              price: createBigNumber('0.8'),
              quantity: createBigNumber('1'),
            },
          ],
        },
      },
    },
    assertions: (store) => {
      const { submitNewMarket, __RewireAPI__ } = require('modules/create-market/actions/submit-new-market')

      // const mockUpdateTradesInProgress = sinon.stub().yields({});
      __RewireAPI__.__Rewire__('updateTradesInProgress', (callReturn, outcomeId, type, quantity, price, nogo, cb) => {
        cb({})
        return {
          type: 'updateTradesInProgress',
          outcomeId,
        }
      })

      // const mockPlaceTrade = sinon.stub().yields();
      __RewireAPI__.__Rewire__('placeTrade', (callReturn, outcomeId, tradeToExecute, nogo, cb) => {
        cb()
        return {
          type: 'placeTrade',
          outcomeId,
        }
      })

      const mockAugur = {
        createMarket: {
          createCategoricalMarket: (createCategoricalMarket) => {
            createCategoricalMarket.onSuccess({})
          },
        },
      }
      __RewireAPI__.__Rewire__('augur', mockAugur)

      store.dispatch(submitNewMarket(store.getState().newMarket))

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
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000,
        },
        expirySource: '',
        designatedReporterAddress: false,
        designatedReporterType: DESIGNATED_REPORTER_SELF,
        settlementFee: 2,
        makerFee: 1,
        detailsText: '',
        category: 'test category',
        tags: [],
        type: BINARY,
      },
    },
    assertions: (store) => {
      const { submitNewMarket, __RewireAPI__ } = require('modules/create-market/actions/submit-new-market')

      __RewireAPI__.__Rewire__('invalidateMarketCreation', () => ({
        type: 'invalidateMarketCreation',
      }))

      const mockAugur = {
        createMarket: {
          createBinaryMarket: (createBinaryMarket) => {
            createBinaryMarket.onFailed({ message: null })
          },
        },
      }
      __RewireAPI__.__Rewire__('augur', mockAugur)

      store.dispatch(submitNewMarket(store.getState().newMarket))

      const actual = store.getActions()

      const expected = [
        {
          type: 'invalidateMarketCreation',
        },
      ]

      assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
    },
  })
})
