import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import makePath from 'modules/routes/helpers/make-path'

import PositionsMarketsList from 'modules/portfolio/components/positions-markets-list/positions-markets-list'
import PortfolioStyles from 'modules/portfolio/components/portfolio-view/portfolio-view.styles'
import { MARKETS } from 'modules/routes/constants/views'

export default class Positions extends Component {
  static propTypes = {
    currentTimestamp: PropTypes.number.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    openPositionMarkets: PropTypes.array.isRequired,
    reportingMarkets: PropTypes.array.isRequired,
    closedMarkets: PropTypes.array.isRequired,
    loadAccountTrades: PropTypes.func.isRequired,
    marketsCount: PropTypes.number.isRequired,
    registerBlockNumber: PropTypes.number,
    claimTradingProceeds: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
  }

  componentWillMount() {
    const { loadAccountTrades } = this.props
    loadAccountTrades()
  }

  render() {
    const {
      claimTradingProceeds,
      closedMarkets,
      currentTimestamp,
      history,
      isMobile,
      location,
      marketsCount,
      openPositionMarkets,
      reportingMarkets,
    } = this.props
    return (
      <section>
        <Helmet>
          <title>Positions</title>
        </Helmet>
        { marketsCount !== 0 &&
        <div>
          <PositionsMarketsList
            title="Open"
            markets={openPositionMarkets}
            location={location}
            history={history}
            currentTimestamp={currentTimestamp}
            isMobile={isMobile}
          />
          <PositionsMarketsList
            title="In Reporting"
            markets={reportingMarkets}
            location={location}
            history={history}
            positionsDefault={false}
            currentTimestamp={currentTimestamp}
            isMobile={isMobile}
          />
          <PositionsMarketsList
            title="Resolved"
            markets={closedMarkets}
            location={location}
            history={history}
            positionsDefault={false}
            currentTimestamp={currentTimestamp}
            claimTradingProceeds={claimTradingProceeds}
            isMobile={isMobile}
          />
        </div>}
        { marketsCount === 0 &&
          <div className={PortfolioStyles.NoMarkets__container} >
            <span>You don&apos;t have any positions.</span>
            <Link
              className={PortfolioStyles.NoMarkets__link}
              to={makePath(MARKETS)}
            >
              <span>Click here to view markets.</span>
            </Link>
          </div>
        }
      </section>
    )
  }
}
