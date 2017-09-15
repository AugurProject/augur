import React from 'react'
import PropTypes from 'prop-types'

import { MarketStatusOpen, MarketStatusReported, MarketStatusClosed } from 'modules/common/components/icons/icons'

import Styles from 'modules/market/components/common/market-status-icon/market-status-icon.styles'

const MarketStatusIcon = (p) => {
  let marketStatusIcon

  switch (true) {
    case p.isOpen && p.isReported:
      marketStatusIcon = MarketStatusReported
      break
    case p.isOpen:
      marketStatusIcon = MarketStatusOpen
      break
    default:
      marketStatusIcon = MarketStatusClosed
  }
  return (
    <span className={Styles.MarketStatusIcon}>
      {marketStatusIcon}
    </span>
  )
}

MarketStatusIcon.propTypes = {
  isOpen: PropTypes.bool,
  isReported: PropTypes.bool
}

export default MarketStatusIcon
