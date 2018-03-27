import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import MarketsList from 'modules/markets/components/markets-list'

import { TYPE_CLOSED } from 'modules/market/constants/link-types'

import Styles from 'modules/reporting/components/reporting-closed/reporting-closed.styles'

export default class ReportingClosed extends Component {
  static propTypes = {
    markets: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    loadMarketsInfo: PropTypes.func.isRequired,
    isLogged: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool,
    isForking: PropTypes.bool,
    isForkingMarketFinalized: PropTypes.bool,
    forkingMarket: PropTypes.string,
    updateModal: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      filteredMarketsClosed: [0, 1],
    }
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <section>
        <Helmet>
          <title>Reporting: Closed</title>
        </Helmet>
        <h1 className={Styles.ReportingClosed__heading}>
          Reporting: Closed
        </h1>
        <MarketsList
          isLogged={p.isLogged}
          markets={p.markets}
          filteredMarkets={s.filteredMarketsClosed}
          location={p.location}
          history={p.history}
          toggleFavorite={p.toggleFavorite}
          loadMarketsInfo={p.loadMarketsInfo}
          linkType={TYPE_CLOSED}
          paginationPageParam="reporting-closed-page"
          isMobile={p.isMobile}
          isForking={p.isForking}
          isForkingMarketFinalized={p.isForkingMarketFinalized}
          forkingMarket={p.forkingMarket}
        />
      </section>
    )
  }
}
