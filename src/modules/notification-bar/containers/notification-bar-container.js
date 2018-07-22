import { connect } from 'react-redux'
import { NotificationBar } from 'src/modules/notification-bar/components/index'
import { selectUndissmissedOrphanedOrders } from 'src/modules/orphaned-orders/selectors'
import { cancelOrphanedOrder, dismissOrphanedOrder } from 'src/modules/orphaned-orders/actions'

const mapStateToProps = state => ({
  notifications: selectUndissmissedOrphanedOrders(state),
})

const mapDispatchToProps = dispatch => ({
  actionFn: order => dispatch(cancelOrphanedOrder(order)),
  dismissFn: order => dispatch(dismissOrphanedOrder(order)),
})

export const NotificationBarContainer = connect(mapStateToProps, mapDispatchToProps)(NotificationBar)
