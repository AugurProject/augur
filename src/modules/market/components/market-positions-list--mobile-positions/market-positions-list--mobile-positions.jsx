import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import getValue from 'utils/get-value'

import Styles from 'modules/market/components/market-positions-list--mobile-positions/market-positions-list--mobile-positions.styles'
import CommonStyles from 'modules/market/components/market-positions-list--mobile/market-positions-list--mobile.styles'

export default class MobilePositions extends Component {
  static propTypes = {
    position: PropTypes.object.isRequired,
    pendingOrders: PropTypes.array.isRequired,
  }

  static calcAvgDiff(position, orders) {
    const currentAvg = getValue(position, 'position.avgPrice.formattedValue') || 0
    const currentShares = getValue(position, 'position.qtyShares.formattedValue') || 0

    let newAvg = currentAvg * currentShares
    let totalShares = currentShares

    orders.forEach((order) => {
      const thisPrice = (getValue(order, 'order.purchasePrice.formattedValue') || 0)
      const thisShares = (getValue(order, 'order.qtyShares.formattedValue') || 0)

      newAvg += thisPrice * thisShares
      totalShares += thisShares
    })

    newAvg /= totalShares
    const avgDiff = (newAvg - currentAvg).toFixed(4)

    return avgDiff < 0 ? avgDiff : `+${avgDiff}`
  }

  constructor(props) {
    super(props)

    this.state = {
      showConfirm: false,
    }
  }

  render() {
    const {
      pendingOrders,
      position,
    } = this.props
    const s = this.state

    const orderText = pendingOrders.length > 1 ? 'Orders' : 'Order'

    return (
      <div className={CommonStyles.MarketPositionsListMobile__wrapper}>
        <div className={Styles.MobilePositions__header}>
          <h2 className={CommonStyles.MarketPositionsListMobile__heading}>
              My Position
            { pendingOrders.length > 0 &&
            <span className={Styles.MobilePositions__pending}>
              { pendingOrders.length } Pending { orderText }
            </span>
            }
          </h2>
          <button
            className={Styles.MobilePositions__close}
            onClick={e => this.setState({ showConfirm: !s.showConfirm })}
          >Close
          </button>
        </div>
        <div className={Styles.MobilePositions__positions}>
          <ul className={Styles.MobilePositions__position}>
            <li>
              <span>
                QTY
                { pendingOrders.length > 0 &&
                  <span className={Styles.MobilePositions__pending}>
                    +{ pendingOrders.reduce((sum, order) => sum + +order.order.qtyShares.formatted, 0) }
                  </span>
                }
              </span>
              { getValue(this.props, 'position.position.qtyShares.formatted') }
            </li>
            <li>
              <span>
                AVG Price
                { pendingOrders.length > 0 &&
                  <span className={Styles.MobilePositions__pending}>
                    { MobilePositions.calcAvgDiff(position, pendingOrders) }
                  </span>
                }
              </span>
              { getValue(this.props, 'position.position.avgPrice.formatted') } ETH
            </li>
            <li>
              <span>Unrealized P/L</span>
              { getValue(this.props, 'position.position.unrealizedNet.formatted') } ETH
            </li>
            <li>
              <span>Realized P/L</span>
              { getValue(this.props, 'position.position.realizedNet.formatted') } ETH
            </li>
          </ul>
        </div>
        <div className={classNames(Styles.MobilePositions__confirm, { [`${Styles['is-open']}`]: s.showConfirm })}>
          { pendingOrders.length > 0 ?
            <div className={classNames(Styles['MobilePositions__confirm-details'], Styles.pending)}>
              <p>Positions cannot be closed while orders are pending.</p>
              <div className={Styles['MobilePositions__confirm-options']}>
                <button onClick={e => this.setState({ showConfirm: !s.showConfirm })}>Ok</button>
              </div>
            </div>
            :
            <div className={Styles['MobilePositions__confirm-details']}>
              <h3>Close Position?</h3>
              <p>This will sell your { getValue(this.props, 'position.position.qtyShares.formatted') } shares of &ldquo;{ getValue(this.props, 'position.name') }&rdquo; at market rate.</p>
              <div className={Styles['MobilePositions__confirm-options']}>
                <button onClick={e => this.setState({ showConfirm: !s.showConfirm })}>No</button>
                <button onClick={(e) => { position.position.closePosition(); this.setState({ showConfirm: !s.showConfirm }) }}>Yes</button>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}
