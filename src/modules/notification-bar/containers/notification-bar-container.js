import { connect } from 'react-redux'
import { NotificationBar } from 'src/modules/notification-bar/components/index'
import { selectOrphanOrders } from 'src/select-state'
import { cancelOrphanedOrder } from 'src/modules/orphaned-orders/actions'

const mapStateToProps = state => ({
  notifications: selectOrphanOrders(state),
})

const mapDispatchToProps = dispatch => ({
  actionFn: order => dispatch(cancelOrphanedOrder(order)),
})

export const NotificationBarContainer = connect(mapStateToProps, mapDispatchToProps)(NotificationBar)
