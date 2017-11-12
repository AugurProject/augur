/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import MarketPositionsListPosition from 'modules/market/components/market-positions-list--position/market-positions-list--position'
import MarketPositionsListOrder from 'modules/market/components/market-positions-list--order/market-positions-list--order'
import NullStateMessage from 'modules/common/components/null-state-message/null-state-message'
import { Close } from 'modules/common/components/icons/icons'

import getValue from 'utils/get-value'

import Styles from 'modules/market/components/market-positions-list--mobile/market-positions-list--mobile.styles'

export default class MarketPositionsListMobile extends Component {
  static propTypes = {
    positions: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      isOpen: true,
    }

    this.calcAvgDiff = this.calcAvgDiff.bind(this)
  }

  calcAvgDiff(position, orders) {
    const p = this.props

    const currentAvg = +getValue(position, 'position.avgPrice.formatted') || 0
    const currentShares = +getValue(position, 'position.qtyShares.formatted') || 0

    let newAvg = currentAvg * currentShares
    let totalShares = currentShares

    orders.forEach(order => {
      const thisPrice = +(getValue(order, 'order.purchasePrice.formatted') || 0)
      const thisShares = +(getValue(order, 'order.qtyShares.formatted') || 0)

      newAvg += thisPrice * thisShares
      totalShares += thisShares
    })

    newAvg = newAvg / totalShares

    return (newAvg - currentAvg).toFixed(4)
  }

  render() {
    const s = this.state
    const p = this.props
    const pendingOrders = p.openOrders.filter(order => order.pending === true)
    const orderText = pendingOrders.length > 1 ? 'Orders' : 'Order'

    return (
      <section className={Styles.MarketPositionsListMobile}>
        { p.positions.length > 0 &&
          <div className={Styles.MarketPositionsListMobile__wrapper}>
            <h2>
              My Position
              { pendingOrders.length > 0 &&
                <span className={Styles.MarketPositionsListMobile__pending}>
                  { pendingOrders.length } Pending { orderText }
                </span>
              }
            </h2>
            <div className={Styles.MarketPositionsListMobile__positions}>
              <ul className={Styles.MarketPositionsListMobile__position}>
                <li>
                  <span>
                    QTY
                    { pendingOrders.length > 0 &&
                      <span className={Styles.MarketPositionsListMobile__pending}>
                        +{ pendingOrders.reduce((sum, order) => sum + +order.order.qtyShares.formatted, 0) }
                      </span>
                    }
                  </span>
                  { getValue(p.positions[0], 'position.qtyShares.formatted') }
                </li>
                <li>
                  <span>
                    AVG Price
                    { pendingOrders.length > 0 &&
                      <span className={Styles.MarketPositionsListMobile__pending}>
                        { this.calcAvgDiff(p.positions[0], pendingOrders) }
                      </span>
                    }
                  </span>
                  { getValue(p.positions[0], 'position.avgPrice.formatted') } ETH
                </li>
                <li>
                  <span>Unrealized P/L</span>
                  { getValue(p.positions[0], 'position.unrealizedNet.formatted') } ETH
                </li>
                <li>
                  <span>Realized P/L</span>
                  { getValue(p.positions[0], 'position.realizedNet.formatted') } ETH
                </li>
              </ul>
            </div>
          </div>
        }
        { p.openOrders.length > 0 &&
          <div className={Styles.MarketPositionsListMobile__wrapper}>
            <h2>Open Orders</h2>
            <div className={Styles.MarketPositionsListMobile__orders}>
              { p.openOrders.map(order => (
                <ul className={classNames(Styles.MarketPositionsListMobile__order, { [`${Styles.pending}`] : order.pending })}>
                  <li>QTY</li>
                  <li>{ getValue(order, 'order.qtyShares.formatted') }</li>
                  <li>Price</li>
                  <li>{ getValue(order, 'order.purchasePrice.formatted') }</li>
                  <li>
                    { !order.pending &&
                      <button className={Styles['MarketPositionsListMobile__close-order']}>{ Close }</button>
                    }
                  </li>
                </ul>
              )) }
            </div>
          </div>
        }
      </section>
    )
  }
}
