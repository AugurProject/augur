

import * as updateNotifications from 'modules/notifications/actions/update-notifications'

describe('modules/notifications/actions/update-notifications', () => {
  const test = (t) => {
    it(t.description, () => {
      t.assertions()
    })
  }

  describe('addNotification', () => {
    test({
      description: `should return nothing when the notifications param is null/undefined`,
      assertions: () => {
        const actual = updateNotifications.addNotification()
        const expected = undefined

        assert.strictEqual(actual, expected, `Didn't return the expected result`)
      },
    })

    test({
      description: `should return the expected object when a notification is passed in`,
      assertions: () => {
        const actual = updateNotifications.addNotification({})

        const expected = {
          type: updateNotifications.ADD_NOTIFICATION,
          data: {
            notification: {
              seen: false,
            },
          },
        }

        assert.deepEqual(actual, expected, `Didn't return the expected result`)
      },
    })
  })

  describe('removeNotification', () => {
    test({
      description: `should return the expected object`,
      assertions: () => {
        const actual = updateNotifications.removeNotification(1)

        const expected = {
          type: updateNotifications.REMOVE_NOTIFICATION,
          data: 1,
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })
  })

  describe('updateNotification', () => {
    test({
      description: `should return the expected object`,
      assertions: () => {
        const actual = updateNotifications.updateNotification(1, {
          testing: 'test',
        })

        const expected = {
          type: updateNotifications.UPDATE_NOTIFICATION,
          data: {
            id: 1,
            notification: {
              testing: 'test',
            },
          },
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })
  })

  describe('clearNotifications', () => {
    test({
      description: `should return the expected object`,
      assertions: () => {
        const actual = updateNotifications.clearNotifications()

        const expected = {
          type: updateNotifications.CLEAR_NOTIFICATIONS,
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })
  })
})
