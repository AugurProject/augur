

import {
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  UPDATE_NOTIFICATION,
  CLEAR_NOTIFICATIONS,
} from 'modules/notifications/actions/update-notifications'

import notifications from 'modules/notifications/reducers/notifications'

describe('modules/notifications/reducers/notifications', () => {
  const test = (t) => {
    it(t.description, () => {
      t.assertions()
    })
  }

  test({
    description: `should return the default state`,
    assertions: () => {
      const actual = notifications(undefined, {})
      const expected = []
      assert.deepEqual(actual, expected, `Didn't return the expected array`)
    },
  })

  test({
    description: `should return the expected array for type ADD_NOTIFICATION`,
    assertions: () => {
      const actual = notifications([], {
        type: ADD_NOTIFICATION,
        data: {
          notification: {
            id: '0xTEST',
          },
        },
      })
      const expected = [
        {
          id: '0xTEST',
        },
      ]
      assert.deepEqual(actual, expected, `Didn't return the expected array`)
    },
  })

  test({
    description: `should return the expected array for type REMOVE_NOTIFICATION`,
    assertions: () => {
      const actual = notifications([
        {
          id: '0xTEST',
        },
      ], {
        type: REMOVE_NOTIFICATION,
        data: '0xTEST',
      })

      const expected = []

      assert.deepEqual(actual, expected, `Didn't return the expected array`)
    },
  })

  test({
    description: `should return the expected array for type UPDATE_NOTIFICATION`,
    assertions: () => {
      const actual = notifications([
        {
          id: '0xTEST0',
        },
        {
          id: '0xTest1',
          testing: 'old object',
        },
      ], {
        type: UPDATE_NOTIFICATION,
        data: {
          id: '0xTest1',
          notification: {
            testing: 'new object',
          },
        },
      })

      const expected = [
        {
          id: '0xTEST0',
        },
        {
          id: '0xTest1',
          testing: 'new object',
        },
      ]

      assert.deepEqual(actual, expected, `Didn't return the expected array`)
    },
  })

  test({
    description: `should return the expected array for type CLEAR_NOTIFICATIONS`,
    assertions: () => {
      const actual = notifications([
        {
          id: '0xTEST',
        },
      ], {
        type: CLEAR_NOTIFICATIONS,
      })

      const expected = []

      assert.deepEqual(actual, expected, `Didn't return the expected array`)
    },
  })
})
