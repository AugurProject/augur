

import reducer from 'modules/trade/reducers/trades-in-progress'
import { UPDATE_TRADE_IN_PROGRESS, CLEAR_TRADE_IN_PROGRESS } from 'modules/trade/actions/update-trades-in-progress'
import { CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account'

describe(`modules/trade/reducers/trade-in-progress.js`, () => {
  const testState = {
    MarketId: {
      MarketId: 'testStateMarketId',
      OutcomeId: {
        test: 1,
      },
    },
    MarketID2: {
      MarketID2: 'testStateMarketID2',
      OutcomeId: {
        test: 2,
      },
    },
  }

  it(`should clear the login account `, () => {
    const testAction = {
      type: CLEAR_LOGIN_ACCOUNT,
    }

    const expectedState = {}

    assert.deepEqual(reducer(testState, testAction), expectedState, `reducer doesn't produce the expected state`)
  })

  it(`should be able to update a trade in progress`, () => {
    const testAction = {
      type: UPDATE_TRADE_IN_PROGRESS,
      data: {
        marketId: 'MarketId',
        outcomeId: 'OutcomeId',
        details: {
          details: 'something here',
        },
      },
    }

    const expectedState = {
      MarketId: {
        MarketId: 'testStateMarketId',
        OutcomeId: {
          details: 'something here',
        },
      },
      MarketID2: {
        MarketID2: 'testStateMarketID2',
        OutcomeId: {
          test: 2,
        },
      },
    }

    assert.deepEqual(reducer(testState, testAction), expectedState, `reducer doesn't produce the expected state`)
  })

  it(`should be able to clear a trade in progress`, () => {
    const testAction = {
      type: CLEAR_TRADE_IN_PROGRESS,
      marketId: 'MarketID2',
    }

    const expectedState = {
      MarketId: {
        MarketId: 'testStateMarketId',
        OutcomeId: {
          test: 1,
        },
      },
      MarketID2: {},
    }

    assert.deepEqual(reducer(testState, testAction), expectedState, `reducer doesn't produce the expected state`)
  })

})
