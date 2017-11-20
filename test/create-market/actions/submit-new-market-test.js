import { describe, it } from 'mocha'
import { assert } from 'chai'
import BigNumber from 'bignumber.js'
import sinon from 'sinon'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

import { BUY, SELL } from 'modules/transactions/constants/types'
import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'

describe('modules/create-market/actions/submit-new-market', () => {
  const mockStore = configureMockStore([thunk])

  const test = t => it(t.description, () => {
    const store = mockStore(t.state || {})
    t.assertions(store)
  })

  test({
    description: `should submit well formed 'formattedNewMarket' object to 'createCategoricalMarket' for categorical market`,
    state: {
      universe: {
        id: '1010101'
      },
      contractAddresses: {
        Cash: 'domnination'
      },
      loginAccount: {
        meta: {
          test: 'object'
        },
        address: '0x1233'
      },
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000
        },
        expirySource: '',
        settlementFee: 2,
        makerFee: 1,
        detailsText: '',
        category: 'test topic',
        keywords: [],
        type: CATEGORICAL,
        outcomes: [
          'one',
          'two'
        ]
      }
    },
    assertions: (store) => {
      const { submitNewMarket, __RewireAPI__ } = require('modules/create-market/actions/submit-new-market')

      const mockAugur = {
        createMarket: { createCategoricalMarket: () => { } }
      }
      let formattedNewMarket = null
      sinon.stub(mockAugur.createMarket, 'createCategoricalMarket', (createMarketObject) => {
        delete createMarketObject.onSent
        delete createMarketObject.onSuccess
        delete createMarketObject.onFailed

        formattedNewMarket = createMarketObject
      })

      __RewireAPI__.__Rewire__('augur', mockAugur)

      store.dispatch(submitNewMarket(store.getState().newMarket))

      const expected = {
        meta: {
          test: 'object'
        },
        _designatedReporterAddress: '0x1233',
        universe: '1010101',
        _endTime: 1234567890,
        _denominationToken: 'domnination',
        _extraInfo: {
          marketType: 'categorical',
          description: 'test description',
          longDescription: '',
          outcomeNames: [
            'one',
            'two'
          ],
          resolutionSource: '',
          tags: []
        },
        _numOutcomes: 2,
        _topic: 'test topic',
        _feePerEthInWei: '0x470de4df820000',
      }

      assert.deepEqual(formattedNewMarket, expected, `Didn't form the formattedNewMarket object as expected`)
    }
  })

  test({
    description: `should submit well formed 'formattedNewMarket' object to 'createBinaryMarket' for binary market`,
    state: {
      universe: {
        id: '1010101'
      },
      contractAddresses: {
        Cash: 'domnination'
      },
      loginAccount: {
        meta: {
          test: 'object'
        },
        address: '0x1233'
      },
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000
        },
        expirySource: '',
        settlementFee: 2,
        makerFee: 1,
        detailsText: '',
        category: 'test topic',
        keywords: [],
        type: BINARY
      }
    },
    assertions: (store) => {
      const { submitNewMarket, __RewireAPI__ } = require('modules/create-market/actions/submit-new-market')

      const mockAugur = {
        createMarket: { createBinaryMarket: () => { } }
      }
      let formattedNewMarket = null
      sinon.stub(mockAugur.createMarket, 'createBinaryMarket', (createMarketObject) => {
        delete createMarketObject.onSent
        delete createMarketObject.onSuccess
        delete createMarketObject.onFailed

        formattedNewMarket = createMarketObject
      })

      __RewireAPI__.__Rewire__('augur', mockAugur)

      store.dispatch(submitNewMarket(store.getState().newMarket))

      const expected = {
        _designatedReporterAddress: '0x1233',
        meta: {
          test: 'object'
        },
        universe: '1010101',
        _endTime: 1234567890,
        _denominationToken: 'domnination',
        _extraInfo: {
          marketType: 'binary',
          description: 'test description',
          longDescription: '',
          resolutionSource: '',
          tags: []
        },
        _topic: 'test topic',
        _feePerEthInWei: '0x470de4df820000'
      }

      assert.deepEqual(formattedNewMarket, expected, `Didn't form the formattedNewMarket object as expected`)
    }
  })

  test({
    description: `should submit well formed 'formattedNewMarket' object to 'createScalarMarket' for scalar market`,
    state: {
      universe: {
        id: '1010101'
      },
      contractAddresses: {
        Cash: 'domnination'
      },
      loginAccount: {
        meta: {
          test: 'object'
        },
        address: '0x1233'
      },
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000
        },
        expirySource: '',
        settlementFee: 2,
        makerFee: 1,
        detailsText: '',
        category: 'test topic',
        keywords: [],
        type: SCALAR,
        scalarSmallNum: '-10', // String for the test case, normally a BigNumber
        scalarBigNum: '10', // String for the test case, normally a BigNumber
        scalarDenomination: '%'
      }
    },
    assertions: (store) => {
      const { submitNewMarket, __RewireAPI__ } = require('modules/create-market/actions/submit-new-market')

      const mockAugur = {
        createMarket: { createScalarMarket: () => { } }
      }
      let formattedNewMarket = null
      sinon.stub(mockAugur.createMarket, 'createScalarMarket', (createMarketObject) => {
        delete createMarketObject.onSent
        delete createMarketObject.onSuccess
        delete createMarketObject.onFailed

        formattedNewMarket = createMarketObject
      })

      __RewireAPI__.__Rewire__('augur', mockAugur)

      store.dispatch(submitNewMarket(store.getState().newMarket))

      const expected = {
        meta: {
          test: 'object'
        },
        _designatedReporterAddress: '0x1233',
        universe: '1010101',
        _endTime: 1234567890,
        _denominationToken: 'domnination',
        _extraInfo: {
          _scalarDenomination: '%',
          marketType: 'scalar',
          description: 'test description',
          longDescription: '',
          resolutionSource: '',
          tags: []
        },
        maxPrice: '10',
        minPrice: '-10',
        _topic: 'test topic',
        _feePerEthInWei: '0x470de4df820000'
      }

      assert.deepEqual(formattedNewMarket, expected, `Didn't form the formattedNewMarket object as expected`)
    }
  })

  test({
    description: `should dispatch the expected action and call the expected function from the 'onSent' callback`,
    state: {
      universe: {
        id: '1010101'
      },
      contractAddresses: {
        Cash: 'domnination'
      },
      loginAccount: {
        meta: {
          test: 'object'
        },
        address: '0x1233'
      },
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000
        },
        expirySource: '',
        settlementFee: 2,
        makerFee: 1,
        detailsText: '',
        topic: 'test topic',
        keywords: [],
        type: BINARY
      }
    },
    assertions: (store) => {
      const { submitNewMarket, __RewireAPI__ } = require('modules/create-market/actions/submit-new-market')

      const push = sinon.stub()
      const history = {
        push
      }
      __RewireAPI__.__Rewire__('clearNewMarket', () => ({
        type: 'createNewMarket'
      }))

      const mockAugur = {
        createMarket: {
          createBinaryMarket: (createBinaryMarket) => {
            createBinaryMarket.onSent()
          }
        }
      }
      __RewireAPI__.__Rewire__('augur', mockAugur)

      store.dispatch(submitNewMarket(store.getState().newMarket, history))

      assert.isTrue(push.calledOnce, `didn't push a new path to history`)

      const actual = store.getActions()

      const expected = [
        {
          type: 'createNewMarket'
        }
      ]

      assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
    }
  })

  test({
    description: `should dispatch the expected actions from the 'onFailed' callback`,
    state: {
      universe: {
        id: '1010101'
      },
      contractAddresses: {
        Cash: 'domnination'
      },
      loginAccount: {
        meta: {
          test: 'object'
        },
        address: '0x1233'
      },
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000
        },
        expirySource: '',
        settlementFee: 2,
        makerFee: 1,
        detailsText: '',
        topic: 'test topic',
        keywords: [],
        type: BINARY
      }
    },
    assertions: (store) => {
      const { submitNewMarket, __RewireAPI__ } = require('modules/create-market/actions/submit-new-market')

      __RewireAPI__.__Rewire__('invalidateMarketCreation', () => ({
        type: 'invalidateMarketCreation'
      }))

      const mockAugur = {
        createMarket: {
          createBinaryMarket: (createBinaryMarket) => {
            createBinaryMarket.onFailed({ message: null })
          }
        }
      }
      __RewireAPI__.__Rewire__('augur', mockAugur)

      store.dispatch(submitNewMarket(store.getState().newMarket))

      const actual = store.getActions()

      const expected = [
        {
          type: 'invalidateMarketCreation'
        }
      ]

      assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
    }
  })

  test({
    description: `should dispatch the expected actions from the 'onSuccess' callback when an orderbook IS NOT present`,
    state: {
      universe: {
        id: '1010101'
      },
      contractAddresses: {
        Cash: 'domnination'
      },
      loginAccount: {
        meta: {
          test: 'object'
        },
        address: '0x1233'
      },
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000
        },
        expirySource: '',
        settlementFee: 2,
        makerFee: 1,
        detailsText: '',
        topic: 'test topic',
        keywords: [],
        type: BINARY,
        orderBook: {}
      }
    },
    assertions: (store) => {
      const { submitNewMarket, __RewireAPI__ } = require('modules/create-market/actions/submit-new-market')

      const mockAugur = {
        createMarket: {
          createBinaryMarket: (createBinaryMarket) => {
            createBinaryMarket.onSuccess({
              callReturn: '0x11111111'
            })
          }
        }
      }
      __RewireAPI__.__Rewire__('augur', mockAugur)

      store.dispatch(submitNewMarket(store.getState().newMarket))

      const actual = store.getActions()

      const expected = []

      assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
    }
  })

  test({
    description: `should dispatch the expected actions from the 'onSuccess' callback when an orderbook IS present`,
    state: {
      universe: {
        id: '1010101'
      },
      contractAddresses: {
        Cash: 'domnination'
      },
      loginAccount: {
        meta: {
          test: 'object'
        },
        address: '0x1233'
      },
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000
        },
        expirySource: '',
        settlementFee: 2,
        makerFee: 1,
        detailsText: '',
        topic: 'test topic',
        keywords: [],
        type: CATEGORICAL,
        outcomes: [
          'one',
          'two'
        ],
        orderBook: {
          one: [
            {
              type: BUY,
              price: new BigNumber('0.1'),
              quantity: new BigNumber('1')
            },
            {
              type: SELL,
              price: new BigNumber('0.6'),
              quantity: new BigNumber('1')
            },
            {
              type: BUY,
              price: new BigNumber('0.2'),
              quantity: new BigNumber('1')
            },
            {
              type: SELL,
              price: new BigNumber('0.7'),
              quantity: new BigNumber('1')
            },
            {
              type: BUY,
              price: new BigNumber('0.3'),
              quantity: new BigNumber('1')
            },
            {
              type: SELL,
              price: new BigNumber('0.8'),
              quantity: new BigNumber('1')
            }
          ],
          two: [
            {
              type: BUY,
              price: new BigNumber('0.1'),
              quantity: new BigNumber('1')
            },
            {
              type: SELL,
              price: new BigNumber('0.6'),
              quantity: new BigNumber('1')
            },
            {
              type: BUY,
              price: new BigNumber('0.2'),
              quantity: new BigNumber('1')
            },
            {
              type: SELL,
              price: new BigNumber('0.7'),
              quantity: new BigNumber('1')
            },
            {
              type: BUY,
              price: new BigNumber('0.3'),
              quantity: new BigNumber('1')
            },
            {
              type: SELL,
              price: new BigNumber('0.8'),
              quantity: new BigNumber('1')
            }
          ]
        }
      }
    },
    assertions: (store) => {
      const { submitNewMarket, __RewireAPI__ } = require('modules/create-market/actions/submit-new-market')

      // const mockUpdateTradesInProgress = sinon.stub().yields({});
      __RewireAPI__.__Rewire__('updateTradesInProgress', (callReturn, outcomeID, type, quantity, price, nogo, cb) => {
        cb({})
        return {
          type: 'updateTradesInProgress',
          outcomeID
        }
      })

      // const mockPlaceTrade = sinon.stub().yields();
      __RewireAPI__.__Rewire__('placeTrade', (callReturn, outcomeID, tradeToExecute, nogo, cb) => {
        cb()
        return {
          type: 'placeTrade',
          outcomeID
        }
      })

      const mockAugur = {
        createMarket: {
          createCategoricalMarket: (createCategoricalMarket) => {
            createCategoricalMarket.onSuccess({})
          }
        }
      }
      __RewireAPI__.__Rewire__('augur', mockAugur)

      store.dispatch(submitNewMarket(store.getState().newMarket))

      const actual = store.getActions()

      const expected = [
        {
          outcomeID: 1,
          type: 'placeTrade'
        },
        {
          outcomeID: 1,
          type: 'updateTradesInProgress'
        },
        {
          outcomeID: 1,
          type: 'placeTrade'
        },
        {
          outcomeID: 1,
          type: 'updateTradesInProgress'
        },
        {
          outcomeID: 1,
          type: 'placeTrade'
        },
        {
          outcomeID: 1,
          type: 'updateTradesInProgress'
        },
        {
          outcomeID: 1,
          type: 'placeTrade'
        },
        {
          outcomeID: 1,
          type: 'updateTradesInProgress'
        },
        {
          outcomeID: 1,
          type: 'placeTrade'
        },
        {
          outcomeID: 1,
          type: 'updateTradesInProgress'
        },
        {
          outcomeID: 1,
          type: 'placeTrade'
        },
        {
          outcomeID: 1,
          type: 'updateTradesInProgress'
        },
        {
          outcomeID: 0,
          type: 'placeTrade'
        },
        {
          outcomeID: 0,
          type: 'updateTradesInProgress'
        },
        {
          outcomeID: 0,
          type: 'placeTrade'
        },
        {
          outcomeID: 0,
          type: 'updateTradesInProgress'
        },
        {
          outcomeID: 0,
          type: 'placeTrade'
        },
        {
          outcomeID: 0,
          type: 'updateTradesInProgress'
        },
        {
          outcomeID: 0,
          type: 'placeTrade'
        },
        {
          outcomeID: 0,
          type: 'updateTradesInProgress'
        },
        {
          outcomeID: 0,
          type: 'placeTrade'
        },
        {
          outcomeID: 0,
          type: 'updateTradesInProgress'
        },
        {
          outcomeID: 0,
          type: 'placeTrade'
        },
        {
          outcomeID: 0,
          type: 'updateTradesInProgress'
        }
      ]

      assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
    }
  })

  test({
    description: `should dispatch the expected actions from the 'onFailed' callback`,
    state: {
      universe: {
        id: '1010101'
      },
      contractAddresses: {
        Cash: 'domnination'
      },
      loginAccount: {
        meta: {
          test: 'object'
        },
        address: '0x1233'
      },
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000
        },
        expirySource: '',
        settlementFee: 2,
        makerFee: 1,
        detailsText: '',
        topic: 'test topic',
        keywords: [],
        type: BINARY
      }
    },
    assertions: (store) => {
      const { submitNewMarket, __RewireAPI__ } = require('modules/create-market/actions/submit-new-market')

      __RewireAPI__.__Rewire__('invalidateMarketCreation', () => ({
        type: 'invalidateMarketCreation'
      }))

      const mockAugur = {
        createMarket: {
          createBinaryMarket: (createBinaryMarket) => {
            createBinaryMarket.onFailed({ message: null })
          }
        }
      }
      __RewireAPI__.__Rewire__('augur', mockAugur)

      store.dispatch(submitNewMarket(store.getState().newMarket))

      const actual = store.getActions()

      const expected = [
        {
          type: 'invalidateMarketCreation'
        }
      ]

      assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
    }
  })
})
