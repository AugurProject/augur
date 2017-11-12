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
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <section className={Styles.MarketPositionsList}>
        <h2>My Position</h2>
        <div className={Styles.MarketPositionsListMobile__positions}>
          { p.positions.length > 0 && p.positions.map((position, i) => (
            <ul className={Styles.MarketPositionsListMobile__position}>
              <li>
                <span>QTY</span>
                { getValue(position, 'position.qtyShares.formatted') }
              </li>
              <li>
                <span>AVG Price</span>
                { getValue(position, 'position.purchasePrice.formatted') }
              </li>
              <li>
                <span>Unrealized P/L</span>
                { getValue(position, 'position.unrealizedNet.formatted') }
              </li>
              <li>
                <span>Realized P/L</span>
                { getValue(position, 'position.realizedNet.formatted') }
              </li>
            </ul>
          ))}
        </div>
      </section>
    )
  }
}
