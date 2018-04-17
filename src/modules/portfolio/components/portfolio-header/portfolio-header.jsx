import React from 'react'
import PropTypes from 'prop-types'

// TODO: maybe change this to container and get performance graph data through a container
import PerformanceGraph from 'modules/portfolio/containers/performance-graph'
import { ExportIcon } from 'modules/common/components/icons'

import parsePath from 'modules/routes/helpers/parse-path'
import { MY_POSITIONS, MY_MARKETS, FAVORITES, TRANSACTIONS, PORTFOLIO_REPORTS } from 'modules/routes/constants/views'

import Styles from 'modules/portfolio/components/portfolio-header/portfolio-header.styles'

const PortfolioHeader = p => (
  <section
    className={Styles.PortfolioHeader}
  >
    <div className={Styles.PortfolioHeader__header}>
      <h1 className={Styles.PortfolioHeader__title}>portfolio: {getTitle(p.location.pathname)}</h1>
      { p.location.pathname.indexOf(PORTFOLIO_REPORTS) === -1 &&
        <button
          className={Styles.PortfolioHeader__export}
          onClick={p.triggerTransactionsExport}
        >
          { ExportIcon } Export Data
        </button>
      }
    </div>
    { p.location.pathname.indexOf(PORTFOLIO_REPORTS) === -1 &&
      <PerformanceGraph />
    }
  </section>
)

function getTitle(path) {
  const view = parsePath(path)[0]

  switch (view) {
    case MY_MARKETS:
      return 'my markets'
    case FAVORITES:
      return 'favorites'
    case TRANSACTIONS:
      return 'transactions'
    case PORTFOLIO_REPORTS:
      return 'reporting'
    case MY_POSITIONS:
    default:
      return 'positions'
  }
}

PortfolioHeader.propTypes = {
  triggerTransactionsExport: PropTypes.func.isRequired,
  location: PropTypes.object,
  match: PropTypes.object,
}

export default PortfolioHeader
