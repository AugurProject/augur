import OrphanedOrdersReducer from 'modules/orphaned-orders/reducers/orphaned-orders'
import {
  addOrphanedOrder,
  dismissOrphanedOrder,
  removeOrphanedOrder,
  cancelOrphanedOrder, __RewireAPI__ as cancelOrphanedOrderRequireAPI,
} from 'src/modules/orphaned-orders/actions'
import { RESET_STATE } from 'src/modules/app/actions/reset-state'

// I'm back door testing action creators here.
describe('src/modules/orphaned-orders/reducers/orphaned-orders.js', () => {
  describe('default state', () => {
    it('should be an empty array', () => {
      const actual = OrphanedOrdersReducer([], {})

      assert.isArray(actual)
      assert.isEmpty(actual)
    })
  })

  describe('ADD_ORPHANED_ORDER', () => {
    it('should push the data payload onto the state with an added dismissed property', () => {
      const action = addOrphanedOrder({ orderId: '12345' })
      const actual = OrphanedOrdersReducer([], action)
      assert.deepEqual(actual, [{
        dismissed: false,
        orderId: '12345',
      }])
    })

    it('should do nothing if an order exists with the same orderId', () => {
      // I'm back door testing action creators here.
      const action = addOrphanedOrder({ orderId: '12345', timestamp: 123456 })
      const actual = OrphanedOrdersReducer([{
        dismissed: false,
        orderId: '12345',
        timestamp: 123456,
      }], action)

      assert.deepEqual(actual, [{
        dismissed: false,
        orderId: '12345',
        timestamp: 123456,
      }])
    })
  })

  describe('DISMISS_ORPHANED_ORDER', () => {
    it('should set dismissed propert to true', () => {
      const actual = OrphanedOrdersReducer([{
        dismissed: false,
        orderId: '54321',
        timestamp: 123456,
      }, {
        dismissed: false,
        orderId: '12345',
        timestamp: 123456,
      }], dismissOrphanedOrder({ orderId: '12345' }))

      assert.deepEqual(actual, [{
        dismissed: false,
        orderId: '54321',
        timestamp: 123456,
      }, {
        dismissed: true,
        orderId: '12345',
        timestamp: 123456,
      }])
    })
  })

  describe('REMOVE_ORPHANED_ORDER', () => {
    it('should filter out anything with a matching orderId', () => {
      const action = removeOrphanedOrder('12345')
      const actual = OrphanedOrdersReducer([{
        dismissed: false,
        orderId: '12345',
      }], action)

      assert.deepEqual(actual, [])
    })
  })

  describe('RESET_STATE', () => {
    it('should return to the default state', () => {
      const actual = OrphanedOrdersReducer([{
        dismissed: false,
        orderId: '12345',
      }], {
        type: RESET_STATE,
      })

      assert.deepEqual(actual, [])
    })
  })

  describe('CANCEL_ORDER', () => {
    it('should return to the default state', () => {
      cancelOrphanedOrderRequireAPI.__Rewire__('selectCurrentTimestampInSeconds', () => {})
      cancelOrphanedOrderRequireAPI.__Rewire__('augur', {
        api: {
          CancelOrder: () => {
          },
        },
      })
      cancelOrphanedOrder({ orderId: '12345' }, (actual) => {
        assert.deepEqual(actual, [])
      })
    })
  })
})
