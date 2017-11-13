import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import MobilePositions from 'modules/market/components/market-positions-list--mobile-positions/market-positions-list--mobile-positions'
import MobileOrders from 'modules/market/components/market-positions-list--mobile-orders/market-positions-list--mobile-orders'
import MobileStats from 'modules/market/components/market-positions-list--mobile-stats/market-positions-list--mobile-stats'

import Styles from 'modules/market/components/market-positions-list--mobile/market-positions-list--mobile.styles'

const MarketPositionsListMobile = p => (
  <section className={Styles.MarketPositionsListMobile}>
    { p.positions.length > 0 &&
      <MobilePositions
        position={p.positions[0]}
        pendingOrders={p.openOrders.filter(order => order.pending === true)}
      />
    }
    { p.openOrders.length > 0 &&
      <MobileOrders
        openOrders={p.openOrders}
      />
    }
    <MobileStats
      outcome={p.outcome}
      scalarShareDenomination={p.scalarShareDenomination}
    />
  </section>
)

export default MarketPositionsListMobile
