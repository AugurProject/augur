/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Close } from 'modules/common/components/icons/icons'

import getValue from 'utils/get-value'

import Styles from 'modules/market/components/market-positions-list--mobile-orders/market-positions-list--mobile-orders.styles'
import CommonStyles from 'modules/market/components/market-positions-list--mobile/market-positions-list--mobile.styles'

export default class MobileOrders extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const p = this.props

    return (
      <div className={CommonStyles.MarketPositionsListMobile__wrapper}>
        <h2>Open Orders</h2>
        <div className={Styles.MobileOrders__orders}>
          { p.openOrders.map((order, i) => (
            <ul key={i} className={classNames(Styles.MobileOrders__order, { [`${Styles.pending}`] : order.pending })}>
              <li>QTY</li>
              <li>{ getValue(order, 'order.qtyShares.formatted') }</li>
              <li>Price</li>
              <li>{ getValue(order, 'order.purchasePrice.formatted') }</li>
              <li>
                { !order.pending &&
                  <button className={Styles['MobileOrders__close-order']}>{ Close }</button>
                }
              </li>
            </ul>
          )) }
        </div>
      </div>
    )
  }
}
