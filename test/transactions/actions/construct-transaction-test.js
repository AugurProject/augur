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

import { formatEther, formatPercent, formatRep, formatShares } from 'utils/format-number'
import { formatDate } from 'utils/format-date'

import {
  constructBasicTransaction,
  constructDefaultTransaction,
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
    CONSTRUCT_CLAIM_TRADING_PROCEEDS_TRANSACTION: 'CONSTRUCT_CLAIM_TRADING_PROCEEDS_TRANSACTION',
    CONSTRUCT_MARKET_TRANSACTION: 'CONSTRUCT_MARKET_TRANSACTION',
    CONSTRUCT_REPORTING_TRANSACTION: 'CONSTRUCT_REPORTING_TRANSACTION',
  }

  describe('loadDataForMarketTransaction', () => {
    const action = proxyquire('../../../src/modules/transactions/actions/construct-transaction', {
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
        const callback = () => {}

        store.dispatch(action.loadDataForMarketTransaction(label, log, callback))

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
        const callback = () => ({
          type: MOCK_ACTION_TYPES.CALLBACK,
        })

        const actual = store.dispatch(action.loadDataForMarketTransaction(label, log, callback))

        const expected = {
          description: 'market is loaded',
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
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

        const actual = store.dispatch(constructBasicTransaction(hash, null, null, null, status))

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


        const actual = store.dispatch(constructBasicTransaction(hash, blockNumber, timestamp, gasFees, status))

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
          marketCreationFee: formatEther(log.marketCreationFee),
          bond: {
            label: 'validity',
            value: formatEther(log.validityBond),
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
          marketCreationFee: formatEther(log.marketCreationFee),
          bond: {
            label: 'validity',
            value: formatEther(log.validityBond),
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
                change: formatEther(log.payoutTokens, { positiveSign: true }),
                balance: formatEther(log.tokenBalance),
              },
            ],
          },
          type: 'Claim Trading Payout',
          description: 'test description',
          message: `closed out ${formatShares(log.shares).full}`,
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
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
      },
    })

    test({
      description: `should return the expected transaction object with isMaker and type BUY`,
      assertions: (store) => {
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
            message: 'sold 2 shares for 0.1050 ETH / share',
            numShares: formatShares('2'),
            noFeePrice: formatEther('0.1'),
            timestamp: formatDate(new Date(order.timestamp * 1000)),
            settlementFee: formatEther('0.01'),
            feePercent: formatPercent('4.761904761904762'),
            totalReturn: formatEther('0.19'),
            gasFees: formatEther('0.001'),
            avgPrice: formatEther('0.1'),
            totalCost: undefined,
            blockNumber: 123456,
          },
        })
      },
    })

    test({
      description: `should return the expected transaction object with isMaker and type SELL`,
      assertions: (store) => {
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
            message: 'bought 2 shares for 0.0950 ETH / share',
            numShares: formatShares('2'),
            avgPrice: formatEther('0.1'),
            timestamp: formatDate(new Date(order.timestamp * 1000)),
            noFeePrice: formatEther('0.1'),
            totalCost: formatEther('0.21'),
            totalReturn: undefined,
            settlementFee: formatEther('0.01'),
            feePercent: formatPercent('4.761904761904762'),
            gasFees: formatEther('0.001'),
            blockNumber: 123456,
          },
        })
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
            message: 'bought 2 shares for 0.1050 ETH / share',
            numShares: formatShares('2'),
            avgPrice: formatEther('0.1'),
            noFeePrice: formatEther('0.1'),
            timestamp: formatDate(new Date(order.timestamp * 1000)),
            settlementFee: formatEther('0.01'),
            feePercent: formatPercent('4.761904761904762'),
            totalCost: formatEther('0.21'),
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
            message: 'sold 2 shares for 0.0950 ETH / share',
            numShares: formatShares('2'),
            avgPrice: formatEther('0.1'),
            noFeePrice: formatEther('0.1'),
            timestamp: formatDate(new Date(order.timestamp * 1000)),
            settlementFee: formatEther('0.01'),
            feePercent: formatPercent('4.761904761904762'),
            totalCost: undefined,
            totalReturn: formatEther('0.19'),
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
              message: 'bid 2 shares for 0.1250 ETH / share',
              numShares: formatShares('2'),
              avgPrice: formatEther('0.1'),
              noFeePrice: formatEther('0.1'),
              freeze: {
                noFeeCost: formatEther('0.2'),
                settlementFee: formatEther('0.05'),
                verb: 'froze',
              },
              timestamp: formatDate(new Date(order.timestamp * 1000)),
              hash: '0xHASH',
              feePercent: formatPercent('20'),
              totalCost: formatEther('0.25'),
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
              message: 'ask 2 shares for 0.0750 ETH / share',
              numShares: formatShares('2'),
              noFeePrice: formatEther('0.1'),
              avgPrice: formatEther('0.1'),
              freeze: {
                noFeeCost: undefined,
                settlementFee: formatEther('0.05'),
                verb: 'froze',
              },
              timestamp: formatDate(new Date(order.timestamp * 1000)),
              hash: '0xHASH',
              feePercent: formatPercent('20'),
              totalCost: undefined,
              totalReturn: formatEther('0.15'),
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

        const price = formatEther(trade.price)
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
            totalReturn: formatEther(trade.cashRefund),
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

        const price = formatEther(trade.price)
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
