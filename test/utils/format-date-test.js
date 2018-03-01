import { describe, it } from 'mocha'
import { assert } from 'chai'
import sinon from 'sinon'

import { dateHasPassed, getDaysRemaining } from 'utils/format-date'

describe('utils/format-date', () => {
  const test = t => it(t.description, () => t.assertions())
  let clock

  afterEach(() => {
    if (clock !== undefined) clock.restore()
  })

  test({
    description: `should return false`,
    assertions: () => {
      const actual = dateHasPassed(11111111)

      assert.strictEqual(actual, true, `didn't return true as expected`)
    },
  })

  test({
    description: `should return a trimmed string`,
    assertions: () => {
      const actual = dateHasPassed(999999999999999)

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
    description: `end time null should return 0`,
    assertions: () => {
      const actual = getDaysRemaining(null, 99999)

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
      clock = sinon.useFakeTimers(new Date(1519849696000))
      const actual = getDaysRemaining(1520300344)

      assert.strictEqual(actual, 5, `didn't return 5 as expected`)
    },
  })

  test({
    description: `current time after end time return 0`,
    assertions: () => {
      clock = sinon.useFakeTimers(new Date(1539849696000))
      const actual = getDaysRemaining(1520300344)

      assert.strictEqual(actual, 0, `didn't return 0 as expected`)
    },
  })
})
