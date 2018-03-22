// import { describe, it, beforeEach, afterEach } from 'mocha'
import { describe, beforeEach, afterEach } from 'mocha'
//
import proxyquire from 'proxyquire'
import * as mockStore from 'test/mockStore'

describe(`modules/market/selectors/price-time-series.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const { store } = mockStore.default
  // const selector = proxyquire('../../../src/modules/market/selectors/price-time-series.js', {
  //   '../../../store': store
  // })
  beforeEach(() => {
    store.clearActions()
  })
  afterEach(() => {
    store.clearActions()
  })
  // it(`should select Price Time Series in correct order`, () => {
  //   const priceHistory = {
  //     2: [
  //       {
  //         price: 0.9,
  //         timestamp: 1483228799
  //       },
  //       {
  //         price: 0.5,
  //         timestamp: 1483228800
  //       }
  //     ],
  //     1: [
  //       {
  //         price: 0.2,
  //         timestamp: 1483228800
  //       },
  //       {
  //         price: 0.3,
  //         timestamp: 1483228799
  //       }
  //     ]
  //   }
  //   const outcomes = [
  //     {
  //       id: '2',
  //       name: 'outcome2'
  //     },
  //     {
  //       id: '3',
  //       name: 'outcome3'
  //     },
  //     {
  //       id: '1',
  //       name: 'outcome1'
  //     }
  //   ]
  //   const actual = selector.selectPriceTimeSeries(outcomes, priceHistory)
  //   const expected = [
  //     {
  //       id: '1',
  //       name: 'outcome1',
  //       data: [
  //         [1483228799000, 0.3],
  //         [1483228800000, 0.2]
  //       ]
  //     },
  //     {
  //       id: '2',
  //       name: 'outcome2',
  //       data: [
  //         [1483228799000, 0.9],
  //         [1483228800000, 0.5]
  //       ]
  //     },
  //     {
  //       id: '3',
  //       name: 'outcome3',
  //       data: []
  //     }
  //   ]
  //   assert.deepEqual(actual, expected, `Didn't produce the expected output`)
  // })
})
