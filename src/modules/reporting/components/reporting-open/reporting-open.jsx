import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import ReportingHeader from 'modules/reporting/containers/reporting-header'
import MarketsList from 'modules/markets/components/markets-list'

import { TYPE_REPORT } from 'modules/market/constants/link-types'

import Styles from 'modules/reporting/components/reporting-open/reporting-open.styles'

export default class ReportingOpen extends Component {
  static propTypes = {
    markets: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    loadMarketsInfo: PropTypes.func.isRequired,
    isLogged: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isForking: PropTypes.bool,
    isForkingMarketFinalized: PropTypes.bool,
    forkingMarket: PropTypes.string,
    updateModal: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      filteredMarketsReporting: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      filteredMarketsDispute: [0, 1],
    }
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <section>
        <Helmet>
          <title>Reporting</title>
        </Helmet>
        <ReportingHeader
          heading="Reporting"
        />
        { s.filteredMarketsDispute.length &&
          <h2 className={Styles.ReportingOpen__heading}>In Dispute</h2>
        }
        { s.filteredMarketsDispute.length &&
          <MarketsList
            isLogged={p.isLogged}
            markets={p.markets}
            filteredMarkets={s.filteredMarketsDispute}
            location={p.location}
            history={p.history}
            toggleFavorite={p.toggleFavorite}
            loadMarketsInfo={p.loadMarketsInfo}
            linkType={TYPE_REPORT}
            showPagination={false}
            isForking={p.isForking}
            isForkingMarketFinalized={p.isForkingMarketFinalized}
            forkingMarket={p.forkingMarket}
          />
        }
        <h2 className={Styles.ReportingOpen__heading}>In Reporting</h2>
        <MarketsList
          isLogged={p.isLogged}
          markets={p.markets}
          filteredMarkets={s.filteredMarketsReporting}
          location={p.location}
          history={p.history}
          toggleFavorite={p.toggleFavorite}
          loadMarketsInfo={p.loadMarketsInfo}
          linkType={TYPE_REPORT}
          paginationPageParam="reporting-closed-page"
          isForking={p.isForking}
          isForkingMarketFinalized={p.isForkingMarketFinalized}
          forkingMarket={p.forkingMarket}
        />
      </section>
    )
  }
}
