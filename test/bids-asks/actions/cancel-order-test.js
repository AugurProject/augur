import { describe, it, afterEach } from 'mocha'

import proxyquire from 'proxyquire'
import sinon from 'sinon'
import mocks from 'test/mockStore'
import { CANCEL_ORDER, BID, ASK } from 'modules/transactions/constants/types'

describe('modules/bids-asks/actions/cancel-order.js', () => {
  proxyquire.noPreserveCache().noCallThru()

  const { mockStore, actionCreator, state } = mocks
  const augur = {
    api: {
      CancelOrder: {
        cancelOrder: sinon.stub(),
      },
    },
  }
  const updateOrderStatus = actionCreator()
  const cancelOrderModule = proxyquire('../../../src/modules/bids-asks/actions/cancel-order', {
    '../../../services/augurjs': {
      augur,
    },
    '../../bids-asks/actions/update-order-status': { updateOrderStatus },
  })

  const store = mockStore({
    ...state,
    transactionsData: {
      cancelTxn: {
        type: CANCEL_ORDER,
        data: {
          order: {
            id: '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3',
            type: BID,
          },
          market: { id: 'testMarketId' },
          outcome: {},
        },
      },
    },
  })

  afterEach(() => {
    augur.api.CancelOrder.cancelOrder.reset()
    updateOrderStatus.reset()
    store.clearActions()
  })

  describe('cancelOrder', () => {
    it(`shouldn't dispatch if order doesn't exist`, () => {
      store.dispatch(cancelOrderModule.cancelOrder('nonExistingOrderId', 'testMarketId', BID))
      store.dispatch(cancelOrderModule.cancelOrder('0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3', 'nonExistingMarketId', BID))
      store.dispatch(cancelOrderModule.cancelOrder('0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3', 'testMarketId', ASK))

      assert.deepEqual(store.getActions(), [])
    })
  })
})
