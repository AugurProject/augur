import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import makePath from 'modules/routes/helpers/make-path'

import PositionsMarketsList from 'modules/portfolio/components/positions-markets-list/positions-markets-list'
import { TYPE_CHALLENGE } from 'modules/market/constants/link-types'
import PortfolioStyles from 'modules/portfolio/components/portfolio-view/portfolio-view.styles'
import { MARKETS } from 'modules/routes/constants/views'

export default class Positions extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    openPositionMarkets: PropTypes.array.isRequired,
    reportingMarkets: PropTypes.array.isRequired,
    closedMarkets: PropTypes.array.isRequired,
    closePositionStatus: PropTypes.object.isRequired,
    scalarShareDenomination: PropTypes.object.isRequired,
    orderCancellation: PropTypes.object.isRequired,
    registerBlockNumber: PropTypes.number,
    loadAccountTrades: PropTypes.func.isRequired,
    marketsCount: PropTypes.number.isRequired,
  }

  componentWillMount() {
    this.props.loadAccountTrades()
  }

  render() {
    const p = this.props
    return (
      <section>
        <Helmet>
          <title>Positions</title>
        </Helmet>
        { p.openPositionMarkets.length !== 0 &&
        <PositionsMarketsList
          title="Open"
          markets={p.openPositionMarkets}
          closePositionStatus={p.closePositionStatus}
          scalarShareDenomination={p.scalarShareDenomination}
          orderCancellation={p.orderCancellation}
          location={p.location}
          history={p.history}
        /> }
        { p.reportingMarkets.length !== 0 &&
        <PositionsMarketsList
          title="Reporting"
          markets={p.reportingMarkets}
          closePositionStatus={p.closePositionStatus}
          scalarShareDenomination={p.scalarShareDenomination}
          orderCancellation={p.orderCancellation}
          location={p.location}
          history={p.history}
          linkType={TYPE_CHALLENGE}
          positionsDefault={false}
        /> }
        { p.closedMarkets.length !== 0 &&
        <PositionsMarketsList
          title="Finalized"
          markets={p.closedMarkets}
          closePositionStatus={p.closePositionStatus}
          scalarShareDenomination={p.scalarShareDenomination}
          orderCancellation={p.orderCancellation}
          location={p.location}
          history={p.history}
          positionsDefault={false}
        /> }
        { p.marketsCount === 0 &&
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
