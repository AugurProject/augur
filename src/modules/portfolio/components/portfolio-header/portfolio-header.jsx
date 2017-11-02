import React from 'react'
import PropTypes from 'prop-types'

// TODO: maybe change this to container and get performance graph data through a container
import PerformanceGraph from 'modules/portfolio/containers/performance-graph'

import parsePath from 'modules/routes/helpers/parse-path'
import { MY_POSITIONS, MY_MARKETS, WATCHLIST, TRANSACTIONS } from 'modules/routes/constants/views'

import Styles from 'modules/portfolio/components/portfolio-header/portfolio-header.styles'

const PortfolioHeader = p => (
  <section
    className={Styles.PortfolioHeader}
  >
    <h1 className={Styles.PortfolioHeader__title}>portfolio: {getTitle(p.location.pathname)}</h1>
    <PerformanceGraph />
  </section>
)

function getTitle(path) {
  const view = parsePath(path)[0]

  switch (view) {
    case MY_MARKETS:
      return 'my markets'
    case WATCHLIST:
      return 'watching'
    case TRANSACTIONS:
      return 'transactions'
    case MY_POSITIONS:
    default:
      return 'positions'
  }
}

PortfolioHeader.PropTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default PortfolioHeader
