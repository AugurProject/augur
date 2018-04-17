
import { createBigNumber } from 'utils/create-big-number'

import proxyquire from 'proxyquire'
import sinon from 'sinon'
import { SCALAR } from '../../../src/modules/markets/constants/market-types'

describe(`modules/my-positions/selectors/winning-positions.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const test = (t) => {
    it(t.description, () => {
      const Speedomatic = { bignum: () => {} }
      const SelectLoginAccountPositions = () => t.selectors.loginAccountPositions
      const selector = proxyquire('../../../src/modules/my-positions/selectors/winning-positions.js', {
        speedomatic: Speedomatic,
        './login-account-positions': SelectLoginAccountPositions,
      })
      sinon.stub(Speedomatic, 'bignum').callsFake(n => createBigNumber(n, 10))
      t.assertions(selector.selectClosedMarketsWithWinningShares(t.state))
    })
  }
  test({
    description: 'no positions',
    state: {
      outcomesData: {},
    },
    selectors: {
      loginAccountPositions: {
        markets: [],
      },
    },
    assertions: (selection) => {
      assert.deepEqual(selection, [])
    },
  })
  test({
    description: '1 position in closed market',
    state: {
      outcomesData: {
        '0xa1': {
          2: {
            sharesPurchased: '1',
          },
        },
      },
    },
    selectors: {
      loginAccountPositions: {
        markets: [{
          id: '0xa1',
          isOpen: false,
          description: 'test market 1',
          consensus: {
            outcomeId: '2',
            isIndeterminate: false,
          },
        }],
      },
    },
    assertions: (selection) => {
      assert.deepEqual(selection, [{
        id: '0xa1',
        description: 'test market 1',
        shares: '1',
      }])
    },
  })
  test({
    description: '1 position in closed indeterminate market',
    state: {
      outcomesData: {
        '0xa1': {
          1: {
            sharesPurchased: '2',
          },
          2: {
            sharesPurchased: '1',
          },
        },
      },
    },
    selectors: {
      loginAccountPositions: {
        markets: [{
          id: '0xa1',
          isOpen: false,
          description: 'test market 1',
          consensus: {
            outcomeId: '2',
            isIndeterminate: true,
          },
        }],
      },
    },
    assertions: (selection) => {
      assert.deepEqual(selection, [{
        id: '0xa1',
        description: 'test market 1',
        shares: '3',
      }])
    },
  })
  test({
    description: '1 position in closed unethical market',
    state: {
      outcomesData: {
        '0xa1': {
          1: {
            sharesPurchased: '2',
          },
          2: {
            sharesPurchased: '1',
          },
        },
      },
    },
    selectors: {
      loginAccountPositions: {
        markets: [{
          id: '0xa1',
          isOpen: false,
          description: 'test market 1',
          type: SCALAR,
          consensus: {
            outcomeId: '0.5',
            isIndeterminate: false,
          },
        }],
      },
    },
    assertions: (selection) => {
      assert.deepEqual(selection, [{
        id: '0xa1',
        description: 'test market 1',
        shares: '3',
      }])
    },
  })
  test({
    description: '1 position in closed indeterminate and unethical market',
    state: {
      outcomesData: {
        '0xa1': {
          1: {
            sharesPurchased: '2',
          },
          2: {
            sharesPurchased: '1',
          },
        },
      },
    },
    selectors: {
      loginAccountPositions: {
        markets: [{
          id: '0xa1',
          isOpen: false,
          description: 'test market 1',
          consensus: {
            outcomeId: '0.5',
            isIndeterminate: true,
          },
        }],
      },
    },
    assertions: (selection) => {
      assert.deepEqual(selection, [{
        id: '0xa1',
        description: 'test market 1',
        shares: '3',
      }])
    },
  })
  test({
    description: '1 position in closed scalar market',
    state: {
      outcomesData: {
        '0xa1': {
          1: {
            sharesPurchased: '2',
          },
          2: {
            sharesPurchased: '1',
          },
        },
      },
    },
    selectors: {
      loginAccountPositions: {
        markets: [{
          id: '0xa1',
          type: 'scalar',
          isOpen: false,
          description: 'test market 1',
          consensus: {
            outcomeId: '1.23456',
            isIndeterminate: false,
          },
        }],
      },
    },
    assertions: (selection) => {
      assert.deepEqual(selection, [{
        id: '0xa1',
        description: 'test market 1',
        shares: '3',
      }])
    },
  })
  test({
    description: '1 position in closed scalar indeterminate market',
    state: {
      outcomesData: {
        '0xa1': {
          1: {
            sharesPurchased: '2',
          },
          2: {
            sharesPurchased: '1',
          },
        },
      },
    },
    selectors: {
      loginAccountPositions: {
        markets: [{
          id: '0xa1',
          type: 'scalar',
          isOpen: false,
          description: 'test market 1',
          consensus: {
            outcomeId: '1.23456',
            isIndeterminate: true,
          },
        }],
      },
    },
    assertions: (selection) => {
      assert.deepEqual(selection, [{
        id: '0xa1',
        description: 'test market 1',
        shares: '3',
      }])
    },
  })
  test({
    description: '1 position in closed scalar unethical market',
    state: {
      outcomesData: {
        '0xa1': {
          1: {
            sharesPurchased: '2',
          },
          2: {
            sharesPurchased: '1',
          },
        },
      },
    },
    selectors: {
      loginAccountPositions: {
        markets: [{
          id: '0xa1',
          type: 'scalar',
          isOpen: false,
          description: 'test market 1',
          consensus: {
            outcomeId: '1.23456',
            isIndeterminate: false,
          },
        }],
      },
    },
    assertions: (selection) => {
      assert.deepEqual(selection, [{
        id: '0xa1',
        description: 'test market 1',
        shares: '3',
      }])
    },
  })
  test({
    description: '1 position in open market',
    state: {
      outcomesData: {},
    },
    selectors: {
      loginAccountPositions: {
        markets: [{
          id: '0xa1',
          isOpen: true,
          consensus: null,
        }],
      },
    },
    assertions: (selection) => {
      assert.deepEqual(selection, [])
    },
  })
  test({
    description: '1 position in open market, 1 position in closed market',
    state: {
      outcomesData: {
        '0xa1': {
          2: {
            sharesPurchased: '1',
          },
        },
        '0xa2': {
          2: {
            sharesPurchased: '1',
          },
        },
      },
    },
    selectors: {
      loginAccountPositions: {
        markets: [{
          id: '0xa1',
          isOpen: true,
          consensus: null,
        }, {
          id: '0xa2',
          isOpen: false,
          description: 'test market 2',
          consensus: {
            outcomeId: '2',
            isIndeterminate: false,
          },
        }],
      },
    },
    assertions: (selection) => {
      assert.deepEqual(selection, [{
        id: '0xa2',
        description: 'test market 2',
        shares: '1',
      }])
    },
  })
  test({
    description: '1 position in open market, 2 positions in closed markets',
    state: {
      outcomesData: {
        '0xa1': {
          2: {
            sharesPurchased: '1',
          },
        },
        '0xa2': {
          2: {
            sharesPurchased: '1',
          },
        },
        '0xa3': {
          2: {
            sharesPurchased: '1',
          },
        },
      },
    },
    selectors: {
      loginAccountPositions: {
        markets: [{
          id: '0xa1',
          isOpen: true,
          consensus: null,
        }, {
          id: '0xa2',
          isOpen: false,
          description: 'test market 2',
          consensus: {
            outcomeId: '2',
            isIndeterminate: false,
          },
        }, {
          id: '0xa3',
          isOpen: false,
          description: 'test market 3',
          consensus: {
            outcomeId: '2',
            isIndeterminate: false,
          },
        }],
      },
    },
    assertions: (selection) => {
      assert.deepEqual(selection, [{
        id: '0xa2',
        description: 'test market 2',
        shares: '1',
      }, {
        id: '0xa3',
        description: 'test market 3',
        shares: '1',
      }])
    },
  })
  test({
    description: '2 position in open markets, 1 position in closed market',
    state: {
      outcomesData: {
        '0xa1': {
          2: {
            sharesPurchased: '1',
          },
        },
        '0xa2': {
          2: {
            sharesPurchased: '1',
          },
        },
        '0xa3': {
          2: {
            sharesPurchased: '1',
          },
        },
      },
    },
    selectors: {
      loginAccountPositions: {
        markets: [{
          id: '0xa1',
          isOpen: true,
          consensus: null,
        }, {
          id: '0xa2',
          isOpen: true,
          consensus: null,
        }, {
          id: '0xa3',
          isOpen: false,
          description: 'test market 3',
          consensus: {
            outcomeId: '2',
            isIndeterminate: false,
          },
        }],
      },
    },
    assertions: (selection) => {
      assert.deepEqual(selection, [{
        id: '0xa3',
        description: 'test market 3',
        shares: '1',
      }])
    },
  })
})
