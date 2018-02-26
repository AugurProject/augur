/* eslint-disable react/no-array-index-key */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import MobilePositions from 'modules/market/components/market-positions-list--mobile-positions/market-positions-list--mobile-positions'
import MobileOrder from 'modules/market/components/market-positions-list--mobile-order/market-positions-list--mobile-order'
import MobileStats from 'modules/market/components/market-positions-list--mobile-stats/market-positions-list--mobile-stats'

import Styles from 'modules/market/components/market-positions-list--mobile/market-positions-list--mobile.styles'

export default class MarketPositionsListMobile extends Component {
  static propTypes = {
    outcome: PropTypes.object.isRequired,
    positions: PropTypes.array.isRequired,
    openOrders: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      showViewMore: props.openOrders.length > 3,
      visibleOrders: props.openOrders.length > 3 ? 3 : props.openOrders.length
    }
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <section className={Styles.MarketPositionsListMobile}>
        { p.positions.length > 0 &&
          <MobilePositions
            position={p.positions[0]}
            pendingOrders={p.openOrders.filter(order => order.pending === true)}
          />
        }
        { p.openOrders.length > 0 &&
          <div className={Styles['MarketPositionsListMobile__wrapper--orders']}>
            <h2 className={Styles['MarketPositionsListMobile__heading--orders']}>Open Orders</h2>
            <div className={Styles.MarketPositionsListMobile__orders}>
              { [...Array(s.visibleOrders)].map((unused, i) => (
                <MobileOrder key={i} order={p.openOrders[i]} />
              )) }
            </div>
            { s.showViewMore &&
              <button
                className={Styles['MarketPositionsListMobile__orders-view-more']}
                onClick={e => this.setState({ showViewMore: false, visibleOrders: p.openOrders.length })}
              >
                +View More
              </button>
            }
          </div>
        }
        <MobileStats
          outcome={p.outcome}
        />
      </section>
    )
  }
}
