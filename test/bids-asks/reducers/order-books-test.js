import { describe, it, beforeEach } from 'mocha'

import testState from 'test/testState'
import { UPDATE_ORDER_BOOK } from 'modules/bids-asks/actions/update-order-book'
import reducer from 'modules/bids-asks/reducers/order-books'

describe(`modules/bids-asks/reducers/order-books.js`, () => {
  let thisTestState

  beforeEach(() => {
    thisTestState = Object.assign({}, testState)
  })

  it(`Should set market order book`, () => {
    const action = {
      type: UPDATE_ORDER_BOOK,
      marketId: 'partyRockMarket',
      outcome: 2,
      orderTypeLabel: 'buy',
      orderBook: {
        '0xdbd821cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3': {
          amount: '50',
          block: 1125453,
          id: '0xdbd821cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3',
          market: 'partyRockMarket',
          outcome: '2',
          owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
          price: '0.35',
          type: 'buy',
        },
        '0x8ef900c8aad3c4f7b65a055643d54db7b9a506a542b1270047a314da931e37fb': {
          amount: '50',
          block: 1127471,
          id: '0x8ef900c8aad3c4f7b65a055643d54db7b9a506a542b1270047a314da931e37fb',
          market: 'partyRockMarket',
          outcome: '1',
          owner: '0x457435fbcd49475847f69898f933ffefc33388fc',
          price: '0.25',
          type: 'buy',
        },
      },
    }
    const expectedOutput = {
      ...thisTestState.orderBooks,
      partyRockMarket: {
        2: {
          buy: {
            '0xdbd821cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3': {
              amount: '50',
              block: 1125453,
              id: '0xdbd821cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3',
              market: 'partyRockMarket',
              outcome: '2',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              price: '0.35',
              type: 'buy',
            },
            '0x8ef900c8aad3c4f7b65a055643d54db7b9a506a542b1270047a314da931e37fb': {
              amount: '50',
              block: 1127471,
              id: '0x8ef900c8aad3c4f7b65a055643d54db7b9a506a542b1270047a314da931e37fb',
              market: 'partyRockMarket',
              outcome: '1',
              owner: '0x457435fbcd49475847f69898f933ffefc33388fc',
              price: '0.25',
              type: 'buy',
            },
          },
        },
      },
    }

    assert.deepEqual(reducer(thisTestState.orderBooks, action), expectedOutput, `Didn't properly set market order book`)
  })
})
