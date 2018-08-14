import { connect } from 'react-redux'
import { NotificationBar } from 'src/modules/notification-bar/components/index'
import { selectUndissmissedOrphanedOrders } from 'src/modules/orphaned-orders/selectors'
import { dismissOrphanedOrder } from 'src/modules/orphaned-orders/actions'
import { selectMarket } from 'modules/market/selectors/market'

const mapStateToProps = (state) => {
  const notifications = selectUndissmissedOrphanedOrders(state)
  let market = null
  let marketsNumber = 1
  if (notifications.length === 1) {
    market = selectMarket(notifications[0].marketId)
  } else {
    const marketIds = notifications.map(notification => notification.marketId).filter((value, index, self) => self.indexOf(value) === index)
    marketsNumber = marketIds.length
  }
  return {
    notifications,
    market,
    marketsNumber,
  }
}

const mapDispatchToProps = dispatch => ({
  dismissFn: order => dispatch(dismissOrphanedOrder(order)),
})

export const NotificationBarContainer = connect(mapStateToProps, mapDispatchToProps)(NotificationBar)
