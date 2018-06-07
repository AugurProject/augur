import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

import { YES_NO, CATEGORICAL, SCALAR } from 'modules/markets/constants/market-types'
import { DESIGNATED_REPORTER_SELF, DESIGNATED_REPORTER_SPECIFIC } from 'modules/create-market/constants/new-market-constraints'

describe('modules/create-market/helpers/build-create-market', () => {
  const mockStore = configureMockStore([thunk])

  const test = t => it(t.description, () => {
    const store = mockStore(t.state || {})
    t.assertions(store)
  })
  const { buildCreateMarket, __RewireAPI__ } = require('modules/create-market/helpers/build-create-market')
  const mockAugur = {
    createMarket: {
      createCategoricalMarket: () => { },
      createYesNoMarket: () => { },
      createScalarMarket: () => { },
    },
    constants: {
      DEFAULT_MAX_GAS: 'blah',
    },
  }
  __RewireAPI__.__Rewire__('augur', mockAugur)
  test({
    description: `should build new market data for categorical market`,
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
        endTime: {
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
      const actual = buildCreateMarket(store.getState().newMarket, false, store.getState().universe, store.getState().loginAccount, store.getState().contractAddresses)

      const expected = {
        _designatedReporterAddress: '0x1233',
        universe: '1010101',
        _endTime: 1234567890000,
        _denominationToken: 'domnination',
        _description: 'test description',
        _extraInfo: {
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

      assert.deepEqual(actual.formattedNewMarket, expected, `Didn't form the formattedNewMarket object as expected`)
      assert.deepEqual(actual.createMarket, mockAugur.createMarket.createCategoricalMarket, `Didn't form the method object as expected`)
    },
  })

  test({
    description: `should market object for yes/no  market`,
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
        endTime: {
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
        type: YES_NO,
      },
    },
    assertions: (store) => {

      const actual = buildCreateMarket(store.getState().newMarket, false, store.getState().universe, store.getState().loginAccount, store.getState().contractAddresses)

      const expected = {
        _designatedReporterAddress: '0x01234abcd',
        universe: '1010101',
        _endTime: 1234567890000,
        _denominationToken: 'domnination',
        _description: 'test description',
        _extraInfo: {
          longDescription: '',
          resolutionSource: '',
          tags: [],
        },
        _topic: 'test category',
        _feePerEthInWei: '0x470de4df820000',
      }

      assert.deepEqual(actual.formattedNewMarket, expected, `Didn't form the formattedNewMarket object as expected`)
      assert.deepEqual(actual.createMarket, mockAugur.createMarket.createYesNoMarket, `Didn't form the method object as expected`)

    },
  })

  test({
    description: `should build market object for scalar market`,
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
        endTime: {
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
      const actual = buildCreateMarket(store.getState().newMarket, false, store.getState().universe, store.getState().loginAccount, store.getState().contractAddresses)

      const expected = {
        _designatedReporterAddress: '0x01234abcd',
        universe: '1010101',
        _endTime: 1234567890000,
        _denominationToken: 'domnination',
        _description: 'test description',
        _extraInfo: {
          _scalarDenomination: '%',
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

      assert.deepEqual(actual.formattedNewMarket, expected, `Didn't form the formattedNewMarket object as expected`)
      assert.deepEqual(actual.createMarket, mockAugur.createMarket.createScalarMarket, `Didn't form the method object as expected`)
    },
  })

})
