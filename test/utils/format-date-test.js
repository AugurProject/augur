

import { dateHasPassed, formatDate, getDaysRemaining, convertUnixToFormattedDate } from 'utils/format-date'

describe('utils/format-date', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `should return false`,
    assertions: () => {
      const currenUtcOffset = (new Date(1521489481).getTimezoneOffset() / 60) * -1
      const actual = formatDate(new Date(1521489481)).utcLocalOffset

      assert.strictEqual(actual, currenUtcOffset, `didn't return ` + currenUtcOffset + ` as expected`)
    },
  })

  test({
    description: `should return false`,
    assertions: () => {
      const actual = dateHasPassed(1522798696889, 11111111)

      assert.strictEqual(actual, true, `didn't return true as expected`)
    },
  })

  test({
    description: `should return a trimmed string`,
    assertions: () => {
      const actual = dateHasPassed(1522798696889, 999999999999999)

      assert.strictEqual(actual, false, `didn't return false as expected`)
    },
  })

  test({
    description: `days remaining should be 0`,
    assertions: () => {
      const actual = getDaysRemaining(11111, 11111)

      assert.strictEqual(actual, 0, `didn't return 0 as expected`)
    },
  })

  test({
    description: `end before start should return 0`,
    assertions: () => {
      const actual = getDaysRemaining(11111, 99999)

      assert.strictEqual(actual, 0, `didn't return 0 as expected`)
    },
  })

  test({
    description: `start time null should return 0`,
    assertions: () => {
      const actual = getDaysRemaining(null, 99999)

      assert.strictEqual(actual, 0, `didn't return 0 as expected`)
    },
  })

  test({
    description: `end time null should return 0`,
    assertions: () => {
      const actual = getDaysRemaining(99999, null)

      assert.strictEqual(actual, 0, `didn't return 0 as expected`)
    },
  })

  test({
    description: `days should be floored`,
    assertions: () => {
      const actual = getDaysRemaining(1520300344, 1519849696)

      assert.strictEqual(actual, 5, `didn't return 5 as expected`)
    },
  })

  test({
    description: `days should be floored to fake today`,
    assertions: () => {
      const actual = getDaysRemaining(1520300344, formatDate(new Date(1519849696000)).timestamp)

      assert.strictEqual(actual, 5, `didn't return 5 as expected`)
    },
  })

  test({
    description: `current time after end time return 0`,
    assertions: () => {
      const actual = getDaysRemaining(1520300344, 1520300300)

      assert.strictEqual(actual, 0, `didn't return 0 as expected`)
    },
  })

  test({
    description: `given timestamp does format correct`,
    assertions: () => {
      const timestamp = 1520300344
      const dateTime = 'March 6, 2018 1:39 AM'
      const actual = convertUnixToFormattedDate(1520300344)

      assert.strictEqual(actual.formatted, dateTime, `didn't get correct format`)
      assert.strictEqual(actual.timestamp, timestamp, `didn't get correct timestamp`)
    },
  })

})
