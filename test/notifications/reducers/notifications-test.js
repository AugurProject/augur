import * as notificationLevels from 'src/modules/notifications/constants'

import {
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  UPDATE_NOTIFICATION,
  CLEAR_NOTIFICATIONS,
} from 'modules/notifications/actions'

import notifications from 'modules/notifications/reducers/notifications'

describe('modules/notifications/reducers/notifications', () => {
  it('should return the default state', () => {
    const actual = notifications(undefined, {})
    const expected = []
    assert.deepEqual(actual, expected, `Didn't return the expected array`)

  })

  it('should return the expected array for type ADD_NOTIFICATION', () => {
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
  })

  it('should return non dup array for type ADD_NOTIFICATION', () => {
    const actual = notifications([
      {
        id: '0xTEST',
      },
    ], {
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
  })

  it('should return the expected array for type REMOVE_NOTIFICATION', () => {
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

  })

  it('should return the expected array for type UPDATE_NOTIFICATION', () => {
    const actual = notifications([
      {
        id: '0xTEST0',
      },
      {
        id: '0xTest1',
        seen: true,
        title: 'old object',
      },
    ], {
      type: UPDATE_NOTIFICATION,
      data: {
        id: '0xTest1',
        notification: {
          seen: false,
          title: 'new object',
        },
      },
    })

    const expected = [
      {
        id: '0xTEST0',
      },
      {
        id: '0xTest1',
        seen: false,
        title: 'new object',
      },
    ]

    assert.deepEqual(actual, expected, `Didn't return the expected array`)
  })

  describe('CLEAR_NOTIFICATIONS action', () => {
    it('should remove items with the passed notification level.', () => {
      const actual = notifications([
        {
          id: '0xTEST0',
          level: notificationLevels.INFO,
        },
        {
          id: '0xTEST1',
          level: notificationLevels.CRITICAL,
        },
      ], {
        type: CLEAR_NOTIFICATIONS,
        data: {
          level: notificationLevels.INFO,
        },
      })

      const expected = [{
        id: '0xTEST1',
        level: notificationLevels.CRITICAL,
      }]

      assert.deepEqual(actual, expected, `Didn't return the expected array`)
    })
  })
})
