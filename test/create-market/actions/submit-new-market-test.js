import { describe, it } from 'mocha'
import { assert } from 'chai'
import BigNumber from 'bignumber.js'
import sinon from 'sinon'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

import { BID, ASK } from 'modules/transactions/constants/types'
import { BINARY, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'

describe('modules/create-market/actions/submit-new-market', () => {
  const mockStore = configureMockStore([thunk])
  // proxyquire.noPreserveCache().noCallThru();

  const test = t => it(t.description, () => {
    const store = mockStore(t.state || {})
    t.assertions(store)
  })

  test({
    description: `should submit well formed 'formattedNewMarket' object to 'createSingleEventMarket' for categorical market`,
    state: {
      branch: {
        id: '1010101'
      },
      loginAccount: { privateKey: 'this is a private key' },
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000
        },
        expirySource: '',
        takerFee: 2,
        makerFee: 1,
        detailsText: '',
        category: 'testing',
        tag1: 'tag1',
        tag2: 'tag2',
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
        create: { createSingleEventMarket: () => {} }
      }
      let formattedNewMarket = null
      sinon.stub(mockAugur.create, 'createSingleEventMarket', (createMarketObject) => {
        delete createMarketObject.onSent
        delete createMarketObject.onSuccess
        delete createMarketObject.onFailed

        formattedNewMarket = createMarketObject
      })

      __RewireAPI__.__Rewire__('augur', mockAugur)

      store.dispatch(submitNewMarket(store.getState().newMarket))

      const expected = {
        _signer: 'this is a private key',
        branch: '1010101',
        description: 'test description~|>one|two',
        expDate: 1234567890,
        resolution: '',
        takerFee: 0.02,
        makerFee: 0.01,
        extraInfo: '',
        tags: [
          'testing',
          'tag1',
          'tag2'
        ],
        minValue: 1,
        maxValue: 2,
        numOutcomes: 2
      }

      assert.deepEqual(formattedNewMarket, expected, `Didn't form the formattedNewMarket object as expected`)
    }
  })

  test({
    description: `should submit well formed 'formattedNewMarket' object to 'createSingleEventMarket' for binary market`,
    state: {
      branch: {
        id: '1010101'
      },
      loginAccount: { privateKey: 'this is a private key' },
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000
        },
        expirySource: '',
        takerFee: 2,
        makerFee: 1,
        detailsText: '',
        category: 'cat',
        tag1: 'tageroony1',
        tag2: 'tageroony2',
        type: BINARY
      }
    },
    assertions: (store) => {
      const { submitNewMarket, __RewireAPI__ } = require('modules/create-market/actions/submit-new-market')

      const mockAugur = {
        create: { createSingleEventMarket: () => {} }
      }
      let formattedNewMarket = null
      sinon.stub(mockAugur.create, 'createSingleEventMarket', (createMarketObject) => {
        delete createMarketObject.onSent
        delete createMarketObject.onSuccess
        delete createMarketObject.onFailed

        formattedNewMarket = createMarketObject
      })

      __RewireAPI__.__Rewire__('augur', mockAugur)

      store.dispatch(submitNewMarket(store.getState().newMarket))

      const expected = {
        _signer: 'this is a private key',
        branch: '1010101',
        description: 'test description',
        expDate: 1234567890,
        resolution: '',
        takerFee: 0.02,
        makerFee: 0.01,
        extraInfo: '',
        tags: [
          'cat',
          'tageroony1',
          'tageroony2'
        ],
        minValue: 1,
        maxValue: 2,
        numOutcomes: 2
      }

      assert.deepEqual(formattedNewMarket, expected, `Didn't form the formattedNewMarket object as expected`)
    }
  })

  test({
    description: `should submit well formed 'formattedNewMarket' object to 'createSingleEventMarket' for scalar market`,
    state: {
      branch: {
        id: '1010101'
      },
      loginAccount: { privateKey: 'this is a private key' },
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000
        },
        expirySource: '',
        takerFee: 2,
        makerFee: 1,
        detailsText: '',
        category: 'cat',
        tag1: 'tag1',
        tag2: 'tag2',
        type: SCALAR,
        scalarSmallNum: '-10', // String for the test case, normally a BigNumber
        scalarBigNum: '10' // String for the test case, normally a BigNumber
      }
    },
    assertions: (store) => {
      const { submitNewMarket, __RewireAPI__ } = require('modules/create-market/actions/submit-new-market')

      const mockAugur = {
        create: { createSingleEventMarket: () => {} }
      }
      let formattedNewMarket = null
      sinon.stub(mockAugur.create, 'createSingleEventMarket', (createMarketObject) => {
        delete createMarketObject.onSent
        delete createMarketObject.onSuccess
        delete createMarketObject.onFailed

        formattedNewMarket = createMarketObject
      })

      __RewireAPI__.__Rewire__('augur', mockAugur)

      store.dispatch(submitNewMarket(store.getState().newMarket))

      const expected = {
        _signer: 'this is a private key',
        branch: '1010101',
        description: 'test description',
        expDate: 1234567890,
        resolution: '',
        takerFee: 0.02,
        makerFee: 0.01,
        extraInfo: '',
        tags: [
          'cat',
          'tag1',
          'tag2'
        ],
        minValue: '-10',
        maxValue: '10',
        numOutcomes: 2
      }

      assert.deepEqual(formattedNewMarket, expected, `Didn't form the formattedNewMarket object as expected`)
    }
  })

  test({
    description: `should dispatch the expected action and call the expected function from the 'onSent' callback`,
    state: {
      branch: {
        id: '1010101'
      },
      loginAccount: { privateKey: 'this is a private key' },
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000
        },
        expirySource: '',
        takerFee: 2,
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
        create: {
          createSingleEventMarket: (createSingleEventMarket) => {
            createSingleEventMarket.onSent()
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
      branch: {
        id: '1010101'
      },
      loginAccount: { privateKey: 'this is a private key' },
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000
        },
        expirySource: '',
        takerFee: 2,
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
        create: {
          createSingleEventMarket: (createSingleEventMarket) => {
            createSingleEventMarket.onFailed({ message: null })
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
      branch: {
        id: '1010101'
      },
      loginAccount: { privateKey: 'this is a private key' },
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000
        },
        expirySource: '',
        takerFee: 2,
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
        create: {
          createSingleEventMarket: (createSingleEventMarket) => {
            createSingleEventMarket.onSuccess()
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
      branch: {
        id: '1010101'
      },
      loginAccount: { privateKey: 'this is a private key' },
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000
        },
        expirySource: '',
        takerFee: 2,
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
              type: BID,
              price: new BigNumber('0.1'),
              quantity: new BigNumber('1')
            },
            {
              type: ASK,
              price: new BigNumber('0.6'),
              quantity: new BigNumber('1')
            },
            {
              type: BID,
              price: new BigNumber('0.2'),
              quantity: new BigNumber('1')
            },
            {
              type: ASK,
              price: new BigNumber('0.7'),
              quantity: new BigNumber('1')
            },
            {
              type: BID,
              price: new BigNumber('0.3'),
              quantity: new BigNumber('1')
            },
            {
              type: ASK,
              price: new BigNumber('0.8'),
              quantity: new BigNumber('1')
            }
          ],
          two: [
            {
              type: BID,
              price: new BigNumber('0.1'),
              quantity: new BigNumber('1')
            },
            {
              type: ASK,
              price: new BigNumber('0.6'),
              quantity: new BigNumber('1')
            },
            {
              type: BID,
              price: new BigNumber('0.2'),
              quantity: new BigNumber('1')
            },
            {
              type: ASK,
              price: new BigNumber('0.7'),
              quantity: new BigNumber('1')
            },
            {
              type: BID,
              price: new BigNumber('0.3'),
              quantity: new BigNumber('1')
            },
            {
              type: ASK,
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
        create: {
          createSingleEventMarket: (createSingleEventMarket) => {
            createSingleEventMarket.onSuccess({})
          }
        }
      }
      __RewireAPI__.__Rewire__('augur', mockAugur)

      store.dispatch(submitNewMarket(store.getState().newMarket))

      const actual = store.getActions()

      const expected = [
        {
          outcomeID: 2,
          type: 'placeTrade'
        },
        {
          outcomeID: 2,
          type: 'updateTradesInProgress'
        },
        {
          outcomeID: 2,
          type: 'placeTrade'
        },
        {
          outcomeID: 2,
          type: 'updateTradesInProgress'
        },
        {
          outcomeID: 2,
          type: 'placeTrade'
        },
        {
          outcomeID: 2,
          type: 'updateTradesInProgress'
        },
        {
          outcomeID: 2,
          type: 'placeTrade'
        },
        {
          outcomeID: 2,
          type: 'updateTradesInProgress'
        },
        {
          outcomeID: 2,
          type: 'placeTrade'
        },
        {
          outcomeID: 2,
          type: 'updateTradesInProgress'
        },
        {
          outcomeID: 2,
          type: 'placeTrade'
        },
        {
          outcomeID: 2,
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
          outcomeID: 1,
          type: 'placeTrade'
        },
        {
          outcomeID: 1,
          type: 'updateTradesInProgress'
        }
      ]

      assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
    }
  })

  test({
    description: `should dispatch the expected actions from the 'onFailed' callback`,
    state: {
      branch: {
        id: '1010101'
      },
      loginAccount: { privateKey: 'this is a private key' },
      newMarket: {
        description: 'test description',
        endDate: {
          timestamp: 1234567890000
        },
        expirySource: '',
        takerFee: 2,
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
        create: {
          createSingleEventMarket: (createSingleEventMarket) => {
            createSingleEventMarket.onFailed({ message: null })
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
