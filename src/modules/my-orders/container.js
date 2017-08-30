import { connect } from 'react-redux'

import MyOrders from 'modules/my-orders/components/my-orders'

import getUserOpenOrders from 'modules/user-open-orders/selectors/open-orders'

const mapStateToProps = state => ({
  orders: getUserOpenOrders()
})

const Orders = connect(mapStateToProps)(MyOrders)

export default Orders
