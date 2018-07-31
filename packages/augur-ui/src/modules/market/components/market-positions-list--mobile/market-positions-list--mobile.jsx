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
      visibleOrders: props.openOrders.length > 3 ? 3 : props.openOrders.length,
    }
  }

  render() {
    const {
      openOrders,
      outcome,
      positions,
    } = this.props
    const s = this.state

    return (
      <section className={Styles.MarketPositionsListMobile}>
        { positions.length > 0 &&
          <MobilePositions
            position={positions[0]}
            pendingOrders={openOrders.filter(order => order.pending)}
          />
        }
        { openOrders.length > 0 &&
          <div className={Styles['MarketPositionsListMobile__wrapper--orders']}>
            <h2 className={Styles['MarketPositionsListMobile__heading--orders']}>Open Orders</h2>
            <div className={Styles.MarketPositionsListMobile__orders}>
              { [...Array(s.visibleOrders)].map((unused, i) => (openOrders[i] ? (
                <MobileOrder key={i} order={openOrders[i]} />
              ) : null))
              }
            </div>
            { s.showViewMore &&
              <button
                className={Styles['MarketPositionsListMobile__orders-view-more']}
                onClick={e => this.setState({ showViewMore: false, visibleOrders: openOrders.length })}
              >
                +View More
              </button>
            }
          </div>
        }
        <MobileStats
          outcome={outcome}
        />
      </section>
    )
  }
}
