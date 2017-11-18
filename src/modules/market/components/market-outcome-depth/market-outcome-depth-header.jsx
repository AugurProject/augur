import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/market/components/market-outcome-depth/market-outcome-depth-header'

const MarketOutcomeDepthHeader = p => (
  <section className={Styles[`MarketOutcomeDepth__depth-hover-values`]}>
    <span className={Styles[`MarketOutcomeCandlestick__depth-hover-value`]}>
      <span className={Styles[`MarketOutcomeCandlestick__depth-hover-title`]}>
        {p.side} price
      </span>
      <span className={Styles[`MarketOutcomeCandlestick__depth-hover-value`]}>
        {p.price}
      </span>
    </span>
    <span className={Styles[`MarketOutcomeCandlestick__depth-hover-value`]}>
      <span className={Styles[`MarketOutcomeCandlestick__depth-hover-title`]}>
        qty
      </span>
      <span className={Styles[`MarketOutcomeCandlestick__depth-hover-value`]}>
        {p.quantity}
      </span>
    </span>
    <span className={Styles[`MarketOutcomeCandlestick__depth-hover-value`]}>
      <span className={Styles[`MarketOutcomeCandlestick__depth-hover-title`]}>
        depth
      </span>
      <span className={Styles[`MarketOutcomeCandlestick__depth-hover-value`]}>
        {p.depth}
      </span>
    </span>
  </section>
)

export default MarketOutcomeDepthHeader

MarketOutcomeDepthHeader.propTypes = {
  side: PropTypes.string,
  quantity: PropTypes.number,
  depth: PropTypes.number
}
