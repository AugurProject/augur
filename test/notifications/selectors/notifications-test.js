

import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import proxyquire from 'proxyquire'

describe('modules/notifications/selectors/notifications', () => {
  proxyquire.noPreserveCache().noCallThru()

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const test = t => it(t.description, () => {
    const store = mockStore(t.state)
    t.assertions(store)
  })

  test({
    description: `should call the expected function`,
    assertions: (store) => {
      const notifications = require('modules/notifications/selectors/notifications')

      notifications.__RewireAPI__.__Rewire__('selectNotificationsAndSeenCount', () => 'selectNotificationsAndSeenCount')

      const actual = notifications.default()
      const expected = 'selectNotificationsAndSeenCount'

      assert.strictEqual(actual, expected, `Didn't call the expected method`)
    },
  })

  describe('selectNotificationsAndSeenCount', () => {
    test({
      description: `should return the expected object`,
      state: {
        notifications: [
          {
            seen: false,
            id: '0xTEST0',
            timestamp: 1,
          },
          {
            seen: true,
            id: '0xTEST1',
            timestamp: 3,
          },
          {
            seen: false,
            id: '0xTEST2',
            timestamp: 2,
          },
        ],
      },
      assertions: (store) => {
        const { selectNotificationsAndSeenCount } = require('modules/notifications/selectors/notifications')

        const actual = selectNotificationsAndSeenCount(store.getState())

        const expected = {
          unseenCount: 2,
          notifications: [
            {
              seen: true,
              id: '0xTEST1',
              timestamp: 3,
              index: 1,
            },
            {
              seen: false,
              id: '0xTEST2',
              timestamp: 2,
              index: 2,
            },
            {
              seen: false,
              id: '0xTEST0',
              timestamp: 1,
              index: 0,
            },
          ],
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })
  })
})
