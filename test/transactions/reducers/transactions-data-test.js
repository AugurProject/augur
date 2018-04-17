

import testState from 'test/testState'
import reducer from 'modules/transactions/reducers/transactions-data'

describe(`modules/transactions/reducers/transactions-data.js`, () => {
  let action
  let out
  let test

  const state = Object.assign({}, testState)

  it(`should update transactions data in state`, () => {
    action = {
      type: 'UPDATE_TRANSACTIONS_DATA',
      transactionsData: {
        test: {
          example: 'example',
        },
        example: {
          test: 'test',
        },
      },
    }
    out = {
      ...state.transactionsData,
      test: {
        example: 'example',
        id: 'test',
      },
      example: {
        test: 'test',
        id: 'example',
      },
    }
    test = reducer(state.transactionsData, action)
    assert.deepEqual(test, out, `Didn't update transactionData as expected`)

  })

  it(`should delete transaction`, () => {
    action = {
      type: 'DELETE_TRANSACTION',
      transactionId: 'transaction2',
    }
    state.transactionsData = {
      transaction1: {
        data: 'data1',
        id: 'transaction1',
      },
      transaction2: {
        data: 'data2',
        id: 'transaction2',
      },
    }
    test = reducer(state.transactionsData, action)
    assert.deepEqual(test, {
      transaction1: {
        data: 'data1',
        id: 'transaction1',
      },
    }, `Failed to delete transaction as expected`)
  })

  it(`should clear transactions on clear login account`, () => {
    action = {
      type: 'CLEAR_LOGIN_ACCOUNT',
    }
    out = {}
    test = reducer(state.transactionsData, action)
    assert.deepEqual(test, out, `Didn't clear transactionsData when clearing the login account`)
  })

})
