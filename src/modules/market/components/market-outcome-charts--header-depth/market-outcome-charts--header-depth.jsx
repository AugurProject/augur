import React from 'react'
import PropTypes from 'prop-types'

import { ASKS } from 'modules/order-book/constants/order-book-order-types'

const MarketOutcomeDepthHeader = p => (
  <span>Depth</span>
)

export default MarketOutcomeDepthHeader

MarketOutcomeDepthHeader.propTypes = {
  side: PropTypes.string,
  quantity: PropTypes.number,
  depth: PropTypes.number,
  fixedPrecision: PropTypes.number.isRequired
}

// <section className={Styles[`MarketOutcomeDepth__depth-hover-values`]}>
//   <span className={Styles[`MarketOutcomeDepth__hover-depth`]}>
//     <span className={Styles[`MarketOutcomeDepth__depth-hover-title`]}>
//       {p.side === ASKS ? 'ask' : 'bid'} price
//     </span>
//     <span className={Styles[`MarketOutcomeDepth__depth-hover-value`]}>
//       {p.price || '-'}
//     </span>
//   </span>
//   <span className={Styles[`MarketOutcomeDepth__hover-depth`]}>
//     <span className={Styles[`MarketOutcomeDepth__depth-hover-title`]}>
//       qty
//     </span>
//     <span className={Styles[`MarketOutcomeDepth__depth-hover-value`]}>
//       {p.quantity || '-'}
//     </span>
//   </span>
//   <span className={Styles[`MarketOutcomeDepth__hover-depth`]}>
//     <span className={Styles[`MarketOutcomeDepth__depth-hover-title`]}>
//       depth
//     </span>
//     <span className={Styles[`MarketOutcomeDepth__depth-hover-value`]}>
//       {p.depth || '-'}
//     </span>
//   </span>
// </section>
