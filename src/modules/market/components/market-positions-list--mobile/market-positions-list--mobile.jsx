/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import MarketPositionsListPosition from 'modules/market/components/market-positions-list--position/market-positions-list--position'
import MarketPositionsListOrder from 'modules/market/components/market-positions-list--order/market-positions-list--order'
import NullStateMessage from 'modules/common/components/null-state-message/null-state-message'

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

  calcAvgDiff() {
    const p = this.props

    const currentAvg = +getValue(p.positions[0], 'position.avgPrice.formatted') || 0
    const currentShares = +getValue(p.positions[0], 'position.qtyShares.formatted') || 0

    let newAvg = currentAvg * currentShares
    let totalShares = currentShares

    p.openOrders.forEach(order => {
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
    const orderText = p.openOrders.length > 1 ? 'Orders' : 'Order'

    return (
      <section className={Styles.MarketPositionsListMobile}>
        <h2>
          My Position
          { p.openOrders.length > 0 &&
            <span className={Styles.MarketPositionsListMobile__pending}>
              { p.openOrders.length } Pending { orderText }
            </span>
          }
        </h2>
        <div className={Styles.MarketPositionsListMobile__positions}>
          { p.positions.length > 0 &&
            <ul className={Styles.MarketPositionsListMobile__position}>
              <li>
                <span>
                  QTY
                  { p.openOrders.length > 0 &&
                    <span className={Styles.MarketPositionsListMobile__pending}>
                      +{ p.openOrders.reduce((sum, order) => sum + +order.order.qtyShares.formatted, 0) }
                    </span>
                  }
                </span>
                { getValue(p.positions[0], 'position.qtyShares.formatted') }
              </li>
              <li>
                <span>
                  AVG Price
                  { p.openOrders.length > 0 &&
                    <span className={Styles.MarketPositionsListMobile__pending}>
                      { this.calcAvgDiff() }
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
          }
        </div>
      </section>
    )
  }
}
