

import { UPDATE_MARKET_CREATOR_FEES } from 'modules/my-markets/actions/update-market-creator-fees'
import reducer from 'modules/my-markets/reducers/market-creator-fees'

describe('modules/my-markets/reducers/market-creator-fees.js', () => {
  let state
  let expected

  const action = {
    type: UPDATE_MARKET_CREATOR_FEES,
    data: null,
  }

  it('should return the default parameter state', () => {
    assert.deepEqual(reducer(undefined, { type: null, data: null }), {}, `didn't return the default parameter state`)
  })

  it('should return an object with a first update', () => {
    action.data = {
      '0xtest1': 'a big num',
    }

    expected = {
      ...action.data,
    }

    assert.deepEqual(reducer(state, action), expected, `didn't return the expected initially update object`)
  })

  it('should return an object with a second update', () => {
    state = action.data

    action.data = {
      '0xtest2': 'a big num',
    }

    expected = {
      ...state,
      ...action.data,
    }

    assert.deepEqual(reducer(state, action), expected, `didn't return the expected object with a second update`)
  })

  it('should return an object with an updated value', () => {
    state = expected

    action.data = {
      '0xtest1': 'a different big num',
    }

    expected = {
      ...state,
      ...action.data,
    }

    assert.deepEqual(reducer(state, action), expected, `didn't return the expected object with an updated value`)
  })
})
