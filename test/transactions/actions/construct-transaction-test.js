
import chai, { assert } from 'chai'
import chaiSubset from 'chai-subset'
import proxyquire from 'proxyquire'
import BigNumber from 'bignumber.js'
import { strip0xPrefix } from 'speedomatic'
import * as TYPES from 'modules/transactions/constants/types'
import { formatEther, formatRep, formatShares } from 'utils/format-number'
import { formatDate } from 'utils/format-date'
import {
  constructBasicTransaction,
  constructDefaultTransaction,
  constructApprovalTransaction,
  constructTransferTransaction,
} from 'modules/transactions/actions/construct-transaction'

chai.use(chaiSubset)

describe('modules/transactions/actions/construct-transaction.js', () => {
  proxyquire.noPreserveCache()

  describe('constructBasicTransaction', () => {
    const test = t => it(t.description, () => t.assertions())
    test({
      description: 'should return the expected object with all arguments passed',
      assertions: () => {
        const hash = '0xHASH'
        const status = 'status'
        const blockNumber = 123456
        const timestamp = 1491843278
        const gasFees = 0.001
        const actual = constructBasicTransaction(hash, blockNumber, timestamp, gasFees, status)
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
                change: formatRep(new BigNumber(log._value, 10).negated(), { positiveSign: true }),
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
                change: formatRep(new BigNumber(log._value, 10).negated(), { positiveSign: true }),
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
        const description = 'test description'
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
        const description = 'test description'
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
          type: TYPES.CLAIM_TRADING_PROCEEDS,
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
          type: TYPES.CLAIM_TRADING_PROCEEDS,
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
          type: TYPES.CLAIM_TRADING_PROCEEDS,
          description: 'test description',
          message: `closed out ${formatShares(log.shares).full}`,
        }
        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })
  })
})
