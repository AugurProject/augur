import { describe, it } from 'mocha'
import chai, { assert } from 'chai'
import chaiSubset from 'chai-subset'
import sinon from 'sinon'
import proxyquire from 'proxyquire'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

import BigNumber from 'bignumber.js'
import { strip0xPrefix } from 'speedomatic'

import * as TYPES from 'modules/transactions/constants/types'

import { formatEther, formatEtherTokens, formatPercent, formatRep, formatShares } from 'utils/format-number'
import { formatDate } from 'utils/format-date'

import {
  constructBasicTransaction,
  constructDefaultTransaction,
  constructCollectedFeesTransaction,
  constructApprovalTransaction,
  constructTransferTransaction,
} from 'modules/transactions/actions/construct-transaction'

import { BINARY } from 'modules/markets/constants/market-types'

chai.use(chaiSubset)

describe('modules/transactions/actions/construct-transaction.js', () => {
  proxyquire.noPreserveCache()

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  const MOCK_ACTION_TYPES = {
    LOAD_MARKET_THEN_RETRY_CONVERSION: 'LOAD_MARKET_THEN_RETRY_CONVERSION',
    UPDATE_MARKETS_WITH_ACCOUNT_REPORT_DATA: 'UPDATE_MARKETS_WITH_ACCOUNT_REPORT_DATA',
    CONSTRUCT_FILL_ORDER_TRANSACTION: 'CONSTRUCT_FILL_ORDER_TRANSACTION',
    CONSTRUCT_CREATE_ORDER_TRANSACTION: 'CONSTRUCT_CREATE_ORDER_TRANSACTION',
    CONSTRUCT_CANCEL_ORDER_TRANSACTION: 'CONSTRUCT_CANCEL_ORDER_TRANSACTION',
    CONSTRUCT_PAYOUT_TRANSACTION: 'CONSTRUCT_PAYOUT_TRANSACTION',
    CONSTRUCT_MARKET_TRANSACTION: 'CONSTRUCT_MARKET_TRANSACTION',
    CONSTRUCT_REPORTING_TRANSACTION: 'CONSTRUCT_REPORTING_TRANSACTION',
  }

  const mockRetryConversion = {
    loadMarketThenRetryConversion: sinon.stub().returns({
      type: MOCK_ACTION_TYPES.LOAD_MARKET_THEN_RETRY_CONVERSION,
    }),
  }

  describe('loadDataForMarketTransaction', () => {
    const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
      './retry-conversion': mockRetryConversion,
    })

    const test = (t) => {
      it(t.description, () => {
        const store = mockStore(t.state || {})

        t.assertions(store)
      })
    }

    test({
      description: `should return expected actions with no loaded markets`,
      state: {
        marketsData: {},
      },
      assertions: (store) => {
        const label = 'label'
        const log = {
          market: '0xMARKETID',
        }
        const isRetry = false
        const callback = () => {}

        store.dispatch(action.loadDataForMarketTransaction(label, log, isRetry, callback))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.LOAD_MARKET_THEN_RETRY_CONVERSION,
          },
        ]

        assert.deepEqual(actual, expected, `Didn't return the expected actions`)
      },
    })

    test({
      description: `should return expected actions with no loaded markets AND isRetry`,
      state: {
        marketsData: {},
      },
      assertions: (store) => {
        const label = 'label'
        const log = {
          market: '0xMARKETID',
        }
        const isRetry = true
        const callback = sinon.spy()

        store.dispatch(action.loadDataForMarketTransaction(label, log, isRetry, callback))

        assert.isTrue(callback.calledOnce, `Didn't call callback once as expected`)
      },
    })

    test({
      description: `should return expected actions with loaded markets`,
      state: {
        marketsData: {
          '0xMARKETID': {
            description: 'market is loaded',
          },
        },
      },
      assertions: (store) => {
        const label = 'label'
        const log = {
          market: '0xMARKETID',
        }
        const isRetry = false
        const callback = () => ({
          type: MOCK_ACTION_TYPES.CALLBACK,
        })

        const actual = store.dispatch(action.loadDataForMarketTransaction(label, log, isRetry, callback))

        const expected = {
          description: 'market is loaded',
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })
  })

  describe('loadDataForReportingTransaction', () => {
    const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
      './retry-conversion': mockRetryConversion,
    })

    const test = (t) => {
      it(t.description, () => {
        const store = mockStore(t.state || {})

        t.assertions(store)
      })
    }

    test({
      description: `should dispatch the expected actions with no markets loaded and no eventMarketMap`,
      state: {
        marketsData: {},
        outcomesData: {},
      },
      assertions: (store) => {
        const label = 'label'
        const log = {
          market: '0xMARKETID',
          // Lack of event market map is mocked by excluding the event
        }
        const isRetry = false
        const callback = () => {}

        store.dispatch(action.loadDataForReportingTransaction(label, log, isRetry, callback))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.LOAD_MARKET_THEN_RETRY_CONVERSION,
          },
        ]

        assert.deepEqual(actual, expected, `Didn't return the expected actions`)
      },
    })

    test({
      description: `should dispatch the expected actions with no markets loaded and no eventMarketMap and isRetry`,
      state: {
        marketsData: {},
        outcomesData: {},
      },
      assertions: (store) => {
        const label = 'label'
        const log = {
          market: '0xMARKETID',
          // Lack of event market map is mocked by excluding the event
        }
        const isRetry = true
        const callback = sinon.stub()

        store.dispatch(action.loadDataForReportingTransaction(label, log, isRetry, callback))

        assert.isTrue(callback.calledOnce, `Didn't call callback once as expected`)
      },
    })

    test({
      description: `should dispatch the expected actions with no markets loaded and with an eventMarketMap`,
      state: {
        marketsData: {},
        outcomesData: {},
      },
      assertions: (store) => {
        const label = 'label'
        const log = {
          market: '0xMARKETID',
        }
        const isRetry = false
        const callback = () => {}

        store.dispatch(action.loadDataForReportingTransaction(label, log, isRetry, callback))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.LOAD_MARKET_THEN_RETRY_CONVERSION,
          },
        ]

        assert.deepEqual(actual, expected, `Didn't return the expected actions`)
      },
    })

    test({
      description: `should dispatch the expected actions with no markets loaded and with an eventMarketMap and isRetry`,
      state: {
        marketsData: {},
        outcomesData: {},
      },
      assertions: (store) => {
        const label = 'label'
        const log = {
          market: '0xMARKETID',
        }
        const isRetry = true
        const callback = sinon.stub()

        store.dispatch(action.loadDataForReportingTransaction(label, log, isRetry, callback))

        assert.isTrue(callback.calledOnce, `Didn't call callback once as expected`)
      },
    })

    test({
      description: `should return the expected object with markets loaded and with an eventMarketMap`,
      state: {
        marketsData: {
          '0xMARKETID': {
            description: 'testing',
          },
        },
        outcomesData: {
          '0xMARKETID': {},
        },
      },
      assertions: (store) => {
        const label = 'label'
        const log = {
          market: '0xMARKETID',
        }
        const isRetry = false
        const callback = sinon.stub()

        const result = store.dispatch(action.loadDataForReportingTransaction(label, log, isRetry, callback))

        const expected = {
          marketId: '0xMARKETID',
          market: {
            description: 'testing',
          },
          outcomes: {},
        }

        assert.deepEqual(result, expected, `Didn't return the expected actions`)
      },
    })
  })

  describe('constructBasicTransaction', () => {
    const test = t => it(t.description, () => {
      const store = mockStore()
      t.assertions(store)
    })

    test({
      description: 'should return the expected object with no arguments passed',
      assertions: (store) => {
        const actual = store.dispatch(constructBasicTransaction())

        const expected = {
          hash: undefined,
          status: undefined,
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })

    test({
      description: 'should return the expected object with just hash and status passed',
      assertions: (store) => {
        const hash = '0xHASH'
        const status = 'status'

        const actual = store.dispatch(constructBasicTransaction(hash, status))

        const expected = {
          hash,
          status,
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })

    test({
      description: 'should return the expected object with all arguments passed',
      assertions: (store) => {
        const hash = '0xHASH'
        const status = 'status'
        const blockNumber = 123456
        const timestamp = 1491843278
        const gasFees = 0.001


        const actual = store.dispatch(constructBasicTransaction(hash, status, blockNumber, timestamp, gasFees))

        const expected = {
          hash,
          status,
          blockNumber,
          timestamp: formatDate(new Date(timestamp * 1000)),
          gasFees: formatEther(gasFees),
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })
  })

  describe('constructDefaultTransaction', () => {
    const test = t => it(t.description, () => t.assertions())

    test({
      description: 'should return the expected object',
      assertions: () => {
        const label = 'transaction'
        const log = {
          message: 'log message',
          description: 'log description',
        }

        const actual = constructDefaultTransaction(label, log)

        const expected = {
          data: {},
          type: label,
          message: 'log message',
          description: 'log description',
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })
  })

  describe('constructApprovalTransaction', () => {
    const test = t => it(t.description, () => t.assertions())

    test({
      description: 'should return the expected object with inProgress false',
      assertions: () => {
        const log = {
          _sender: '0xSENDER',
          inProgress: false,
        }

        const actual = constructApprovalTransaction(log)

        const expected = {
          data: {},
          type: 'Approved to Send Tokens',
          description: `Approve ${log._spender} to send tokens`,
          message: 'approved',
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })

    test({
      description: 'should return the expected object with inProgress true',
      assertions: () => {
        const log = {
          _sender: '0xSENDER',
          inProgress: true,
        }

        const actual = constructApprovalTransaction(log)

        const expected = {
          data: {},
          type: 'Approved to Send Tokens',
          description: `Approve ${log._spender} to send tokens`,
          message: 'approving',
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })
  })

  describe('constructCollectedFeesTransaction', () => {
    const test = t => it(t.description, () => t.assertions())

    test({
      description: `should return the expected object with initialRepBalance undefined and no totalReportingRep and no cashFeesCollected and inProgress false`,
      assertions: () => {
        const log = {
          repGain: '1',
          inProgress: false,
          newRepBalance: '1',
          period: 1234,
          notReportingBond: '1',
        }

        const actual = constructCollectedFeesTransaction(log)

        const repGain = new BigNumber(log.repGain)
        const initialRepBalance = new BigNumber(log.newRepBalance).minus(repGain).toFixed()

        const expected = {
          data: {},
          type: 'Reporting Payment',
          description: `Reporting cycle #${log.period}`,
          bond: {
            label: 'reporting',
            value: formatEther(log.notReportingBond),
          },
          message: `reported with ${formatRep(initialRepBalance).full}`,
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })

    test({
      description: `should return the expected object with initialRepBalance and no totalReportingRep and no cashFeesCollected and inProgress false`,
      assertions: () => {
        const log = {
          repGain: '1',
          inProgress: false,
          newRepBalance: '1',
          period: 1234,
          notReportingBond: '1',
          initialRepBalance: '1',
        }

        const actual = constructCollectedFeesTransaction(log)

        const expected = {
          data: {},
          type: 'Reporting Payment',
          description: `Reporting cycle #${log.period}`,
          bond: {
            label: 'reporting',
            value: formatEther(log.notReportingBond),
          },
          message: `reported with ${formatRep(log.initialRepBalance).full}`,
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })

    test({
      description: `should return the expected object with initialRepBalance and totalReportingRep equals zero and no cashFeesCollected and inProgress false`,
      assertions: () => {
        const log = {
          repGain: '1',
          inProgress: false,
          newRepBalance: '1',
          period: 1234,
          notReportingBond: '1',
          initialRepBalance: '1',
          totalReportingRep: '0',
        }

        const actual = constructCollectedFeesTransaction(log)

        const expected = {
          data: {},
          type: 'Reporting Payment',
          description: `Reporting cycle #${log.period}`,
          bond: {
            label: 'reporting',
            value: formatEther(log.notReportingBond),
          },
          message: `reported with ${formatRep(log.initialRepBalance).full}`,
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })

    test({
      description: `should return the expected object with initialRepBalance and totalReportingRep and no cashFeesCollected and inProgress false`,
      assertions: () => {
        const log = {
          repGain: '1',
          inProgress: false,
          newRepBalance: '1',
          period: 1234,
          notReportingBond: '1',
          initialRepBalance: '1',
          totalReportingRep: '100',
        }

        const actual = constructCollectedFeesTransaction(log)

        const totalReportingRep = new BigNumber(log.totalReportingRep)
        const percentRep = formatPercent(new BigNumber(log.initialRepBalance).dividedBy(totalReportingRep).times(100), { decimals: 0 })

        const expected = {
          data: {},
          type: 'Reporting Payment',
          description: `Reporting cycle #${log.period}`,
          bond: {
            label: 'reporting',
            value: formatEther(log.notReportingBond),
          },
          message: `reported with ${formatRep(log.initialRepBalance).full} (${percentRep.full})`,
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })

    test({
      description: `should return the expected object with initialRepBalance and totalReportingRep and cashFeesCollected and inProgress false`,
      assertions: () => {
        const log = {
          repGain: '1',
          inProgress: false,
          period: 1234,
          notReportingBond: '1',
          initialRepBalance: '1',
          newRepBalance: '1',
          totalReportingRep: '100',
          cashFeesCollected: '100',
          newCashBalance: '101',
        }

        const actual = constructCollectedFeesTransaction(log)

        const repGain = new BigNumber(log.repGain)

        const totalReportingRep = new BigNumber(log.totalReportingRep)
        const percentRep = formatPercent(new BigNumber(log.initialRepBalance).dividedBy(totalReportingRep).times(100), { decimals: 0 })

        const expected = {
          data: {
            balances: [
              {
                change: formatEtherTokens(log.cashFeesCollected, { positiveSign: true }),
                balance: formatEtherTokens(log.newCashBalance),
              },
              {
                change: formatRep(repGain, { positiveSign: true }),
                balance: formatRep(log.newRepBalance),
              },
            ],
          },
          type: 'Reporting Payment',
          description: `Reporting cycle #${log.period}`,
          bond: {
            label: 'reporting',
            value: formatEther(log.notReportingBond),
          },
          message: `reported with ${formatRep(log.initialRepBalance).full} (${percentRep.full})`,
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })
  })

  describe('constructTransferTransaction', () => {
    const test = t => it(t.description, () => t.assertions())

    test({
      description: `should return the expected object with _from equal to address and _to not equal to address and inProgress false`,
      assertions: () => {
        const address = '0xUSERADDRESS'
        const log = {
          _from: '0xUSERADDRESS',
          _to: '0xNOTUSERADDRESS',
          inProgress: false,
          _value: '10',
        }

        const actual = constructTransferTransaction(log, address)

        const expected = {
          data: {
            balances: [
              {
                change: formatRep(new BigNumber(log._value, 10).neg(), { positiveSign: true }),
              },
            ],
          },
          type: 'Send Tokens',
          description: `Send tokens to ${strip0xPrefix(log._to)}`,
          message: 'sent tokens',
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })

    test({
      description: `should return the expected object with _from equal to address and _to not equal to address and inProgress`,
      assertions: () => {
        const address = '0xUSERADDRESS'
        const log = {
          _from: '0xUSERADDRESS',
          _to: '0xNOTUSERADDRESS',
          inProgress: true,
          _value: '10',
        }

        const actual = constructTransferTransaction(log, address)

        const expected = {
          data: {
            balances: [
              {
                change: formatRep(new BigNumber(log._value, 10).neg(), { positiveSign: true }),
              },
            ],
          },
          type: 'Send Tokens',
          description: `Send tokens to ${strip0xPrefix(log._to)}`,
          message: 'sending tokens',
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })

    test({
      description: `should return the expected object with _from equal to address and _to not equal to address and inProgress false`,
      assertions: () => {
        const address = '0xUSERADDRESS'
        const log = {
          _from: '0xNOTUSERADDRESS',
          _to: '0xUSERADDRESS',
          inProgress: false,
          _value: '10',
        }

        const actual = constructTransferTransaction(log, address)

        const expected = {
          data: {
            balances: [
              {
                change: formatRep(new BigNumber(log._value, 10), { positiveSign: true }),
              },
            ],
          },
          type: 'Receive Tokens',
          description: `Receive tokens from ${strip0xPrefix(log._from)}`,
          message: 'received tokens',
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })

    test({
      description: `should return the expected object with _from equal to address and _to not equal to address and inProgress`,
      assertions: () => {
        const address = '0xUSERADDRESS'
        const log = {
          _from: '0xNOTUSERADDRESS',
          _to: '0xUSERADDRESS',
          inProgress: true,
          _value: '10',
        }

        const actual = constructTransferTransaction(log, address)

        const expected = {
          data: {
            balances: [
              {
                change: formatRep(new BigNumber(log._value, 10), { positiveSign: true }),
              },
            ],
          },
          type: 'Receive Tokens',
          description: `Receive tokens from ${strip0xPrefix(log._from)}`,
          message: 'receiving tokens',
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })
  })

  describe('constructCreateMarketTransaction', () => {
    const action = require('../../../src/modules/transactions/actions/construct-transaction')

    const test = t => it(t.description, () => t.assertions())

    test({
      description: `should return the expected object with inProgress false`,
      assertions: () => {
        const log = {
          inProgress: false,
          marketCreationFee: '10',
          marketId: '0xMARKETID',
          validityBond: '10',
          category: 'Testing',
        }
        const description = 'test description~|>one|two|three'

        const actual = action.constructCreateMarketTransaction(log, description)

        const expected = {
          data: {
            marketId: log.marketId,
          },
          type: TYPES.CREATE_MARKET,
          description: 'test description',
          category: 'Testing',
          marketCreationFee: formatEtherTokens(log.marketCreationFee),
          bond: {
            label: 'validity',
            value: formatEtherTokens(log.validityBond),
          },
          message: 'created market',
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })

    test({
      description: `should return the expected object with inProgress true`,
      assertions: () => {
        const log = {
          inProgress: true,
          marketCreationFee: '10',
          marketId: '0xMARKETID',
          validityBond: '10',
          category: 'Testing',
        }
        const description = 'test description~|>one|two|three'

        const actual = action.constructCreateMarketTransaction(log, description)

        const expected = {
          data: {
            marketId: log.marketId,
          },
          type: TYPES.CREATE_MARKET,
          description: 'test description',
          category: 'Testing',
          marketCreationFee: formatEtherTokens(log.marketCreationFee),
          bond: {
            label: 'validity',
            value: formatEtherTokens(log.validityBond),
          },
          message: 'creating market',
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })
  })

  describe('constructTradingProceedsClaimedTransaction', () => {
    const action = require('../../../src/modules/transactions/actions/construct-transaction')

    const test = t => it(t.description, () => t.assertions())

    test({
      description: `should return the expected object with no payoutTokens and no log.market and inProgress false`,
      assertions: () => {
        const log = {
          shares: '10',
          inProgress: false,
        }
        const market = {
          description: 'test description',
        }

        const actual = action.constructTradingProceedsClaimedTransaction(log, market)

        const expected = {
          data: {
            shares: '10',
            marketId: null,
          },
          type: 'Claim Trading Payout',
          description: 'test description',
          message: `closed out ${formatShares(log.shares).full}`,
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })

    test({
      description: `should return the expected object with no payoutTokens and log.market and inProgress false`,
      assertions: () => {
        const log = {
          shares: '10',
          inProgress: false,
          market: '0xMARKETID',
        }
        const market = {
          description: 'test description',
        }

        const actual = action.constructTradingProceedsClaimedTransaction(log, market)

        const expected = {
          data: {
            shares: '10',
            marketId: '0xMARKETID',
          },
          type: 'Claim Trading Payout',
          description: 'test description',
          message: `closed out ${formatShares(log.shares).full}`,
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })

    test({
      description: `should return the expected object with payoutTokens and log.market and inProgress false`,
      assertions: () => {
        const log = {
          shares: '10',
          inProgress: false,
          market: '0xMARKETID',
          payoutTokens: '10',
          tokenBalance: '10',
        }
        const market = {
          description: 'test description',
        }

        const actual = action.constructTradingProceedsClaimedTransaction(log, market)

        const expected = {
          data: {
            shares: '10',
            marketId: '0xMARKETID',
            balances: [
              {
                change: formatEtherTokens(log.payoutTokens, { positiveSign: true }),
                balance: formatEtherTokens(log.tokenBalance),
              },
            ],
          },
          // <<<<<<< HEAD
          //           type: 'fund_account',
          //           message: 'requesting testnet funding'
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected object`)
          //       }
          //     })
          //   })

          //   describe('constructMarketCreatedTransaction', () => {
          //     const action = require('../../../src/modules/transactions/actions/construct-transaction')

          //     const test = t => it(t.description, () => t.assertions())

          //     test({
          //       description: `should return the expected object with inProgress false`,
          //       assertions: () => {
          //         const log = {
          //           inProgress: false,
          //           marketCreationFee: '10',
          //           marketId: '0xMARKETID',
          //           eventBond: '10',
          //           category: 'Testing'
          //         }
          //         const description = 'test description~|>one|two|three'

          //         const actual = action.constructMarketCreatedTransaction(log, description)

          //         const expected = {
          //           data: {
          //             marketId: log.marketId
          //           },
          //           type: CREATE_MARKET,
          //           description: 'test description',
          //           category: 'Testing',
          //           marketCreationFee: formatEtherTokens(log.marketCreationFee),
          //           bond: {
          //             label: 'event validity',
          //             value: formatEtherTokens(log.eventBond)
          //           },
          //           message: 'created market'
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected object`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected object with inProgress true`,
          //       assertions: () => {
          //         const log = {
          //           inProgress: true,
          //           marketCreationFee: '10',
          //           marketId: '0xMARKETID',
          //           eventBond: '10',
          //           category: 'Testing'
          //         }
          //         const description = 'test description~|>one|two|three'

          //         const actual = action.constructMarketCreatedTransaction(log, description)

          //         const expected = {
          //           data: {
          //             marketId: log.marketId
          //           },
          //           type: CREATE_MARKET,
          //           description: 'test description',
          //           category: 'Testing',
          //           marketCreationFee: formatEtherTokens(log.marketCreationFee),
          //           bond: {
          //             label: 'event validity',
          //             value: formatEtherTokens(log.eventBond)
          //           },
          //           message: 'creating market'
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected object`)
          //       }
          //     })
          //   })

          //   describe('constructPayoutTransaction', () => {
          //     const action = require('../../../src/modules/transactions/actions/construct-transaction')

          //     const test = t => it(t.description, () => t.assertions())

          //     test({
          //       description: `should return the expected object with no cashPayout and no log.market and inProgress false`,
          //       assertions: () => {
          //         const log = {
          //           shares: '10',
          //           inProgress: false
          //         }
          //         const market = {
          //           description: 'test description'
          //         }

          //         const actual = action.constructPayoutTransaction(log, market)

          //         const expected = {
          //           data: {
          //             shares: '10',
          //             marketId: null
          //           },
          //           type: 'Claim Trading Payout',
          //           description: 'test description',
          //           message: `closed out ${formatShares(log.shares).full}`
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected object`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected object with no cashPayout and log.market and inProgress false`,
          //       assertions: () => {
          //         const log = {
          //           shares: '10',
          //           inProgress: false,
          //           market: '0xMARKETID'
          //         }
          //         const market = {
          //           description: 'test description'
          //         }

          //         const actual = action.constructPayoutTransaction(log, market)

          //         const expected = {
          //           data: {
          //             shares: '10',
          //             marketId: '0xMARKETID'
          //           },
          //           type: 'Claim Trading Payout',
          //           description: 'test description',
          //           message: `closed out ${formatShares(log.shares).full}`
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected object`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected object with cashPayout and log.market and inProgress false`,
          //       assertions: () => {
          //         const log = {
          //           shares: '10',
          //           inProgress: false,
          //           market: '0xMARKETID',
          //           cashPayout: '10',
          //           cashBalance: '10'
          //         }
          //         const market = {
          //           description: 'test description'
          //         }

          //         const actual = action.constructPayoutTransaction(log, market)

          //         const expected = {
          //           data: {
          //             shares: '10',
          //             marketId: '0xMARKETID',
          //             balances: [
          //               {
          //                 change: formatEtherTokens(log.cashPayout, { positiveSign: true }),
          //                 balance: formatEtherTokens(log.cashBalance)
          //               }
          //             ]
          //           },
          //           type: 'Claim Trading Payout',
          //           description: 'test description',
          //           message: `closed out ${formatShares(log.shares).full}`
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected object`)
          //       }
          //     })
          //   })

          //   describe('constructTradingFeeUpdatedTransaction', () => {
          //     const action = require('../../../src/modules/transactions/actions/construct-transaction')

          //     const test = t => it(t.description, () => t.assertions())

          //     test({
          //       description: `should return the expected object with no marketId`,
          //       assertions: () => {
          //         const log = {
          //           tradingFee: '0.01'
          //         }
          //         const market = {
          //           description: 'test description'
          //         }

          //         const actual = action.constructTradingFeeUpdatedTransaction(log, market)

          //         const expected = {
          //           data: {
          //             marketId: null
          //           },
          //           description: 'test description',
          //           message: `updated trading fee: ${formatPercent(abi.bignum(log.tradingFee).times(100)).full}`
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected object`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected object with marketId`,
          //       assertions: () => {
          //         const log = {
          //           marketId: '0xMARKETID',
          //           tradingFee: '0.01'
          //         }
          //         const market = {
          //           description: 'test description'
          //         }

          //         const actual = action.constructTradingFeeUpdatedTransaction(log, market)

          //         const expected = {
          //           data: {
          //             marketId: '0xMARKETID'
          //           },
          //           description: 'test description',
          //           message: `updated trading fee: ${formatPercent(abi.bignum(log.tradingFee).times(100)).full}`
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected object`)
          //       }
          //     })
          //   })

          //   describe('constructPenalizeTransaction', () => {
          //     const mockReportableOutcomes = {
          //       formatReportedOutcome: sinon.stub().returns('formatted reported outcome')
          //     }

          //     const mockUpdateEventsWithAccountReportData = {
          //       updateEventsWithAccountReportData: sinon.stub().returns({
          //         type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
          //       })
          //     }

          //     const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
          //       '../../reports/selectors/reportable-outcomes': mockReportableOutcomes,
          //       '../../my-reports/actions/update-events-with-account-report-data': mockUpdateEventsWithAccountReportData
          //     })

          //     const test = (t) => {
          //       const store = mockStore()
          //       it(t.description, () => {
          //         t.assertions(store)
          //       })
          //     }

          //     test({
          //       description: `should return the expected object and dispatch the expected actions with no repChange and inProgress false and reportValue !== log.outcome`,
          //       assertions: (store) => {
          //         const log = {
          //           reportValue: '1',
          //           outcome: '2'
          //         }
          //         const marketId = '0xMARKETID'
          //         const market = {
          //           description: 'test description'
          //         }

          //         const result = action.constructPenalizeTransaction(log, marketId, market, {}, store.dispatch)

          //         const expectedResult = {
          //           data: {
          //             marketId
          //           },
          //           type: 'Compare Report To Consensus',
          //           description: 'test description',
          //           message: `✘ report formatted reported outcome does not match consensus formatted reported outcome`
          //         }

          //         assert.deepEqual(result, expectedResult, `Didn't return the expected object`)

          //         const actions = store.getActions()

          //         const expectedActions = [
          //           {
          //             type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
          //           }
          //         ]

          //         assert.deepEqual(actions, expectedActions, `Didn't dispatch the expected actions`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected object and dispatch the expected actions with repChange equals 0 and inProgress false and reportValue !== log.outcome`,
          //       assertions: (store) => {
          //         const log = {
          //           reportValue: '1',
          //           outcome: '2',
          //           repchange: '0',
          //           oldrep: '2'
          //         }
          //         const marketId = '0xMARKETID'
          //         const market = {
          //           description: 'test description'
          //         }

          //         const result = action.constructPenalizeTransaction(log, marketId, market, {}, store.dispatch)

          //         const expectedResult = {
          //           data: {
          //             marketId,
          //             balances: [
          //               {
          //                 change: formatRep(abi.bignum(log.repchange), { positiveSign: true }),
          //                 balance: formatRep(2)
          //               }
          //             ]
          //           },
          //           type: 'Compare Report To Consensus',
          //           description: 'test description',
          //           message: `✘ report formatted reported outcome does not match consensus formatted reported outcome`
          //         }

          //         assert.deepEqual(result, expectedResult, `Didn't return the expected object`)

          //         const actions = store.getActions()

          //         const expectedActions = [
          //           {
          //             type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
          //           },
          //           {
          //             type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
          //           }
          //         ]

          //         assert.deepEqual(actions, expectedActions, `Didn't dispatch the expected actions`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected object and dispatch the expected actions with repChange not equal to 0 and inProgress false and reportValue !== log.outcome`,
          //       assertions: (store) => {
          //         const log = {
          //           reportValue: '1',
          //           outcome: '2',
          //           repchange: '0',
          //           oldrep: '2'
          //         }
          //         const marketId = '0xMARKETID'
          //         const market = {
          //           description: 'test description'
          //         }

          //         const result = action.constructPenalizeTransaction(log, marketId, market, {}, store.dispatch)

          //         const expectedResult = {
          //           data: {
          //             marketId,
          //             balances: [
          //               {
          //                 change: formatRep(constants.ZERO, { positiveSign: true }),
          //                 balance: formatRep('2')
          //               }
          //             ]
          //           },
          //           type: 'Compare Report To Consensus',
          //           description: 'test description',
          //           message: `✘ report formatted reported outcome does not match consensus formatted reported outcome`
          //         }

          //         assert.deepEqual(result, expectedResult, `Didn't return the expected object`)

          //         const actions = store.getActions()

          //         const expectedActions = [
          //           {
          //             type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
          //           },
          //           {
          //             type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
          //           }
          //         ]

          //         assert.deepEqual(actions, expectedActions, `Didn't dispatch the expected actions`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected object and dispatch the expected actions with repChange not equal to 0 and inProgress false and reportValue === log.outcome`,
          //       assertions: (store) => {
          //         const log = {
          //           reportValue: '1',
          //           outcome: '1',
          //           repchange: '0',
          //           oldrep: '2'
          //         }
          //         const marketId = '0xMARKETID'
          //         const market = {
          //           description: 'test description'
          //         }

          //         const result = action.constructPenalizeTransaction(log, marketId, market, {}, store.dispatch)

          //         const expectedResult = {
          //           data: {
          //             marketId,
          //             balances: [
          //               {
          //                 change: formatRep(constants.ZERO, { positiveSign: true }),
          //                 balance: formatRep('2')
          //               }
          //             ]
          //           },
          //           type: 'Compare Report To Consensus',
          //           description: 'test description',
          //           message: `✔ report formatted reported outcome matches consensus`
          //         }

          //         assert.deepEqual(result, expectedResult, `Didn't return the expected object`)

          //         const actions = store.getActions()

          //         const expectedActions = [
          //           {
          //             type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
          //           },
          //           {
          //             type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
          //           }
          //         ]

          //         assert.deepEqual(actions, expectedActions, `Didn't dispatch the expected actions`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected object and dispatch the expected actions with repChange not equal to 0 and inProgress and reportValue === log.outcome`,
          //       assertions: (store) => {
          //         const log = {
          //           reportValue: '1',
          //           outcome: '1',
          //           repchange: '0',
          //           oldrep: '2',
          //           inProgress: true
          //         }
          //         const marketId = '0xMARKETID'
          //         const market = {
          //           description: 'test description'
          //         }

          //         const result = action.constructPenalizeTransaction(log, marketId, market, {}, store.dispatch)

          //         const expectedResult = {
          //           data: {
          //             marketId,
          //             balances: [
          //               {
          //                 change: formatRep(constants.ZERO, { positiveSign: true }),
          //                 balance: formatRep('2')
          //               }
          //             ]
          //           },
          //           type: 'Compare Report To Consensus',
          //           description: 'test description',
          //           message: 'comparing report to consensus'
          //         }

          //         assert.deepEqual(result, expectedResult, `Didn't return the expected object`)

          //         const actions = store.getActions()

          //         const expectedActions = []

          //         assert.deepEqual(actions, expectedActions, `Didn't dispatch the expected actions`)
          //       }
          //     })
          //   })

          //   describe('constructSubmittedReportHashTransaction', () => {
          //     proxyquire.callThru()

          //     const mockAugur = {
          //       augur: {
          //         reporting: {
          //           crypto: {
          //             parseAndDecryptReport: sinon.stub().returns({
          //               report: 'testing'
          //             })
          //           }
          //         }
          //       }
          //     }

          //     const mockReportableOutcomes = {
          //       formatReportedOutcome: sinon.stub().returns('formatted reported outcome')
          //     }

          //     const mockUpdateEventsWithAccountReportData = {
          //       updateEventsWithAccountReportData: sinon.stub().returns({
          //         type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
          //       })
          //     }

          //     const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
          //       '../../../services/augurjs': mockAugur,
          //       '../../reports/selectors/reportable-outcomes': mockReportableOutcomes,
          //       '../../my-reports/actions/update-events-with-account-report-data': mockUpdateEventsWithAccountReportData
          //     })

          //     after(() => {
          //       proxyquire.noCallThru()
          //     })

          //     const test = (t) => {
          //       const store = mockStore()
          //       it(t.description, () => {
          //         t.assertions(store)
          //       })
          //     }

          //     test({
          //       description: `should return the expected object and dispatch the expected actions with no decryptionKey and no ethics and inProgress`,
          //       assertions: (store) => {
          //         const log = {
          //           inProgress: true
          //         }
          //         const marketId = '0xMARKETID'
          //         const market = {
          //           description: 'test description'
          //         }

          //         const result = action.constructSubmittedReportHashTransaction(log, marketId, market, null, null, store.dispatch)

          //         const expectedResult = {
          //           data: {
          //             marketId,
          //             market,
          //             isUnethical: true
          //           },
          //           type: COMMIT_REPORT,
          //           description: market.description,
          //           message: 'committing to report'
          //         }

          //         assert.deepEqual(result, expectedResult, `Didn't return the expected object`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected object and dispatch the expected actions with no decryptionKey and ethics and inProgress`,
          //       assertions: (store) => {
          //         const log = {
          //           ethics: '1',
          //           inProgress: true
          //         }
          //         const marketId = '0xMARKETID'
          //         const market = {
          //           description: 'test description'
          //         }

          //         const result = action.constructSubmittedReportHashTransaction(log, marketId, market, null, null, store.dispatch)

          //         const expectedResult = {
          //           data: {
          //             marketId,
          //             market,
          //             isUnethical: false
          //           },
          //           type: COMMIT_REPORT,
          //           description: market.description,
          //           message: 'committing to report'
          //         }

          //         assert.deepEqual(result, expectedResult, `Didn't return the expected object`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected object and dispatch the expected actions with decryptionKey and ethics and inProgress`,
          //       assertions: (store) => {
          //         const log = {
          //           ethics: '1',
          //           inProgress: true
          //         }
          //         const marketId = '0xMARKETID'
          //         const market = {
          //           description: 'test description'
          //         }

          //         const result = action.constructSubmittedReportHashTransaction(log, marketId, market, null, '123DECRYPTIONKEY', store.dispatch)

          //         const expectedResult = {
          //           data: {
          //             marketId,
          //             market,
          //             isUnethical: false,
          //             reportedOutcomeId: 'formatted reported outcome',
          //             outcome: {
          //               name: 'formatted reported outcome'
          //             },
          //           },
          //           type: COMMIT_REPORT,
          //           description: market.description,
          //           message: 'committing to report: formatted reported outcome'
          //         }

          //         assert.deepEqual(result, expectedResult, `Didn't return the expected object`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected object and dispatch the expected actions with decryptionKey and ethics and inProgress false`,
          //       assertions: (store) => {
          //         const log = {
          //           ethics: '1',
          //           inProgress: false
          //         }
          //         const marketId = '0xMARKETID'
          //         const market = {
          //           description: 'test description'
          //         }

          //         const result = action.constructSubmittedReportHashTransaction(log, marketId, market, null, '123DECRYPTIONKEY', store.dispatch)

          //         const expectedResult = {
          //           data: {
          //             marketId,
          //             market,
          //             isUnethical: false,
          //             reportedOutcomeId: 'formatted reported outcome',
          //             outcome: {
          //               name: 'formatted reported outcome'
          //             },
          //           },
          //           type: COMMIT_REPORT,
          //           description: market.description,
          //           message: 'committed to report: formatted reported outcome'
          //         }

          //         assert.deepEqual(result, expectedResult, `Didn't return the expected object`)

          //         const actions = store.getActions()

          //         const expectedActions = [
          //           {
          //             type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
          //           }
          //         ]

          //         assert.deepEqual(actions, expectedActions, `Didn't dispatch the expected actions`)
          //       }
          //     })
          //   })

          //   describe('constructSubmittedReportTransaction', () => {
          //     const mockReportableOutcomes = {
          //       formatReportedOutcome: sinon.stub().returns('formatted reported outcome')
          //     }

          //     const mockUpdateEventsWithAccountReportData = {
          //       updateEventsWithAccountReportData: sinon.stub().returns({
          //         type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
          //       })
          //     }

          //     const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
          //       '../../reports/selectors/reportable-outcomes': mockReportableOutcomes,
          //       '../../my-reports/actions/update-events-with-account-report-data': mockUpdateEventsWithAccountReportData
          //     })

          //     const test = t => it(t.description, () => {
          //       const store = mockStore()
          //       t.assertions(store)
          //     })

          //     test({
          //       description: `should return the expected object with no ethics and inProgress`,
          //       assertions: () => {
          //         const log = {
          //           inProgress: true
          //         }
          //         const marketId = '0xMARKETID'
          //         const market = {
          //           description: 'test description'
          //         }

          //         const result = action.constructSubmittedReportTransaction(log, marketId, market)

          //         const expectedResult = {
          //           data: {
          //             marketId,
          //             market,
          //             isUnethical: true,
          //             reportedOutcomeId: 'formatted reported outcome',
          //             outcome: {
          //               name: 'formatted reported outcome'
          //             }
          //           },
          //           type: REVEAL_REPORT,
          //           description: market.description,
          //           message: 'revealing report: formatted reported outcome'
          //         }

          //         assert.deepEqual(result, expectedResult, `Didn't return the expected object`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected object with ethics and inProgress`,
          //       assertions: () => {
          //         const log = {
          //           inProgress: true,
          //           ethics: '1'
          //         }
          //         const marketId = '0xMARKETID'
          //         const market = {
          //           description: 'test description'
          //         }

          //         const result = action.constructSubmittedReportTransaction(log, marketId, market)

          //         const expectedResult = {
          //           data: {
          //             marketId,
          //             market,
          //             isUnethical: false,
          //             reportedOutcomeId: 'formatted reported outcome',
          //             outcome: {
          //               name: 'formatted reported outcome'
          //             }
          //           },
          //           type: REVEAL_REPORT,
          //           description: market.description,
          //           message: 'revealing report: formatted reported outcome'
          //         }

          //         assert.deepEqual(result, expectedResult, `Didn't return the expected object`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected object with ethics and inProgress false`,
          //       assertions: (store) => {
          //         const log = {
          //           ethics: '1'
          //         }
          //         const marketId = '0xMARKETID'
          //         const market = {
          //           description: 'test description'
          //         }

          //         const result = action.constructSubmittedReportTransaction(log, marketId, market, null, store.dispatch)

          //         const expectedResult = {
          //           data: {
          //             marketId,
          //             market,
          //             isUnethical: false,
          //             reportedOutcomeId: 'formatted reported outcome',
          //             outcome: {
          //               name: 'formatted reported outcome'
          //             }
          //           },
          //           type: REVEAL_REPORT,
          //           description: market.description,
          //           message: 'revealed report: formatted reported outcome'
          //         }

          //         assert.deepEqual(result, expectedResult, `Didn't return the expected object`)

          //         const actions = store.getActions()

          //         const expectedActions = [
          //           {
          //             type: MOCK_ACTION_TYPES.UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA
          //           }
          //         ]

          //         assert.deepEqual(actions, expectedActions, `Didn't dispatch the expected actions`)
          //       }
          //     })
          //   })

          //   describe('constructSlashedRepTransaction', () => {
          //     const action = require('../../../src/modules/transactions/actions/construct-transaction')

          //     const test = t => it(t.description, () => t.assertions())

          //     test({
          //       description: `should return the expected object with sender not equal to user and repSlashed false and inProgress false`,
          //       assertions: () => {
          //         const log = {
          //           reporter: '0xREPORTER',
          //           sender: '0xSENDER'
          //         }
          //         const market = {
          //           id: '0xMARKETID',
          //           description: 'test description'
          //         }

          //         const actual = action.constructSlashedRepTransaction(log, market)

          //         const expected = {
          //           data: {
          //             marketId: '0xMARKETID',
          //             market
          //           },
          //           description: market.description,
          //           type: 'Pay Collusion Fine',
          //           message: `fined by ${abi.strip_0x(log.sender)}`
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected object`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected object with sender equal to user and repSlashed false and inProgress false`,
          //       assertions: () => {
          //         const log = {
          //           reporter: '0xREPORTER',
          //           sender: '0xSENDER'
          //         }
          //         const market = {
          //           id: '0xMARKETID',
          //           description: 'test description'
          //         }
          //         const address = '0xSENDER'

          //         const actual = action.constructSlashedRepTransaction(log, market, null, address)

          //         const expected = {
          //           data: {
          //             marketId: '0xMARKETID',
          //             market
          //           },
          //           description: market.description,
          //           type: 'Snitch Reward',
          //           message: `fined ${abi.strip_0x(log.reporter)} ${formatRep(log.repSlashed).full}`
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected object`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected object with sender equal to user and repSlashed and inProgress false`,
          //       assertions: () => {
          //         const log = {
          //           reporter: '0xREPORTER',
          //           sender: '0xSENDER',
          //           repSlashed: '10',
          //           slasherBalance: '20'
          //         }
          //         const market = {
          //           id: '0xMARKETID',
          //           description: 'test description'
          //         }
          //         const address = '0xSENDER'

          //         const actual = action.constructSlashedRepTransaction(log, market, null, address)

          //         const expected = {
          //           data: {
          //             marketId: '0xMARKETID',
          //             market,
          //             balances: [
          //               {
          //                 change: formatRep(5, { positiveSign: true }),
          //                 balance: formatRep(log.slasherBalance)
          //               }
          //             ]
          //           },
          //           description: market.description,
          //           type: 'Snitch Reward',
          //           message: `fined ${abi.strip_0x(log.reporter)} ${formatRep(log.repSlashed).full}`
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected object`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected object with sender equal to user and repSlashed and inProgress`,
          //       assertions: () => {
          //         const log = {
          //           reporter: '0xREPORTER',
          //           sender: '0xSENDER',
          //           repSlashed: '10',
          //           slasherBalance: '20',
          //           inProgress: true
          //         }
          //         const market = {
          //           id: '0xMARKETID',
          //           description: 'test description'
          //         }
          //         const address = '0xSENDER'

          //         const actual = action.constructSlashedRepTransaction(log, market, null, address)

          //         const expected = {
          //           data: {
          //             marketId: '0xMARKETID',
          //             market,
          //             balances: [
          //               {
          //                 change: formatRep(5, { positiveSign: true }),
          //                 balance: formatRep(log.slasherBalance)
          //               }
          //             ]
          //           },
          //           description: market.description,
          //           type: 'Snitch Reward',
          //           message: `fining ${abi.strip_0x(log.reporter)}`
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected object`)
          //       }
          //     })
          //   })

          //   describe('constructLogFillTxTransaction', () => {
          //     const action = require('../../../src/modules/transactions/actions/construct-transaction')

          //     const test = t => it(t.description, () => {
          //       const store = mockStore()
          //       t.assertions(store)
          //     })

          //     test({
          //       description: `should return the expected transaction object with necessary data missing`,
          //       assertions: (store) => {
          //         const trade = {}

          //         const actual = store.dispatch(action.constructLogFillTxTransaction(trade))

          //         const expected = null

          //         assert.strictEqual(actual, expected, `Didn't return the expected value`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected transaction object with maker and type BUY and inProgress false`,
          //       assertions: (store) => {
          //         const trade = {
          //           transactionHash: '0xHASH',
          //           tradeid: '0xTRADEID',
          //           tradeGroupId: '0xTRADEGROUPID',
          //           price: '0.1',
          //           amount: '2',
          //           maker: true,
          //           makerFee: '0.01',
          //           type: BUY,
          //           timestamp: 1491843278,
          //           blockNumber: 123456,
          //           gasFees: 0.001
          //         }
          //         const marketId = '0xMARKETID'
          //         const marketType = BINARY
          //         const minValue = '0'
          //         const description = 'test description'
          //         const outcomeId = '1'
          //         const status = 'testing'

          //         const price = formatEtherTokens(trade.price)
          //         const shares = formatShares(trade.amount)
          //         const tradingFees = trade.maker ? abi.bignum(trade.makerFee) : abi.bignum(trade.takerFee)
          //         const bnShares = abi.bignum(trade.amount)
          //         const bnPrice = marketType === SCALAR ? abi.bignum(augur.trading.shrinkScalarPrice(minValue, trade.price)) : abi.bignum(trade.price)
          //         const totalCost = bnPrice.times(bnShares).plus(tradingFees)
          //         const totalReturn = bnPrice.times(bnShares).minus(tradingFees)
          //         const totalCostPerShare = totalCost.dividedBy(bnShares)

          //         const actual = store.dispatch(action.constructLogFillTxTransaction(trade, marketId, marketType, minValue, description, outcomeId, null, status))

          //         const expected = {
          //           '0xHASH-0xTRADEID': {
          //             type: MATCH_ASK,
          //             hash: trade.transactionHash,
          //             tradeGroupId: trade.tradeGroupId,
          //             status,
          //             description,
          //             data: {
          //               marketType,
          //               outcomeName: outcomeId,
          //               outcomeId,
          //               marketId
          //             },
          //             message: `sold ${shares.full} for ${formatEtherTokens(totalCostPerShare).full} / share`,
          //             numShares: shares,
          //             noFeePrice: price,
          //             avgPrice: price,
          //             timestamp: formatDate(new Date(trade.timestamp * 1000)),
          //             tradingFees: formatEtherTokens(tradingFees),
          //             feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
          //             totalCost: undefined,
          //             totalReturn: formatEtherTokens(totalReturn),
          //             gasFees: trade.gasFees && abi.bignum(trade.gasFees).gt(ZERO) ? formatEther(trade.gasFees) : null,
          //             blockNumber: trade.blockNumber
          //           }
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected value`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected transaction object with maker and type BUY and inProgress`,
          //       assertions: (store) => {
          //         const trade = {
          //           transactionHash: '0xHASH',
          //           tradeid: '0xTRADEID',
          //           tradeGroupId: '0xTRADEGROUPID',
          //           price: '0.1',
          //           amount: '2',
          //           maker: true,
          //           makerFee: '0.01',
          //           type: BUY,
          //           timestamp: 1491843278,
          //           blockNumber: 123456,
          //           gasFees: 0.001,
          //           inProgress: true
          //         }
          //         const marketId = '0xMARKETID'
          //         const marketType = BINARY
          //         const minValue = '0'
          //         const description = 'test description'
          //         const outcomeId = '1'
          //         const status = 'testing'

          //         const price = formatEtherTokens(trade.price)
          //         const shares = formatShares(trade.amount)
          //         const tradingFees = trade.maker ? abi.bignum(trade.makerFee) : abi.bignum(trade.takerFee)
          //         const bnShares = abi.bignum(trade.amount)
          //         const bnPrice = marketType === SCALAR ? abi.bignum(augur.trading.shrinkScalarPrice(minValue, trade.price)) : abi.bignum(trade.price)
          //         const totalCost = bnPrice.times(bnShares).plus(tradingFees)
          //         const totalReturn = bnPrice.times(bnShares).minus(tradingFees)
          //         const totalCostPerShare = totalCost.dividedBy(bnShares)

          //         const actual = store.dispatch(action.constructLogFillTxTransaction(trade, marketId, marketType, minValue, description, outcomeId, null, status))

          //         const expected = {
          //           '0xHASH-0xTRADEID': {
          //             type: MATCH_ASK,
          //             hash: trade.transactionHash,
          //             tradeGroupId: trade.tradeGroupId,
          //             status,
          //             description,
          //             data: {
          //               marketType,
          //               outcomeName: outcomeId,
          //               outcomeId,
          //               marketId
          //             },
          //             message: `${MATCH_ASK} ${shares.full} for ${formatEtherTokens(totalCostPerShare).full} / share`,
          //             numShares: shares,
          //             noFeePrice: price,
          //             avgPrice: price,
          //             timestamp: formatDate(new Date(trade.timestamp * 1000)),
          //             tradingFees: formatEtherTokens(tradingFees),
          //             feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
          //             totalCost: undefined,
          //             totalReturn: formatEtherTokens(totalReturn),
          //             gasFees: trade.gasFees && abi.bignum(trade.gasFees).gt(ZERO) ? formatEther(trade.gasFees) : null,
          //             blockNumber: trade.blockNumber
          //           }
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected value`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected transaction object with maker and type SELL and inProgress false`,
          //       assertions: (store) => {
          //         const trade = {
          //           transactionHash: '0xHASH',
          //           tradeid: '0xTRADEID',
          //           tradeGroupId: '0xTRADEGROUPID',
          //           price: '0.1',
          //           amount: '2',
          //           maker: true,
          //           makerFee: '0.01',
          //           type: SELL,
          //           timestamp: 1491843278,
          //           blockNumber: 123456,
          //           gasFees: 0.001
          //         }
          //         const marketId = '0xMARKETID'
          //         const marketType = BINARY
          //         const minValue = '0'
          //         const description = 'test description'
          //         const outcomeId = '1'
          //         const status = 'testing'

          //         const price = formatEtherTokens(trade.price)
          //         const shares = formatShares(trade.amount)
          //         const tradingFees = trade.maker ? abi.bignum(trade.makerFee) : abi.bignum(trade.takerFee)
          //         const bnShares = abi.bignum(trade.amount)
          //         const bnPrice = marketType === SCALAR ? abi.bignum(augur.trading.shrinkScalarPrice(minValue, trade.price)) : abi.bignum(trade.price)
          //         const totalCost = bnPrice.times(bnShares).plus(tradingFees)
          //         const totalReturn = bnPrice.times(bnShares).minus(tradingFees)
          //         const totalReturnPerShare = totalReturn.dividedBy(bnShares)

          //         const actual = store.dispatch(action.constructLogFillTxTransaction(trade, marketId, marketType, minValue, description, outcomeId, null, status))

          //         const expected = {
          //           '0xHASH-0xTRADEID': {
          //             type: MATCH_BID,
          //             hash: trade.transactionHash,
          //             tradeGroupId: trade.tradeGroupId,
          //             status,
          //             description,
          //             data: {
          //               marketType,
          //               outcomeName: outcomeId,
          //               outcomeId,
          //               marketId
          //             },
          //             message: `bought ${shares.full} for ${formatEtherTokens(totalReturnPerShare).full} / share`,
          //             numShares: shares,
          //             noFeePrice: price,
          //             avgPrice: price,
          //             timestamp: formatDate(new Date(trade.timestamp * 1000)),
          //             tradingFees: formatEtherTokens(tradingFees),
          //             feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
          //             totalCost: formatEtherTokens(totalCost),
          //             totalReturn: undefined,
          //             gasFees: formatEther(trade.gasFees),
          //             blockNumber: trade.blockNumber
          //           }
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected value`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected transaction object with maker and type SELL and inProgress`,
          //       assertions: (store) => {
          //         const trade = {
          //           transactionHash: '0xHASH',
          //           tradeid: '0xTRADEID',
          //           tradeGroupId: '0xTRADEGROUPID',
          //           price: '0.1',
          //           amount: '2',
          //           maker: true,
          //           makerFee: '0.01',
          //           type: SELL,
          //           timestamp: 1491843278,
          //           blockNumber: 123456,
          //           gasFees: 0.001,
          //           inProgress: true
          //         }
          //         const marketId = '0xMARKETID'
          //         const marketType = BINARY
          //         const minValue = '0'
          //         const description = 'test description'
          //         const outcomeId = '1'
          //         const status = 'testing'

          //         const price = formatEtherTokens(trade.price)
          //         const shares = formatShares(trade.amount)
          //         const tradingFees = trade.maker ? abi.bignum(trade.makerFee) : abi.bignum(trade.takerFee)
          //         const bnShares = abi.bignum(trade.amount)
          //         const bnPrice = marketType === SCALAR ? abi.bignum(augur.trading.shrinkScalarPrice(minValue, trade.price)) : abi.bignum(trade.price)
          //         const totalCost = bnPrice.times(bnShares).plus(tradingFees)
          //         const totalReturn = bnPrice.times(bnShares).minus(tradingFees)
          //         const totalReturnPerShare = totalReturn.dividedBy(bnShares)

          //         const actual = store.dispatch(action.constructLogFillTxTransaction(trade, marketId, marketType, minValue, description, outcomeId, null, status))

          //         const expected = {
          //           '0xHASH-0xTRADEID': {
          //             type: MATCH_BID,
          //             hash: trade.transactionHash,
          //             tradeGroupId: trade.tradeGroupId,
          //             status,
          //             description,
          //             data: {
          //               marketType,
          //               outcomeName: outcomeId,
          //               outcomeId,
          //               marketId
          //             },
          //             message: `${MATCH_BID} ${shares.full} for ${formatEtherTokens(totalReturnPerShare).full} / share`,
          //             numShares: shares,
          //             noFeePrice: price,
          //             avgPrice: price,
          //             timestamp: formatDate(new Date(trade.timestamp * 1000)),
          //             tradingFees: formatEtherTokens(tradingFees),
          //             feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
          //             totalCost: formatEtherTokens(totalCost),
          //             totalReturn: undefined,
          //             gasFees: trade.gasFees && abi.bignum(trade.gasFees).gt(ZERO) ? formatEther(trade.gasFees) : null,
          //             blockNumber: trade.blockNumber
          //           }
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected value`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected transaction object with taker and type BUY and inProgress false`,
          //       assertions: (store) => {
          //         const trade = {
          //           transactionHash: '0xHASH',
          //           tradeid: '0xTRADEID',
          //           tradeGroupId: '0xTRADEGROUPID',
          //           price: '0.1',
          //           amount: '2',
          //           maker: false,
          //           takerFee: '0.01',
          //           type: BUY,
          //           timestamp: 1491843278,
          //           blockNumber: 123456,
          //           gasFees: 0.001
          //         }
          //         const marketId = '0xMARKETID'
          //         const marketType = BINARY
          //         const minValue = '0'
          //         const description = 'test description'
          //         const outcomeId = '1'
          //         const status = 'testing'

          //         const price = formatEtherTokens(trade.price)
          //         const shares = formatShares(trade.amount)
          //         const tradingFees = trade.maker ? abi.bignum(trade.makerFee) : abi.bignum(trade.takerFee)
          //         const bnShares = abi.bignum(trade.amount)
          //         const bnPrice = marketType === SCALAR ? abi.bignum(augur.trading.shrinkScalarPrice(minValue, trade.price)) : abi.bignum(trade.price)
          //         const totalCost = bnPrice.times(bnShares).plus(tradingFees)
          //         const totalCostPerShare = totalCost.dividedBy(bnShares)

          //         const actual = store.dispatch(action.constructLogFillTxTransaction(trade, marketId, marketType, minValue, description, outcomeId, null, status))

          //         const expected = {
          //           '0xHASH-0xTRADEID': {
          //             type: BUY,
          //             hash: trade.transactionHash,
          //             tradeGroupId: trade.tradeGroupId,
          //             status,
          //             description,
          //             data: {
          //               marketType,
          //               outcomeName: outcomeId,
          //               outcomeId,
          //               marketId
          //             },
          //             message: `bought ${shares.full} for ${formatEtherTokens(totalCostPerShare).full} / share`,
          //             numShares: shares,
          //             noFeePrice: price,
          //             avgPrice: price,
          //             timestamp: formatDate(new Date(trade.timestamp * 1000)),
          //             tradingFees: formatEtherTokens(tradingFees),
          //             feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
          //             totalCost: formatEtherTokens(totalCost),
          //             totalReturn: undefined,
          //             gasFees: trade.gasFees && abi.bignum(trade.gasFees).gt(ZERO) ? formatEther(trade.gasFees) : null,
          //             blockNumber: trade.blockNumber
          //           }
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected value`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected transaction object with taker and type BUY and inProgress`,
          //       assertions: (store) => {
          //         const trade = {
          //           transactionHash: '0xHASH',
          //           tradeid: '0xTRADEID',
          //           tradeGroupId: '0xTRADEGROUPID',
          //           price: '0.1',
          //           amount: '2',
          //           maker: false,
          //           takerFee: '0.01',
          //           type: BUY,
          //           timestamp: 1491843278,
          //           blockNumber: 123456,
          //           gasFees: 0.001,
          //           inProgress: true
          //         }
          //         const marketId = '0xMARKETID'
          //         const marketType = BINARY
          //         const minValue = '0'
          //         const description = 'test description'
          //         const outcomeId = '1'
          //         const status = 'testing'

          //         const price = formatEtherTokens(trade.price)
          //         const shares = formatShares(trade.amount)
          //         const tradingFees = trade.maker ? abi.bignum(trade.makerFee) : abi.bignum(trade.takerFee)
          //         const bnShares = abi.bignum(trade.amount)
          //         const bnPrice = marketType === SCALAR ? abi.bignum(augur.trading.shrinkScalarPrice(minValue, trade.price)) : abi.bignum(trade.price)
          //         const totalCost = bnPrice.times(bnShares).plus(tradingFees)
          //         const totalCostPerShare = totalCost.dividedBy(bnShares)

          //         const actual = store.dispatch(action.constructLogFillTxTransaction(trade, marketId, marketType, minValue, description, outcomeId, null, status))

          //         const expected = {
          //           '0xHASH-0xTRADEID': {
          //             type: BUY,
          //             hash: trade.transactionHash,
          //             tradeGroupId: trade.tradeGroupId,
          //             status,
          //             description,
          //             data: {
          //               marketType,
          //               outcomeName: outcomeId,
          //               outcomeId,
          //               marketId
          //             },
          //             message: `${BUY} ${shares.full} for ${formatEtherTokens(totalCostPerShare).full} / share`,
          //             numShares: shares,
          //             noFeePrice: price,
          //             avgPrice: price,
          //             timestamp: formatDate(new Date(trade.timestamp * 1000)),
          //             tradingFees: formatEtherTokens(tradingFees),
          //             feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
          //             totalCost: formatEtherTokens(totalCost),
          //             totalReturn: undefined,
          //             gasFees: formatEther(trade.gasFees),
          //             blockNumber: trade.blockNumber
          //           }
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected value`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected transaction object with taker and type SELL and inProgress false`,
          //       assertions: (store) => {
          //         const trade = {
          //           transactionHash: '0xHASH',
          //           tradeid: '0xTRADEID',
          //           tradeGroupId: '0xTRADEGROUPID',
          //           price: '0.1',
          //           amount: '2',
          //           maker: false,
          //           takerFee: '0.01',
          //           type: SELL,
          //           timestamp: 1491843278,
          //           blockNumber: 123456,
          //           gasFees: 0.001
          //         }
          //         const marketId = '0xMARKETID'
          //         const marketType = BINARY
          //         const minValue = '0'
          //         const description = 'test description'
          //         const outcomeId = '1'
          //         const status = 'testing'

          //         const price = formatEtherTokens(trade.price)
          //         const shares = formatShares(trade.amount)
          //         const tradingFees = trade.maker ? abi.bignum(trade.makerFee) : abi.bignum(trade.takerFee)
          //         const bnShares = abi.bignum(trade.amount)
          //         const bnPrice = marketType === SCALAR ? abi.bignum(augur.trading.shrinkScalarPrice(minValue, trade.price)) : abi.bignum(trade.price)
          //         const totalCost = bnPrice.times(bnShares).plus(tradingFees)
          //         const totalReturn = bnPrice.times(bnShares).minus(tradingFees)
          //         const totalReturnPerShare = totalReturn.dividedBy(bnShares)

          //         const actual = store.dispatch(action.constructLogFillTxTransaction(trade, marketId, marketType, minValue, description, outcomeId, null, status))

          //         const expected = {
          //           '0xHASH-0xTRADEID': {
          //             type: SELL,
          //             hash: trade.transactionHash,
          //             tradeGroupId: trade.tradeGroupId,
          //             status,
          //             description,
          //             data: {
          //               marketType,
          //               outcomeName: outcomeId,
          //               outcomeId,
          //               marketId
          //             },
          //             message: `sold ${shares.full} for ${formatEtherTokens(totalReturnPerShare).full} / share`,
          //             numShares: shares,
          //             noFeePrice: price,
          //             avgPrice: price,
          //             timestamp: formatDate(new Date(trade.timestamp * 1000)),
          //             tradingFees: formatEtherTokens(tradingFees),
          //             feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
          //             totalCost: undefined,
          //             totalReturn: formatEtherTokens(totalReturn),
          //             gasFees: formatEther(trade.gasFees),
          //             blockNumber: trade.blockNumber
          //           }
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected value`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected transaction object with taker and type SELL and inProgress`,
          //       assertions: (store) => {
          //         const trade = {
          //           transactionHash: '0xHASH',
          //           tradeid: '0xTRADEID',
          //           tradeGroupId: '0xTRADEGROUPID',
          //           price: '0.1',
          //           amount: '2',
          //           maker: false,
          //           takerFee: '0.01',
          //           type: SELL,
          //           timestamp: 1491843278,
          //           blockNumber: 123456,
          //           gasFees: 0.001,
          //           inProgress: true
          //         }
          //         const marketId = '0xMARKETID'
          //         const marketType = BINARY
          //         const minValue = '0'
          //         const description = 'test description'
          //         const outcomeId = '1'
          //         const status = 'testing'

          //         const price = formatEtherTokens(trade.price)
          //         const shares = formatShares(trade.amount)
          //         const tradingFees = trade.maker ? abi.bignum(trade.makerFee) : abi.bignum(trade.takerFee)
          //         const bnShares = abi.bignum(trade.amount)
          //         const bnPrice = marketType === SCALAR ? abi.bignum(augur.trading.shrinkScalarPrice(minValue, trade.price)) : abi.bignum(trade.price)
          //         const totalCost = bnPrice.times(bnShares).plus(tradingFees)
          //         const totalReturn = bnPrice.times(bnShares).minus(tradingFees)
          //         const totalReturnPerShare = totalReturn.dividedBy(bnShares)

          //         const actual = store.dispatch(action.constructLogFillTxTransaction(trade, marketId, marketType, minValue, description, outcomeId, null, status))

          //         const expected = {
          //           '0xHASH-0xTRADEID': {
          //             type: SELL,
          //             hash: trade.transactionHash,
          //             tradeGroupId: trade.tradeGroupId,
          //             status,
          //             description,
          //             data: {
          //               marketType,
          //               outcomeName: outcomeId,
          //               outcomeId,
          //               marketId
          //             },
          //             message: `${SELL} ${shares.full} for ${formatEtherTokens(totalReturnPerShare).full} / share`,
          //             numShares: shares,
          //             noFeePrice: price,
          //             avgPrice: price,
          //             timestamp: formatDate(new Date(trade.timestamp * 1000)),
          //             tradingFees: formatEtherTokens(tradingFees),
          //             feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
          //             totalCost: undefined,
          //             totalReturn: formatEtherTokens(totalReturn),
          //             gasFees: formatEther(trade.gasFees),
          //             blockNumber: trade.blockNumber
          //           }
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected value`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected transaction object with type scalar and taker and type SELL and inProgress`,
          //       assertions: (store) => {
          //         const trade = {
          //           transactionHash: '0xHASH',
          //           tradeid: '0xTRADEID',
          //           tradeGroupId: '0xTRADEGROUPID',
          //           price: '0.1',
          //           amount: '2',
          //           maker: false,
          //           takerFee: '0.01',
          //           type: SELL,
          //           timestamp: 1491843278,
          //           blockNumber: 123456,
          //           gasFees: 0.001,
          //           inProgress: true
          //         }
          //         const marketId = '0xMARKETID'
          //         const marketType = SCALAR
          //         const minValue = '0'
          //         const description = 'test description'
          //         const outcomeId = '1'
          //         const status = 'testing'

          //         const price = formatEtherTokens(trade.price)
          //         const shares = formatShares(trade.amount)
          //         const tradingFees = trade.maker ? abi.bignum(trade.makerFee) : abi.bignum(trade.takerFee)
          //         const bnShares = abi.bignum(trade.amount)
          //         const bnPrice = abi.bignum(augur.trading.shrinkScalarPrice(minValue, trade.price))
          //         const totalCost = bnPrice.times(bnShares).plus(tradingFees)
          //         const totalReturn = bnPrice.times(bnShares).minus(tradingFees)
          //         const totalReturnPerShare = totalReturn.dividedBy(bnShares)

          //         const actual = store.dispatch(action.constructLogFillTxTransaction(trade, marketId, marketType, minValue, description, outcomeId, null, status))

          //         const expected = {
          //           '0xHASH-0xTRADEID': {
          //             type: SELL,
          //             hash: trade.transactionHash,
          //             tradeGroupId: trade.tradeGroupId,
          //             status,
          //             description,
          //             data: {
          //               marketType,
          //               outcomeName: outcomeId,
          //               outcomeId,
          //               marketId
          //             },
          //             message: `${SELL} ${shares.full} for ${formatEtherTokens(totalReturnPerShare).full} / share`,
          //             numShares: shares,
          //             noFeePrice: price,
          //             avgPrice: price,
          //             timestamp: formatDate(new Date(trade.timestamp * 1000)),
          //             tradingFees: formatEtherTokens(tradingFees),
          //             feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
          //             totalCost: undefined,
          //             totalReturn: formatEtherTokens(totalReturn),
          //             gasFees: formatEther(trade.gasFees),
          //             blockNumber: trade.blockNumber
          //           }
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected value`)
          //       }
          //     })
          //   })

          //   describe('constructLogFillTxTransaction', () => {
          //     const action = require('../../../src/modules/transactions/actions/construct-transaction')

          //     const test = t => it(t.description, () => {
          //       const store = mockStore()
          //       t.assertions(store)
          //     })

          //     test({
          //       description: `should return the expected object with inProgress false`,
          //       assertions: (store) => {
          //         const trade = {
          //           transactionHash: '0xHASH',
          //           tradeid: '0xTRADEID',
          //           tradeGroupId: '0xTRADEGROUPID',
          //           price: '0.1',
          //           amount: '2',
          //           maker: false,
          //           takerFee: '0.01',
          //           type: SELL,
          //           timestamp: 1491843278,
          //           blockNumber: 123456,
          //           gasFees: 0.001
          //         }
          //         const marketId = '0xMARKETID'
          //         const marketType = BINARY
          //         const maxValue = '1'
          //         const description = 'test description'
          //         const outcomeId = '1'
          //         const status = 'testing'

          //         const price = formatEtherTokens(trade.price)
          //         const shares = formatShares(trade.amount)
          //         const bnPrice = abi.bignum(trade.price)
          //         const tradingFees = abi.bignum(trade.takerFee)
          //         const bnShares = abi.bignum(trade.amount)
          //         const totalCost = bnShares.minus(bnPrice.times(bnShares).plus(tradingFees))
          //         const totalCostPerShare = totalCost.dividedBy(bnShares)

          //         const actual = store.dispatch(action.constructLogShortFillTxTransaction(trade, marketId, marketType, maxValue, description, outcomeId, null, status))

          //         const expected = {
          //           '0xHASH-0xTRADEID': {
          //             type: SHORT_SELL,
          //             hash: trade.transactionHash,
          //             status,
          //             description,
          //             data: {
          //               marketType,
          //               outcomeName: outcomeId,
          //               outcomeId,
          //               marketId
          //             },
          //             message: `short sold ${shares.full} for ${formatEtherTokens(totalCostPerShare).full} / share`,
          //             numShares: shares,
          //             noFeePrice: price,
          //             avgPrice: formatEtherTokens(totalCost.minus(bnShares).dividedBy(bnShares).abs()),
          //             timestamp: formatDate(new Date(trade.timestamp * 1000)),
          //             tradingFees: formatEtherTokens(tradingFees),
          //             feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
          //             totalCost: formatEtherTokens(totalCost),
          //             gasFees: formatEther(trade.gasFees),
          //             blockNumber: trade.blockNumber
          //           }
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected object`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected object with inProgress`,
          //       assertions: (store) => {
          //         const trade = {
          //           transactionHash: '0xHASH',
          //           tradeid: '0xTRADEID',
          //           tradeGroupId: '0xTRADEGROUPID',
          //           price: '0.1',
          //           amount: '2',
          //           maker: false,
          //           takerFee: '0.01',
          //           type: SELL,
          //           timestamp: 1491843278,
          //           blockNumber: 123456,
          //           gasFees: 0.001,
          //           inProgress: true
          //         }
          //         const marketId = '0xMARKETID'
          //         const marketType = BINARY
          //         const maxValue = '1'
          //         const description = 'test description'
          //         const outcomeId = '1'
          //         const status = 'testing'

          //         const price = formatEtherTokens(trade.price)
          //         const shares = formatShares(trade.amount)
          //         const bnPrice = abi.bignum(trade.price)
          //         const tradingFees = abi.bignum(trade.takerFee)
          //         const bnShares = abi.bignum(trade.amount)
          //         const totalCost = bnShares.minus(bnPrice.times(bnShares).plus(tradingFees))
          //         const totalCostPerShare = totalCost.dividedBy(bnShares)

          //         const actual = store.dispatch(action.constructLogShortFillTxTransaction(trade, marketId, marketType, maxValue, description, outcomeId, null, status))

          //         const expected = {
          //           '0xHASH-0xTRADEID': {
          //             type: SHORT_SELL,
          //             hash: trade.transactionHash,
          //             status,
          //             description,
          //             data: {
          //               marketType,
          //               outcomeName: outcomeId,
          //               outcomeId,
          //               marketId
          //             },
          //             message: `short selling ${shares.full} for ${formatEtherTokens(totalCostPerShare).full} / share`,
          //             numShares: shares,
          //             noFeePrice: price,
          //             avgPrice: formatEtherTokens(totalCost.minus(bnShares).dividedBy(bnShares).abs()),
          //             timestamp: formatDate(new Date(trade.timestamp * 1000)),
          //             tradingFees: formatEtherTokens(tradingFees),
          //             feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
          //             totalCost: formatEtherTokens(totalCost),
          //             gasFees: formatEther(trade.gasFees),
          //             blockNumber: trade.blockNumber
          //           }
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected object`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected object with type scalar and inProgress`,
          //       assertions: (store) => {
          //         const trade = {
          //           transactionHash: '0xHASH',
          //           tradeid: '0xTRADEID',
          //           tradeGroupId: '0xTRADEGROUPID',
          //           price: '0.1',
          //           amount: '2',
          //           maker: false,
          //           takerFee: '0.01',
          //           type: SELL,
          //           timestamp: 1491843278,
          //           blockNumber: 123456,
          //           gasFees: 0.001,
          //           inProgress: true
          //         }
          //         const marketId = '0xMARKETID'
          //         const marketType = SCALAR
          //         const maxValue = '1'
          //         const description = 'test description'
          //         const outcomeId = '1'
          //         const status = 'testing'

          //         const price = formatEtherTokens(trade.price)
          //         const shares = formatShares(trade.amount)
          //         const bnPrice = abi.bignum(trade.price)
          //         const tradingFees = abi.bignum(trade.takerFee)
          //         const bnShares = abi.bignum(trade.amount)
          //         const totalCost = abi.bignum(maxValue).times(bnShares).minus(bnPrice.times(bnShares).plus(tradingFees))
          //         const totalCostPerShare = totalCost.dividedBy(bnShares)

          //         const actual = store.dispatch(action.constructLogShortFillTxTransaction(trade, marketId, marketType, maxValue, description, outcomeId, null, status))

          //         const expected = {
          //           '0xHASH-0xTRADEID': {
          //             type: SHORT_SELL,
          //             hash: trade.transactionHash,
          //             status,
          //             description,
          //             data: {
          //               marketType,
          //               outcomeName: outcomeId,
          //               outcomeId,
          //               marketId
          //             },
          //             message: `short selling ${shares.full} for ${formatEtherTokens(totalCostPerShare).full} / share`,
          //             numShares: shares,
          //             noFeePrice: price,
          //             avgPrice: formatEtherTokens(totalCost.minus(bnShares).dividedBy(bnShares).abs()),
          //             timestamp: formatDate(new Date(trade.timestamp * 1000)),
          //             tradingFees: formatEtherTokens(tradingFees),
          //             feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
          //             totalCost: formatEtherTokens(totalCost),
          //             gasFees: formatEther(trade.gasFees),
          //             blockNumber: trade.blockNumber
          //           }
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected object`)
          //       }
          //     })
          //   })

          //   describe('constructLogFillTxTransaction', () => {
          //     const action = require('../../../src/modules/transactions/actions/construct-transaction')

          //     const test = t => it(t.description, () => {
          //       const store = mockStore()
          //       t.assertions(store)
          //     })

          //     describe('related conditionals: trade type, isShortAsk, and inProgress', () => {
          //       let trade = {
          //         transactionHash: '0xHASH',
          //         tradeid: '0xTRADEID',
          //         tradeGroupId: '0xTRADEGROUPID',
          //         price: '0.1',
          //         amount: '2',
          //         maker: false,
          //         takerFee: '0.01',
          //         type: SELL,
          //         timestamp: 1491843278,
          //         blockNumber: 123456,
          //         gasFees: 0.001
          //       }
          //       const marketId = '0xMARKETID'
          //       const marketType = BINARY
          //       const description = 'test description'
          //       const outcomeId = '1'
          //       const market = {
          //         makerFee: '0.025',
          //         takerFee: '0.05',
          //         minValue: '0',
          //         maxValue: '1'
          //       }
          //       const status = 'testing'

          //       test({
          //         description: `BUY, false, false`,
          //         assertions: (store) => {
          //           trade = {
          //             ...trade,
          //             type: BUY,
          //             isShortAsk: false,
          //             inProgress: false
          //           }

          //           const actual = store.dispatch(action.constructLogAddTxTransaction(trade, marketId, marketType, description, outcomeId, null, market, status))

          //           const expected = {
          //             '0xHASH': {
          //               type: BID,
          //               message: 'bid 2 shares for 0.1009 ETH Tokens / share',
          //               freeze: {
          //                 verb: 'froze',
          //                 noFeeCost: formatEtherTokens(0.2)
          //               },
          //               totalCost: formatEtherTokens(0.2018),
          //               totalReturn: undefined
          //             }
          //           }

          //           assert.containSubset(actual, expected, `Didn't contain the expected subset`)
          //         }
          //       })

          //       test({
          //         description: `BUY, false, true`,
          //         assertions: (store) => {
          //           trade = {
          //             ...trade,
          //             type: BUY,
          //             isShortAsk: false,
          //             inProgress: true
          //           }

          //           const actual = store.dispatch(action.constructLogAddTxTransaction(trade, marketId, marketType, description, outcomeId, null, market, status))

          //           const expected = {
          //             '0xHASH': {
          //               type: BID,
          //               message: 'bidding 2 shares for 0.1009 ETH Tokens / share',
          //               freeze: {
          //                 verb: 'freezing',
          //                 noFeeCost: formatEtherTokens(0.2)
          //               },
          //               totalCost: formatEtherTokens(0.2018),
          //               totalReturn: undefined
          //             }
          //           }

          //           assert.containSubset(actual, expected, `Didn't contain the expected subset`)
          //         }
          //       })

          //       test({
          //         description: `SELL, false, false`,
          //         assertions: (store) => {
          //           trade = {
          //             ...trade,
          //             type: SELL,
          //             isShortAsk: false,
          //             inProgress: false
          //           }

          //           const actual = store.dispatch(action.constructLogAddTxTransaction(trade, marketId, marketType, description, outcomeId, null, market, status))

          //           const expected = {
          //             '0xHASH': {
          //               type: ASK,
          //               message: 'ask 2 shares for 0.0991 ETH Tokens / share',
          //               freeze: {
          //                 verb: 'froze',
          //                 noFeeCost: undefined
          //               },
          //               totalCost: undefined,
          //               totalReturn: formatEtherTokens(0.1982)
          //             }
          //           }

          //           assert.containSubset(actual, expected, `Didn't contain the expected subset`)
          //         }
          //       })

          //       test({
          //         description: `SELL, false, true`,
          //         assertions: (store) => {
          //           trade = {
          //             ...trade,
          //             type: SELL,
          //             isShortAsk: false,
          //             inProgress: true
          //           }

          //           const actual = store.dispatch(action.constructLogAddTxTransaction(trade, marketId, marketType, description, outcomeId, null, market, status))

          //           const expected = {
          //             '0xHASH': {
          //               type: ASK,
          //               message: 'asking 2 shares for 0.0991 ETH Tokens / share',
          //               freeze: {
          //                 verb: 'freezing',
          //                 noFeeCost: undefined
          //               },
          //               totalCost: undefined,
          //               totalReturn: formatEtherTokens(0.1982)
          //             }
          //           }

          //           assert.containSubset(actual, expected, `Didn't contain the expected subset`)
          //         }
          //       })

          //       test({
          //         description: `SELL, true, false`,
          //         assertions: (store) => {
          //           trade = {
          //             ...trade,
          //             type: SELL,
          //             isShortAsk: true,
          //             inProgress: true
          //           }

          //           const actual = store.dispatch(action.constructLogAddTxTransaction(trade, marketId, marketType, description, outcomeId, null, market, status))

          //           const expected = {
          //             '0xHASH': {
          //               type: SHORT_ASK,
          //               message: 'short asking 2 shares for 0.0991 ETH Tokens / share',
          //               freeze: {
          //                 verb: 'freezing',
          //                 noFeeCost: formatEtherTokens(2)
          //               },
          //               totalCost: undefined,
          //               totalReturn: undefined
          //             }
          //           }

          //           assert.containSubset(actual, expected, `Didn't contain the expected subset`)
          //         }
          //       })
          //     })

          //     describe('conditionals: market type', () => {
          //       const trade = {
          //         transactionHash: '0xHASH',
          //         tradeid: '0xTRADEID',
          //         tradeGroupId: '0xTRADEGROUPID',
          //         price: '0.1',
          //         amount: '2',
          //         maker: false,
          //         takerFee: '0.01',
          //         type: SELL,
          //         timestamp: 1491843278,
          //         blockNumber: 123456,
          //         gasFees: 0.001
          //       }
          //       const marketId = '0xMARKETID'
          //       let marketType = BINARY
          //       const description = 'test description'
          //       const outcomeId = '1'
          //       let market = {
          //         makerFee: '0.025',
          //         takerFee: '0.05',
          //         minValue: '0',
          //         maxValue: '1'
          //       }
          //       const status = 'testing'

          //       test({
          //         description: 'BINARY',
          //         assertions: (store) => {
          //           const actual = store.dispatch(action.constructLogAddTxTransaction(trade, marketId, marketType, description, outcomeId, null, market, status))

          //           const expected = {
          //             '0xHASH': {
          //               noFeePrice: formatEtherTokens(0.1),
          //               freeze: {
          //                 tradingFees: formatEtherTokens(0.0018)
          //               },
          //               feePercent: formatPercent(0.8919722497522299),
          //               message: 'ask 2 shares for 0.0991 ETH Tokens / share'
          //             }
          //           }

          //           assert.containSubset(actual, expected, `Didn't contain the expected subset`)
          //         }
          //       })

          //       test({
          //         description: 'SCALAR',
          //         assertions: (store) => {
          //           marketType = SCALAR
          //           market = {
          //             ...market,
          //             minValue: -1,
          //             maxValue: 1
          //           }

          //           const actual = store.dispatch(action.constructLogAddTxTransaction(trade, marketId, marketType, description, outcomeId, null, market, status))

          //           const expected = {
          //             '0xHASH': {
          //               noFeePrice: formatEtherTokens(-0.9),
          //               freeze: {
          //                 tradingFees: formatEtherTokens(0.00095)
          //               },
          //               feePercent: formatPercent(0.4727544165215227),
          //               message: 'ask 2 shares for 0.0995 ETH Tokens / share'
          //             }
          //           }

          //           assert.containSubset(actual, expected, `Didn't contain the expected subset`)
          //         }
          //       })
          //     })

          //     describe('general calculations', () => {
          //       const trade = {
          //         transactionHash: '0xHASH',
          //         tradeid: '0xTRADEID',
          //         tradeGroupId: '0xTRADEGROUPID',
          //         price: '0.1',
          //         amount: '2',
          //         maker: false,
          //         takerFee: '0.01',
          //         type: SELL,
          //         timestamp: 1491843278,
          //         blockNumber: 123456,
          //         gasFees: 0.001,
          //         inProgress: false
          //       }
          //       const marketId = '0xMARKETID'
          //       const marketType = BINARY
          //       const description = 'test description'
          //       const outcomeId = '1'
          //       const market = {
          //         makerFee: '0.025',
          //         takerFee: '0.05',
          //         minValue: '0',
          //         maxValue: '1'
          //       }
          //       const status = 'testing'

          //       test({
          //         description: `should return the expected object`,
          //         assertions: (store) => {
          //           const actual = store.dispatch(action.constructLogAddTxTransaction(trade, marketId, marketType, description, outcomeId, null, market, status))

          //           const expected = {
          //             '0xHASH': {
          //               type: ASK,
          //               status,
          //               description,
          //               data: {
          //                 marketType,
          //                 outcomeName: outcomeId,
          //                 outcomeId,
          //                 marketId
          //               },
          //               message: 'ask 2 shares for 0.0991 ETH Tokens / share',
          //               numShares: formatShares(trade.amount),
          //               noFeePrice: formatEtherTokens(trade.price),
          //               freeze: {
          //                 verb: 'froze',
          //                 noFeeCost: undefined,
          //                 tradingFees: formatEtherTokens(0.0018)
          //               },
          //               avgPrice: formatEtherTokens(trade.price),
          //               timestamp: formatDate(new Date(trade.timestamp * 1000)),
          //               hash: trade.transactionHash,
          //               feePercent: formatPercent(0.8919722497522299),
          //               totalCost: undefined,
          //               totalReturn: formatEtherTokens(0.1982),
          //               gasFees: formatEther(trade.gasFees),
          //               blockNumber: trade.blockNumber,
          //               tradeId: trade.tradeid
          //             }
          //           }

          //           assert.deepEqual(actual, expected, `Didn't return the expected object`)
          //         }
          //       })
          //     })
          //   })

          //   describe('constructLogCancelTransaction', () => {
          //     const action = require('../../../src/modules/transactions/actions/construct-transaction')

          //     let trade = {
          //       transactionHash: '0xHASH',
          //       tradeid: '0xTRADEID',
          //       tradeGroupId: '0xTRADEGROUPID',
          //       price: '0.1',
          //       amount: '2',
          //       maker: false,
          //       takerFee: '0.01',
          //       type: SELL,
          //       timestamp: 1491843278,
          //       blockNumber: 123456,
          //       gasFees: 0.001,
          //       inProgress: false,
          //       cashRefund: '10'
          //     }
          //     const marketId = '0xMARKETID'
          //     const marketType = BINARY
          //     const description = 'test description'
          //     const outcomeId = '1'
          //     const status = 'testing'

          //     const test = t => it(t.description, () => {
          //       const store = mockStore()
          //       t.assertions(store)
          //     })

          //     test({
          //       description: `should return the expected object with inProgress false`,
          //       assertions: (store) => {
          //         const actual = store.dispatch(action.constructLogCancelTransaction(trade, marketId, marketType, description, outcomeId, null, status))

          //         const price = formatEtherTokens(trade.price)
          //         const shares = formatShares(trade.amount)

          //         const expected = {
          //           '0xHASH': {
          //             type: CANCEL_ORDER,
          //             status,
          //             description,
          //             data: {
          //               order: {
          //                 type: trade.type,
          //                 shares
          //               },
          //               marketType,
          //               outcome: {
          //                 name: outcomeId
          //               },
          //               outcomeId,
          //               marketId
          //             },
          //             message: `canceled order to ${trade.type} ${shares.full} for ${price.full} each`,
          //             numShares: shares,
          //             noFeePrice: price,
          //             avgPrice: price,
          //             timestamp: formatDate(new Date(trade.timestamp * 1000)),
          //             hash: trade.transactionHash,
          //             totalReturn: formatEtherTokens(trade.cashRefund),
          //             gasFees: formatEther(trade.gasFees),
          //             blockNumber: trade.blockNumber,
          //             tradeId: trade.tradeid
          //           }
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected object`)
          //       }
          //     })

          //     test({
          //       description: `should return the expected object with inProgress false`,
          //       assertions: (store) => {
          //         trade = {
          //           ...trade,
          //           inProgress: true
          //         }

          //         const actual = store.dispatch(action.constructLogCancelTransaction(trade, marketId, marketType, description, outcomeId, null, status))

          //         const price = formatEtherTokens(trade.price)
          //         const shares = formatShares(trade.amount)

          //         const expected = {
          //           '0xHASH': {
          //             type: CANCEL_ORDER,
          //             status,
          //             description,
          //             data: {
          //               order: {
          //                 type: trade.type,
          //                 shares
          //               },
          //               marketType,
          //               outcome: {
          //                 name: outcomeId
          //               },
          //               outcomeId,
          //               marketId
          //             },
          //             message: `canceling order to ${trade.type} ${shares.full} for ${price.full} each`,
          //             numShares: shares,
          //             noFeePrice: price,
          //             avgPrice: price,
          //             timestamp: formatDate(new Date(trade.timestamp * 1000)),
          //             hash: trade.transactionHash,
          //             totalReturn: null,
          //             gasFees: formatEther(trade.gasFees),
          //             blockNumber: trade.blockNumber,
          //             tradeId: trade.tradeid
          //           }
          //         }

          //         assert.deepEqual(actual, expected, `Didn't return the expected object`)
          //       }
          //     })
          //   })

          //   describe('constructTradingTransaction', () => {
          //     const constructTransaction = require('../../../src/modules/transactions/actions/construct-transaction')

          //     constructTransaction.__set__('constructLogFillTxTransaction', sinon.stub().returns({
          //       type: MOCK_ACTION_TYPES.CONSTRUCT_LOG_FILL_TX_TRANSACTION
          //     }))
          //     constructTransaction.__set__('constructLogShortFillTxTransaction', sinon.stub().returns({
          //       type: MOCK_ACTION_TYPES.CONSTRUCT_LOG_SHORT_FILL_TX_TRANSACTIONS
          //     }))
          //     constructTransaction.__set__('constructLogAddTxTransaction', sinon.stub().returns({
          //       type: MOCK_ACTION_TYPES.CONSTRUCT_LOG_ADD_TX_TRANSACTION
          //     }))
          //     constructTransaction.__set__('constructLogCancelTransaction', sinon.stub().returns({
          //       type: MOCK_ACTION_TYPES.CONSTRUCT_LOG_CANCEL_TRANSACTION
          //     }))

          //     const test = t => it(t.description, () => {
          //       const store = mockStore(t.state)
          //       t.assertions(store)
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'log_fill_tx'`,
          //       state: {
          //         marketsData: {
          //           '0xMARKETID': {}
          //         },
          //         outcomesData: {}
          //       },
          //       assertions: (store) => {
          //         store.dispatch(constructTransaction.constructTradingTransaction('log_fill_tx', {}, '0xMARKETID'))

          //         const actual = store.getActions()

          //         const expected = [
          //           {
          //             type: MOCK_ACTION_TYPES.CONSTRUCT_LOG_FILL_TX_TRANSACTION
          //           }
          //         ]

          //         assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'log_short_fill_tx'`,
          //       state: {
          //         marketsData: {
          //           '0xMARKETID': {}
          //         },
          //         outcomesData: {}
          //       },
          //       assertions: (store) => {
          //         store.dispatch(constructTransaction.constructTradingTransaction('log_short_fill_tx', {}, '0xMARKETID'))

          //         const actual = store.getActions()

          //         const expected = [
          //           {
          //             type: MOCK_ACTION_TYPES.CONSTRUCT_LOG_SHORT_FILL_TX_TRANSACTIONS
          //           }
          //         ]

          //         assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'log_add_tx'`,
          //       state: {
          //         marketsData: {
          //           '0xMARKETID': {}
          //         },
          //         outcomesData: {}
          //       },
          //       assertions: (store) => {
          //         store.dispatch(constructTransaction.constructTradingTransaction('log_add_tx', {}, '0xMARKETID'))

          //         const actual = store.getActions()

          //         const expected = [
          //           {
          //             type: MOCK_ACTION_TYPES.CONSTRUCT_LOG_ADD_TX_TRANSACTION
          //           }
          //         ]

          //         assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'log_cancel'`,
          //       state: {
          //         marketsData: {
          //           '0xMARKETID': {}
          //         },
          //         outcomesData: {}
          //       },
          //       assertions: (store) => {
          //         store.dispatch(constructTransaction.constructTradingTransaction('log_cancel', {}, '0xMARKETID'))

          //         const actual = store.getActions()

          //         const expected = [
          //           {
          //             type: MOCK_ACTION_TYPES.CONSTRUCT_LOG_CANCEL_TRANSACTION
          //           }
          //         ]

          //         assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
          //       }
          //     })
          //   })

          //   describe('constructMarketTransaction', () => {
          //     const { __RewireAPI__, constructMarketTransaction } = require('../../../src/modules/transactions/actions/construct-transaction')

          //     const test = t => it(t.description, () => {
          //       const store = mockStore()
          //       t.assertions(store)
          //     })

          //     test({
          //       description: `should call the expected method for label 'payout'`,
          //       assertions: (store) => {
          //         __RewireAPI__.__set__('constructPayoutTransaction', () => 'constructPayoutTransaction')

          //         const actual = store.dispatch(constructMarketTransaction('payout'))

          //         const expected = 'constructPayoutTransaction'

          //         assert.strictEqual(actual, expected, `Didn't call the expected method`)
          //       }
          //     })

          //     test({
          //       description: `should call the expected method for label 'tradingFeeUpdated'`,
          //       assertions: (store) => {
          //         __RewireAPI__.__set__('constructTradingFeeUpdatedTransaction', () => 'constructTradingFeeUpdatedTransaction')

          //         const actual = store.dispatch(constructMarketTransaction('tradingFeeUpdated'))

          //         const expected = 'constructTradingFeeUpdatedTransaction'

          //         assert.strictEqual(actual, expected, `Didn't call the expected method`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected method for default label`,
          //       assertions: (store) => {
          //         const actual = store.dispatch(constructMarketTransaction(undefined))

          //         const expected = null

          //         assert.strictEqual(actual, expected, `Didn't return the expected value`)
          //       }
          //     })
          //   })

          //   describe('constructReportingTransaction', () => {
          //     const { __RewireAPI__, constructReportingTransaction } = require('../../../src/modules/transactions/actions/construct-transaction')

          //     const test = t => it(t.description, () => {
          //       const store = mockStore({
          //         loginAccount: {
          //           address: '',
          //           derivedKey: ''
          //         }
          //       })
          //       t.assertions(store)
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'penalize'`,
          //       assertions: (store) => {
          //         __RewireAPI__.__set__('constructPenalizeTransaction', () => 'constructPenalizeTransaction')

          //         const actual = store.dispatch(constructReportingTransaction('penalize'))

          //         const expected = 'constructPenalizeTransaction'

          //         assert.strictEqual(actual, expected, `Didn't call the expected method`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'submittedReport'`,
          //       assertions: (store) => {
          //         __RewireAPI__.__set__('constructSubmittedReportTransaction', () => 'constructSubmittedReportTransaction')

          //         const actual = store.dispatch(constructReportingTransaction('submittedReport'))

          //         const expected = 'constructSubmittedReportTransaction'

          //         assert.strictEqual(actual, expected, `Didn't call the expected method`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'submittedReportHash'`,
          //       assertions: (store) => {
          //         __RewireAPI__.__set__('constructSubmittedReportHashTransaction', () => 'constructSubmittedReportHashTransaction')

          //         const actual = store.dispatch(constructReportingTransaction('submittedReportHash'))

          //         const expected = 'constructSubmittedReportHashTransaction'

          //         assert.strictEqual(actual, expected, `Didn't call the expected method`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'slashedRep'`,
          //       assertions: (store) => {
          //         __RewireAPI__.__set__('constructSlashedRepTransaction', () => 'constructSlashedRepTransaction')

          //         const actual = store.dispatch(constructReportingTransaction('slashedRep'))

          //         const expected = 'constructSlashedRepTransaction'

          //         assert.strictEqual(actual, expected, `Didn't call the expected method`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected method for default label`,
          //       assertions: (store) => {
          //         const actual = store.dispatch(constructReportingTransaction(undefined))

          //         const expected = null

          //         assert.strictEqual(actual, expected, `Didn't return the expected value`)
          //       }
          //     })
          //   })

          //   describe('constructTransaction', () => {
          //     const { __RewireAPI__, constructTransaction } = require('../../../src/modules/transactions/actions/construct-transaction')

          //     const test = t => it(t.description, () => {
          //       const store = mockStore(t.state || {})
          //       t.assertions(store)
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'Approval'`,
          //       assertions: (store) => {
          //         __RewireAPI__.__set__('constructApprovalTransaction', () => 'constructApprovalTransaction')

          //         const actual = store.dispatch(constructTransaction('Approval'))

          //         const expected = 'constructApprovalTransaction'

          //         assert.strictEqual(actual, expected, `Didn't call the expected method`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'collectedFees'`,
          //       assertions: (store) => {
          //         __RewireAPI__.__set__('constructCollectedFeesTransaction', () => 'constructCollectedFeesTransaction')

          //         const actual = store.dispatch(constructTransaction('collectedFees'))

          //         const expected = 'constructCollectedFeesTransaction'

          //         assert.strictEqual(actual, expected, `Didn't call the expected method`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'depositEther'`,
          //       assertions: (store) => {
          //         __RewireAPI__.__set__('constructConvertEthToEthTokenTransaction', () => 'constructConvertEthToEthTokenTransaction')

          //         const actual = store.dispatch(constructTransaction('depositEther'))

          //         const expected = 'constructConvertEthToEthTokenTransaction'

          //         assert.strictEqual(actual, expected, `Didn't call the expected method`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'fundedAccount'`,
          //       assertions: (store) => {
          //         __RewireAPI__.__set__('constructFundedAccountTransaction', () => 'constructFundedAccountTransaction')

          //         const actual = store.dispatch(constructTransaction('fundedAccount'))

          //         const expected = 'constructFundedAccountTransaction'

          //         assert.strictEqual(actual, expected, `Didn't call the expected method`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'penalizationCaughtUp'`,
          //       assertions: (store) => {
          //         __RewireAPI__.__set__('constructPenalizationCaughtUpTransaction', () => 'constructPenalizationCaughtUpTransaction')

          //         const actual = store.dispatch(constructTransaction('penalizationCaughtUp'))

          //         const expected = 'constructPenalizationCaughtUpTransaction'

          //         assert.strictEqual(actual, expected, `Didn't call the expected method`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'registration'`,
          //       assertions: (store) => {
          //         __RewireAPI__.__set__('constructRegistrationTransaction', () => 'constructRegistrationTransaction')

          //         const actual = store.dispatch(constructTransaction('registration'))

          //         const expected = 'constructRegistrationTransaction'

          //         assert.strictEqual(actual, expected, `Didn't call the expected method`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'withdraw'`,
          //       assertions: (store) => {
          //         __RewireAPI__.__set__('constructWithdrawTransaction', () => 'constructWithdrawTransaction')

          //         const actual = store.dispatch(constructTransaction('withdraw'))

          //         const expected = 'constructWithdrawTransaction'

          //         assert.strictEqual(actual, expected, `Didn't call the expected method`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'sentCash' with trasnactionHash in state`,
          //       state: {
          //         transactionsData: {
          //           '0xHASH': {}
          //         }
          //       },
          //       assertions: (store) => {
          //         const actual = store.dispatch(constructTransaction('sentCash', {
          //           transactionHash: '0xHASH'
          //         }))

          //         const expected = null

          //         assert.strictEqual(actual, expected, `Didn't return the expected value`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'sentCash' without trasnactionHash in state`,
          //       state: {
          //         transactionsData: {},
          //         loginAccount: {}
          //       },
          //       assertions: (store) => {
          //         __RewireAPI__.__set__('constructSentCashTransaction', () => 'constructSentCashTransaction')

          //         const actual = store.dispatch(constructTransaction('sentCash', {
          //           transactionHash: '0xHASH'
          //         }))

          //         const expected = 'constructSentCashTransaction'

          //         assert.strictEqual(actual, expected, `Didn't call the expected method`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'sentEther' with trasnactionHash in state`,
          //       state: {
          //         transactionsData: {
          //           '0xHASH': {}
          //         }
          //       },
          //       assertions: (store) => {
          //         const actual = store.dispatch(constructTransaction('sentEther', {
          //           transactionHash: '0xHASH'
          //         }))

          //         const expected = null

          //         assert.strictEqual(actual, expected, `Didn't return the expected value`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'sentEther' without trasnactionHash in state`,
          //       state: {
          //         transactionsData: {},
          //         loginAccount: {}
          //       },
          //       assertions: (store) => {
          //         __RewireAPI__.__set__('constructSentEtherTransaction', () => 'constructSentEtherTransaction')

          //         const actual = store.dispatch(constructTransaction('sentEther', {
          //           transactionHash: '0xHASH'
          //         }))

          //         const expected = 'constructSentEtherTransaction'

          //         assert.strictEqual(actual, expected, `Didn't call the expected method`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'Transfer' with trasnactionHash in state`,
          //       state: {
          //         transactionsData: {
          //           '0xHASH': {}
          //         }
          //       },
          //       assertions: (store) => {
          //         const actual = store.dispatch(constructTransaction('Transfer', {
          //           transactionHash: '0xHASH'
          //         }))

          //         const expected = null

          //         assert.strictEqual(actual, expected, `Didn't return the expected value`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'Transfer' without trasnactionHash in state`,
          //       state: {
          //         transactionsData: {},
          //         loginAccount: {}
          //       },
          //       assertions: (store) => {
          //         __RewireAPI__.__set__('constructTransferTransaction', () => 'constructTransferTransaction')

          //         const actual = store.dispatch(constructTransaction('Transfer', {
          //           transactionHash: '0xHASH'
          //         }))

          //         const expected = 'constructTransferTransaction'

          //         assert.strictEqual(actual, expected, `Didn't call the expected method`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'marketCreated' without description in log`,
          //       assertions: (store) => {
          //         __RewireAPI__.__set__('constructMarketCreatedTransaction', () => 'constructMarketCreatedTransaction')

          //         const actual = store.dispatch(constructTransaction('marketCreated', {
          //           description: 'testing'
          //         }))

          //         const expected = 'constructMarketCreatedTransaction'

          //         assert.strictEqual(actual, expected, `Didn't call the expected method`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'marketCreated' without description in returned market`,
          //       assertions: (store) => {
          //         __RewireAPI__.__set__('loadDataForMarketTransaction', () => dispatch => ({}))

          //         const actual = store.dispatch(constructTransaction('marketCreated', {}))

          //         const expected = undefined

          //         assert.strictEqual(actual, expected, `Didn't return the expected value`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'marketCreated' with description in returned market`,
          //       assertions: (store) => {
          //         __RewireAPI__.__set__('loadDataForMarketTransaction', () => dispatch => ({
          //           description: 'testing'
          //         }))
          //         __RewireAPI__.__set__('constructMarketCreatedTransaction', () => 'constructMarketCreatedTransaction')

          //         const actual = store.dispatch(constructTransaction('marketCreated', {}))

          //         const expected = 'constructMarketCreatedTransaction'

          //         assert.strictEqual(actual, expected, `Didn't call the expected method`)
          //       }
          //     })

          //     test({
          //       description: `should dispatch the expected actions for label 'payout' without description in returned market`,
          //       assertions: (store) => {
          //         __RewireAPI__.__set__('loadDataForMarketTransaction', () => dispatch => ({}))

          //         const actual = store.dispatch(constructTransaction('payout', {}))

          //         const expected = undefined

          //         assert.strictEqual(actual, expected, `Didn't return the expected value`)
          // =======
          type: 'Claim Trading Payout',
          description: 'test description',
          message: `closed out ${formatShares(log.shares).full}`,
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })
  })

  describe('constructSubmitReportTransaction', () => {
    const mockReportableOutcomes = {
      formatReportedOutcome: sinon.stub().returns('formatted reported outcome'),
    }

    const mockUpdateEventsWithAccountReportData = {
      updateMarketsWithAccountReportData: sinon.stub().returns({
        type: MOCK_ACTION_TYPES.UPDATE_MARKETS_WITH_ACCOUNT_REPORT_DATA,
      }),
    }

    const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
      '../../reports/selectors/reportable-outcomes': mockReportableOutcomes,
      '../../my-reports/actions/update-markets-with-account-report-data': mockUpdateEventsWithAccountReportData,
    })

    const test = t => it(t.description, () => {
      const store = mockStore()
      t.assertions(store)
    })

    test({
      description: `should return the expected object with inProgress`,
      assertions: () => {
        const log = {
          inProgress: true,
        }
        const marketId = '0xMARKETID'
        const market = {
          description: 'test description',
        }

        const result = action.constructSubmitReportTransaction(log, marketId, market)

        const expectedResult = {
          data: {
            marketId,
            market,
            reportedOutcomeId: 'formatted reported outcome',
            outcome: {
              name: 'formatted reported outcome',
            },
          },
          type: TYPES.SUBMIT_REPORT,
          description: market.description,
          message: 'revealing report: formatted reported outcome',
        }

        assert.deepEqual(result, expectedResult, `Didn't return the expected object`)
      },
    })
  })

  describe('constructFillOrderTransaction', () => {
    const action = require('../../../src/modules/transactions/actions/construct-transaction')

    const test = t => it(t.description, () => {
      t.assertions(mockStore())
    })

    test({
      description: `should return the expected transaction object with necessary data missing`,
      assertions: (store) => {
        assert.isNull(store.dispatch(action.constructFillOrderTransaction({})))
        // >>>>>>> 4098-new-contracts-merge
      },
    })

    test({
      description: `should return the expected transaction object with isMaker and type BUY`,
      assertions: (store) => {
        // <<<<<<< HEAD
        //         __RewireAPI__.__set__('loadDataForMarketTransaction', () => dispatch => ({
        //           description: 'testing'
        //         }))
        //         __RewireAPI__.__set__('constructMarketTransaction', sinon.stub().returns({
        //           type: MOCK_ACTION_TYPES.CONSTRUCT_MARKET_TRANSACTION
        //         }))

        //         store.dispatch(constructTransaction('payout', {}))

        //         const actual = store.getActions()

        //         const expected = [
        //           {
        //             type: MOCK_ACTION_TYPES.CONSTRUCT_MARKET_TRANSACTION
        //           }
        //         ]

        //         assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
        // =======
        const order = {
          transactionHash: '0xHASH',
          orderId: '0xORDERID',
          tradeGroupId: '0xTRADEGROUPID',
          price: '0.1',
          amount: '2',
          isMaker: true,
          orderType: TYPES.BUY,
          timestamp: 1491843278,
          blockNumber: 123456,
          gasFees: '0.001',
        }
        const marketId = '0xMARKETID'
        const marketType = BINARY
        const minPrice = '0'
        const maxPrice = '1'
        const settlementFee = '0.01'
        const description = 'test description'
        const outcomeId = '1'
        const status = 'testing'
        assert.deepEqual(store.dispatch(action.constructFillOrderTransaction(order, marketId, marketType, description, outcomeId, null, minPrice, maxPrice, settlementFee, status)), {
          '0xHASH-0xORDERID': {
            type: TYPES.MATCH_ASK,
            hash: '0xHASH',
            tradeGroupId: '0xTRADEGROUPID',
            status: 'testing',
            description: 'test description',
            data: {
              marketType: BINARY,
              outcomeName: '1',
              outcomeId: '1',
              marketId: '0xMARKETID',
            },
            message: 'sold 2 shares for 0.1050 ETH Tokens / share',
            numShares: formatShares('2'),
            noFeePrice: formatEtherTokens('0.1'),
            timestamp: formatDate(new Date(order.timestamp * 1000)),
            settlementFee: formatEtherTokens('0.01'),
            feePercent: formatPercent('4.761904761904762'),
            totalReturn: formatEtherTokens('0.19'),
            gasFees: formatEther('0.001'),
            avgPrice: formatEtherTokens('0.1'),
            totalCost: undefined,
            blockNumber: 123456,
          },
        })
        // >>>>>>> 4098-new-contracts-merge
      },
    })

    test({
      description: `should return the expected transaction object with isMaker and type SELL`,
      assertions: (store) => {
        // <<<<<<< HEAD
        //         __RewireAPI__.__set__('loadDataForMarketTransaction', () => dispatch => ({}))

        //         const actual = store.dispatch(constructTransaction('payout', {}))

        //         const expected = undefined

        //         assert.strictEqual(actual, expected, `Didn't return the expected value`)
        // =======
        const order = {
          transactionHash: '0xHASH',
          orderId: '0xORDERID',
          tradeGroupId: '0xTRADEGROUPID',
          price: '0.1',
          amount: '2',
          isMaker: true,
          orderType: TYPES.SELL,
          timestamp: 1491843278,
          blockNumber: 123456,
          gasFees: '0.001',
        }
        const marketId = '0xMARKETID'
        const marketType = BINARY
        const minPrice = '0'
        const maxPrice = '1'
        const settlementFee = '0.01'
        const description = 'test description'
        const outcomeId = '1'
        const status = 'testing'
        assert.deepEqual(store.dispatch(action.constructFillOrderTransaction(order, marketId, marketType, description, outcomeId, null, minPrice, maxPrice, settlementFee, status)), {
          '0xHASH-0xORDERID': {
            type: TYPES.MATCH_BID,
            hash: '0xHASH',
            tradeGroupId: '0xTRADEGROUPID',
            status: 'testing',
            description: 'test description',
            data: {
              marketType: BINARY,
              outcomeName: '1',
              outcomeId: '1',
              marketId: '0xMARKETID',
            },
            message: 'bought 2 shares for 0.0950 ETH Tokens / share',
            numShares: formatShares('2'),
            avgPrice: formatEtherTokens('0.1'),
            timestamp: formatDate(new Date(order.timestamp * 1000)),
            noFeePrice: formatEtherTokens('0.1'),
            totalCost: formatEtherTokens('0.21'),
            totalReturn: undefined,
            settlementFee: formatEtherTokens('0.01'),
            feePercent: formatPercent('4.761904761904762'),
            gasFees: formatEther('0.001'),
            blockNumber: 123456,
          },
        })
        // >>>>>>> 4098-new-contracts-merge
      },
    })

    test({
      description: `should return the expected transaction object with taker and type BUY`,
      assertions: (store) => {
        const order = {
          transactionHash: '0xHASH',
          orderId: '0xORDERID',
          tradeGroupId: '0xTRADEGROUPID',
          price: '0.1',
          amount: '2',
          isMaker: false,
          orderType: TYPES.BUY,
          timestamp: 1491843278,
          blockNumber: 123456,
          gasFees: '0.001',
        }
        const marketId = '0xMARKETID'
        const marketType = BINARY
        const minPrice = '0'
        const maxPrice = '1'
        const settlementFee = '0.01'
        const description = 'test description'
        const outcomeId = '1'
        const status = 'testing'
        assert.deepEqual(store.dispatch(action.constructFillOrderTransaction(order, marketId, marketType, description, outcomeId, null, minPrice, maxPrice, settlementFee, status)), {
          '0xHASH-0xORDERID': {
            type: TYPES.BUY,
            hash: '0xHASH',
            tradeGroupId: '0xTRADEGROUPID',
            status: 'testing',
            description: 'test description',
            data: {
              marketType: BINARY,
              outcomeName: '1',
              outcomeId: '1',
              marketId: '0xMARKETID',
            },
            message: 'bought 2 shares for 0.1050 ETH Tokens / share',
            numShares: formatShares('2'),
            avgPrice: formatEtherTokens('0.1'),
            noFeePrice: formatEtherTokens('0.1'),
            timestamp: formatDate(new Date(order.timestamp * 1000)),
            settlementFee: formatEtherTokens('0.01'),
            feePercent: formatPercent('4.761904761904762'),
            totalCost: formatEtherTokens('0.21'),
            totalReturn: undefined,
            gasFees: formatEther('0.001'),
            blockNumber: 123456,
          },
        })
      },
    })

    test({
      description: `should return the expected transaction object with taker and type TYPES.SELL`,
      assertions: (store) => {
        const order = {
          transactionHash: '0xHASH',
          orderId: '0xORDERID',
          tradeGroupId: '0xTRADEGROUPID',
          price: '0.1',
          amount: '2',
          isMaker: false,
          orderType: TYPES.SELL,
          timestamp: 1491843278,
          blockNumber: 123456,
          gasFees: '0.001',
        }
        const marketId = '0xMARKETID'
        const marketType = BINARY
        const minPrice = '0'
        const maxPrice = '1'
        const settlementFee = '0.01'
        const description = 'test description'
        const outcomeId = '1'
        const status = 'testing'
        assert.deepEqual(store.dispatch(action.constructFillOrderTransaction(order, marketId, marketType, description, outcomeId, null, minPrice, maxPrice, settlementFee, status)), {
          '0xHASH-0xORDERID': {
            type: TYPES.SELL,
            hash: '0xHASH',
            tradeGroupId: '0xTRADEGROUPID',
            status: 'testing',
            description: 'test description',
            data: {
              marketType: 'binary',
              outcomeName: '1',
              outcomeId: '1',
              marketId: '0xMARKETID',
            },
            message: 'sold 2 shares for 0.0950 ETH Tokens / share',
            numShares: formatShares('2'),
            avgPrice: formatEtherTokens('0.1'),
            noFeePrice: formatEtherTokens('0.1'),
            timestamp: formatDate(new Date(order.timestamp * 1000)),
            settlementFee: formatEtherTokens('0.01'),
            feePercent: formatPercent('4.761904761904762'),
            totalCost: undefined,
            totalReturn: formatEtherTokens('0.19'),
            gasFees: formatEther('0.001'),
            blockNumber: 123456,
          },
        })
      },
    })
  })

  describe('constructCreateOrderTransaction', () => {
    const action = require('../../../src/modules/transactions/actions/construct-transaction')

    const test = t => it(t.description, () => {
      const store = mockStore()
      t.assertions(store)
    })

    describe('related conditionals: order type', () => {
      let order = {
        transactionHash: '0xHASH',
        orderId: '0xORDERID',
        tradeGroupId: '0xTRADEGROUPID',
        price: '0.1',
        amount: '2',
        isMaker: false,
        orderType: TYPES.SELL,
        timestamp: 1491843278,
        blockNumber: 123456,
        gasFees: '0.001',
      }
      const marketId = '0xMARKETID'
      const marketType = BINARY
      const minPrice = '0'
      const maxPrice = '1'
      const settlementFee = '0.05'
      const description = 'test description'
      const outcomeId = '1'
      const status = 'testing'

      test({
        description: `BUY`,
        assertions: (store) => {
          order = {
            ...order,
            orderType: TYPES.BUY,
          }
          assert.deepEqual(store.dispatch(action.constructCreateOrderTransaction(order, marketId, marketType, description, outcomeId, null, minPrice, maxPrice, settlementFee, status)), {
            '0xHASH': {
              type: 'buy',
              status: 'testing',
              description: 'test description',
              data: {
                marketType: 'binary',
                outcomeName: '1',
                outcomeId: '1',
                marketId: '0xMARKETID',
              },
              message: 'bid 2 shares for 0.1250 ETH Tokens / share',
              numShares: formatShares('2'),
              avgPrice: formatEtherTokens('0.1'),
              noFeePrice: formatEtherTokens('0.1'),
              freeze: {
                noFeeCost: formatEtherTokens('0.2'),
                settlementFee: formatEtherTokens('0.05'),
                verb: 'froze',
              },
              timestamp: formatDate(new Date(order.timestamp * 1000)),
              hash: '0xHASH',
              feePercent: formatPercent('20'),
              totalCost: formatEtherTokens('0.25'),
              totalReturn: undefined,
              gasFees: formatEther('0.001'),
              blockNumber: 123456,
              orderId: '0xORDERID',
            },
          })
        },
      })

      test({
        description: `SELL`,
        assertions: (store) => {
          order = {
            ...order,
            orderType: TYPES.SELL,
          }
          assert.deepEqual(store.dispatch(action.constructCreateOrderTransaction(order, marketId, marketType, description, outcomeId, null, minPrice, maxPrice, settlementFee, status)), {
            '0xHASH': {
              type: TYPES.SELL,
              status: 'testing',
              description: 'test description',
              data: {
                marketType: BINARY,
                outcomeName: '1',
                outcomeId: '1',
                marketId: '0xMARKETID',
              },
              message: 'ask 2 shares for 0.0750 ETH Tokens / share',
              numShares: formatShares('2'),
              noFeePrice: formatEtherTokens('0.1'),
              avgPrice: formatEtherTokens('0.1'),
              freeze: {
                noFeeCost: undefined,
                settlementFee: formatEtherTokens('0.05'),
                verb: 'froze',
              },
              timestamp: formatDate(new Date(order.timestamp * 1000)),
              hash: '0xHASH',
              feePercent: formatPercent('20'),
              totalCost: undefined,
              totalReturn: formatEtherTokens('0.15'),
              gasFees: formatEther('0.001'),
              blockNumber: 123456,
              orderId: '0xORDERID',
            },
          })
        },
      })
    })
  })

  describe('constructCancelOrderTransaction', () => {
    const action = require('../../../src/modules/transactions/actions/construct-transaction')

    let trade = {
      transactionHash: '0xHASH',
      orderId: '0xORDERID',
      tradeGroupId: '0xTRADEGROUPID',
      price: '0.1',
      amount: '2',
      isMaker: false,
      orderType: TYPES.SELL,
      timestamp: 1491843278,
      blockNumber: 123456,
      gasFees: '0.001',
      inProgress: false,
      cashRefund: '10',
    }
    const marketId = '0xMARKETID'
    const marketType = BINARY
    const description = 'test description'
    const outcomeId = '1'
    const minPrice = '0'
    const maxPrice = '1'
    const status = 'testing'

    const test = t => it(t.description, () => {
      const store = mockStore()
      t.assertions(store)
    })

    test({
      description: `should return the expected object with inProgress false`,
      assertions: (store) => {
        const actual = store.dispatch(action.constructCancelOrderTransaction(trade, marketId, marketType, description, outcomeId, null, minPrice, maxPrice, status))

        const price = formatEtherTokens(trade.price)
        const shares = formatShares(trade.amount)

        const expected = {
          '0xHASH': {
            type: TYPES.CANCEL_ORDER,
            status,
            description,
            data: {
              order: {
                type: trade.orderType,
                shares,
              },
              marketType,
              outcome: {
                name: outcomeId,
              },
              outcomeId,
              marketId,
            },
            message: `canceled order to ${trade.orderType} ${shares.full} for ${price.full} each`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            hash: trade.transactionHash,
            totalReturn: formatEtherTokens(trade.cashRefund),
            gasFees: formatEther(trade.gasFees),
            blockNumber: trade.blockNumber,
            orderId: trade.orderId,
          },
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })

    test({
      description: `should return the expected object with inProgress false`,
      assertions: (store) => {
        trade = {
          ...trade,
          inProgress: true,
        }

        const actual = store.dispatch(action.constructCancelOrderTransaction(trade, marketId, marketType, description, outcomeId, null, minPrice, maxPrice, status))

        const price = formatEtherTokens(trade.price)
        const shares = formatShares(trade.amount)

        const expected = {
          '0xHASH': {
            type: TYPES.CANCEL_ORDER,
            status,
            description,
            data: {
              order: {
                type: trade.orderType,
                shares,
              },
              marketType,
              outcome: {
                name: outcomeId,
              },
              outcomeId,
              marketId,
            },
            message: `canceling order to ${trade.orderType} ${shares.full} for ${price.full} each`,
            numShares: shares,
            noFeePrice: price,
            avgPrice: price,
            timestamp: formatDate(new Date(trade.timestamp * 1000)),
            hash: trade.transactionHash,
            totalReturn: null,
            gasFees: formatEther(trade.gasFees),
            blockNumber: trade.blockNumber,
            orderId: trade.orderId,
          },
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })
  })

  describe('constructTradingTransaction', () => {
    const constructTransaction = require('../../../src/modules/transactions/actions/construct-transaction')

    constructTransaction.__set__('constructFillOrderTransaction', sinon.stub().returns({
      type: MOCK_ACTION_TYPES.CONSTRUCT_FILL_ORDER_TRANSACTION,
    }))
    constructTransaction.__set__('constructCreateOrderTransaction', sinon.stub().returns({
      type: MOCK_ACTION_TYPES.CONSTRUCT_CREATE_ORDER_TRANSACTION,
    }))
    constructTransaction.__set__('constructCancelOrderTransaction', sinon.stub().returns({
      type: MOCK_ACTION_TYPES.CONSTRUCT_CANCEL_ORDER_TRANSACTION,
    }))

    const test = t => it(t.description, () => {
      const store = mockStore(t.state)
      t.assertions(store)
    })

    test({
      description: `should dispatch the expected actions for label 'FillOrder'`,
      state: {
        marketsData: {
          '0xMARKETID': {},
        },
        outcomesData: {},
      },
      assertions: (store) => {
        store.dispatch(constructTransaction.constructTradingTransaction('FillOrder', {}, '0xMARKETID'))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.CONSTRUCT_FILL_ORDER_TRANSACTION,
          },
        ]

        assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
      },
    })

    test({
      description: `should dispatch the expected actions for label 'CreateOrder'`,
      state: {
        marketsData: {
          '0xMARKETID': {},
        },
        outcomesData: {},
      },
      assertions: (store) => {
        store.dispatch(constructTransaction.constructTradingTransaction('CreateOrder', {}, '0xMARKETID'))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.CONSTRUCT_CREATE_ORDER_TRANSACTION,
          },
        ]

        assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
      },
    })

    test({
      description: `should dispatch the expected actions for label 'CancelOrder'`,
      state: {
        marketsData: {
          '0xMARKETID': {},
        },
        outcomesData: {},
      },
      assertions: (store) => {
        store.dispatch(constructTransaction.constructTradingTransaction('CancelOrder', {}, '0xMARKETID'))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.CONSTRUCT_CANCEL_ORDER_TRANSACTION,
          },
        ]

        assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
      },
    })
  })
})
