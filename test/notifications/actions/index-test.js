import * as updateNotifications from 'modules/notifications/actions'
import * as notificationLevels from 'src/modules/notifications/constants'

describe('modules/notifications/actions/update-notifications', () => {
  describe('addNotification', () => {
    it('should return nothing when the notifications param is null/undefined', () => {
      const actual = updateNotifications.addNotification()
      const expected = undefined

      assert.strictEqual(actual, expected, `Didn't return the expected result`)
    })

    it('should return the expected object when a notification is passed in', () => {
      const actual = updateNotifications.addNotification({})

      const expected = {
        type: updateNotifications.ADD_NOTIFICATION,
        data: {
          notification: {
            level: notificationLevels.INFO,
            seen: false,
          },
        },
      }

      assert.deepEqual(actual, expected, `Didn't return the expected result`)
    })

    it("should default notification level to the 'INFO' constant", () => {
      const actual = updateNotifications.addNotification({})
      assert.equal(actual.data.notification.level, notificationLevels.INFO)
    })

    it('should override the default notification level with the value passed in the notification object param', () => {
      const actual = updateNotifications.addNotification({
        level: notificationLevels.CRITICAL,
      })
      assert.equal(actual.data.notification.level, notificationLevels.CRITICAL)
    })
  })

  describe('removeNotification', () => {
    it('should return the expected object', () => {
      const actual = updateNotifications.removeNotification(1)

      const expected = {
        type: updateNotifications.REMOVE_NOTIFICATION,
        data: 1,
      }

      assert.deepEqual(actual, expected, `Didn't return the expected object`)
    })
  })

  describe('updateNotification', () => {
    it('should should return the expected object', () => {
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
    })
  })

  describe('clearNotifications', () => {
    it('should return the expected object', () => {
      const actual = updateNotifications.clearNotifications()

      const expected = {
        type: updateNotifications.CLEAR_NOTIFICATIONS,
        data: {
          level: notificationLevels.INFO,
        },
      }
      assert.deepEqual(actual, expected, `Didn't return the expected object`)
    })

    describe('notificationLevel', () => {
      it("should default to the 'INFO' constant", () => {
        const actual = updateNotifications.clearNotifications()
        assert.equal(actual.data.level, notificationLevels.INFO)
      })

      it('should pass notificationLevel', () => {
        const actual = updateNotifications.clearNotifications(notificationLevels.CRITICAL)
        assert.equal(actual.data.level, notificationLevels.CRITICAL)
      })
    })
  })
})
