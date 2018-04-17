

import * as views from 'modules/routes/constants/views'

describe('modules/app/constants/views', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `should return the expected value 'DEFAULT_VIEW'`,
    assertions: () => {
      const expected = 'categories'

      assert.strictEqual(views.DEFAULT_VIEW, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `should return the expected value 'M'`,
    assertions: () => {
      const expected = 'market'

      assert.strictEqual(views.MARKET, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `should return the expected value 'MARKETS'`,
    assertions: () => {
      const expected = 'markets'

      assert.strictEqual(views.MARKETS, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `should return the expected value 'CREATE_MARKET'`,
    assertions: () => {
      const expected = 'create-market'

      assert.strictEqual(views.CREATE_MARKET, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `should return the expected value 'TRANSACTIONS'`,
    assertions: () => {
      const expected = 'transactions'

      assert.strictEqual(views.TRANSACTIONS, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `should return the expected value 'ACCOUNT'`,
    assertions: () => {
      const expected = 'account'

      assert.strictEqual(views.ACCOUNT, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `should return the expected value 'AUTHENTICATION'`,
    assertions: () => {
      const expected = 'authentication'

      assert.strictEqual(views.AUTHENTICATION, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `should return the expected value 'CATEGORIES'`,
    assertions: () => {
      const expected = 'categories'

      assert.strictEqual(views.CATEGORIES, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `should return the expected value 'AUTH_LOGIN'`,
    assertions: () => {
      const expected = 'authentication'

      assert.strictEqual(views.AUTHENTICATION, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `should return the expected value 'MY_POSITIONS'`,
    assertions: () => {
      const expected = 'my-positions'

      assert.strictEqual(views.MY_POSITIONS, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `should return the expected value 'MY_MARKETS'`,
    assertions: () => {
      const expected = 'my-markets'

      assert.strictEqual(views.MY_MARKETS, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `should return the expected value 'REPORTING'`,
    assertions: () => {
      const expected = 'reporting'

      assert.strictEqual(views.REPORTING, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `should return the expected value 'MARKET_DATA_NAV_OUTCOMES'`,
    assertions: () => {
      const expected = 'outcomes'

      assert.strictEqual(views.MARKET_DATA_NAV_OUTCOMES, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `should return the expected value 'MARKET_DATA_ORDERS'`,
    assertions: () => {
      const expected = 'orders'

      assert.strictEqual(views.MARKET_DATA_ORDERS, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `should return the expected value 'MARKET_DATA_NAV_CHARTS'`,
    assertions: () => {
      const expected = 'charts'

      assert.strictEqual(views.MARKET_DATA_NAV_CHARTS, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `should return the expected value 'MARKET_DATA_NAV_DETAILS'`,
    assertions: () => {
      const expected = 'details'

      assert.strictEqual(views.MARKET_DATA_NAV_DETAILS, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `should return the expected value 'MARKET_DATA_NAV_REPORT'`,
    assertions: () => {
      const expected = 'report'

      assert.strictEqual(views.MARKET_DATA_NAV_REPORT, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `should return the expected value 'MARKET_DATA_NAV_SNITCH'`,
    assertions: () => {
      const expected = 'snitch'

      assert.strictEqual(views.MARKET_DATA_NAV_SNITCH, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `should return the expected value 'MARKET_USER_DATA_NAV_POSITIONS'`,
    assertions: () => {
      const expected = 'positions'

      assert.strictEqual(views.MARKET_USER_DATA_NAV_POSITIONS, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `should return the expected value 'MARKET_USER_DATA_NAV_OPEN_ORDERS'`,
    assertions: () => {
      const expected = 'open-orders'

      assert.strictEqual(views.MARKET_USER_DATA_NAV_OPEN_ORDERS, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `should return the expected value 'ACCOUNT_DEPOSIT'`,
    assertions: () => {
      const expected = 'deposit-funds'

      assert.strictEqual(views.ACCOUNT_DEPOSIT, expected, `didn't return the expected string`)
    },
  })

  test({
    description: `should return the expected value 'ACCOUNT_TRANSFER'`,
    assertions: () => {
      const expected = 'transfer-funds'

      assert.strictEqual(views.ACCOUNT_TRANSFER, expected, `didn't return the expected string`)
    },
  })
})
