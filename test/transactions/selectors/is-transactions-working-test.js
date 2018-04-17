

import proxyquire from 'proxyquire'
import { PENDING, SUCCESS, FAILED, INTERRUPTED } from 'modules/transactions/constants/statuses'
import * as mockStore from 'test/mockStore'
import isTransactionsWorkingAssertions from 'assertions/is-transactions-working'

describe(`modules/transactions/selectors/is-transaction-working.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  let actual

  const { state, store } = mockStore.default
  const selector = proxyquire('../../../src/modules/transactions/selectors/is-transactions-working', {
    '../../../store': store,
  })

  it(`should check if a transaction is working`, () => {
    let { transactionsData } = state
    actual = selector.selectIsWorking({ transactionsData })

    assert.isFalse(actual, `Didn't mark the transaction as not working when status was ${FAILED}.`)

    transactionsData = {
      testtransaction12345: {
        id: 'testtransaction12345',
        status: SUCCESS,
      },
    }
    actual = selector.selectIsWorking({ transactionsData })
    assert.isFalse(actual, `Didn't mark the transaction as not working when status was ${SUCCESS}.`)

    transactionsData = {
      testtransaction12345: {
        id: 'testtransaction12345',
        status: PENDING,
      },
    }
    actual = selector.selectIsWorking({ transactionsData })
    assert.isFalse(actual, `Didn't mark the transaction as not working when status was ${PENDING}.`)

    transactionsData = {
      testtransaction12345: {
        id: 'testtransaction12345',
        status: INTERRUPTED,
      },
    }
    actual = selector.selectIsWorking({ transactionsData })
    assert.isFalse(actual, `Didn't mark the transaction as not working when status was ${INTERRUPTED}.`)

    transactionsData = {
      testtransaction12345: {
        id: 'testtransaction12345',
        status: 'test',
      },
    }
    actual = selector.selectIsWorking({ transactionsData })

    isTransactionsWorkingAssertions(actual)
    assert.isTrue(actual, `Didn't mark the transaction as working when status was test.`)
  })

})
