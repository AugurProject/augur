import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/market/components/market-outcome-charts--header-depth/market-outcome-charts--header-depth.styles'

import { ASKS } from 'modules/order-book/constants/order-book-order-types'

const MarketOutcomeDepthHeader = p => (
  <section className={Styles[`MarketOutcomeDepth__depth-hover-values`]}>
    <span className={Styles[`MarketOutcomeDepth__hover-depth`]}>
      <span className={Styles[`MarketOutcomeDepth__depth-hover-title`]}>
        {p.hoveredDepth[3] === ASKS ? 'ask' : 'bid'} price
      </span>
      <span className={Styles[`MarketOutcomeDepth__depth-hover-value`]}>
        {p.hoveredDepth[1] || <span>&mdash;</span>}
      </span>
    </span>
    <span className={Styles[`MarketOutcomeDepth__hover-depth`]}>
      <span className={Styles[`MarketOutcomeDepth__depth-hover-title`]}>
        qty
      </span>
      <span className={Styles[`MarketOutcomeDepth__depth-hover-value`]}>
        {p.hoveredDepth[2] || <span>&mdash;</span>}
      </span>
    </span>
    <span className={Styles[`MarketOutcomeDepth__hover-depth`]}>
      <span className={Styles[`MarketOutcomeDepth__depth-hover-title`]}>
        depth
      </span>
      <span className={Styles[`MarketOutcomeDepth__depth-hover-value`]}>
        {p.hoveredDepth[0] || <span>&mdash;</span>}
      </span>
    </span>
  </section>
)

export default MarketOutcomeDepthHeader

MarketOutcomeDepthHeader.propTypes = {
  hoveredDepth: PropTypes.array.isRequired,
  side: PropTypes.string,
  quantity: PropTypes.number,
  depth: PropTypes.number,
  price: PropTypes.number,
  fixedPrecision: PropTypes.number.isRequired
}
