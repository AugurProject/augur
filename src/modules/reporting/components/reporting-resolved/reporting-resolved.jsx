import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import ReportingHeader from 'modules/reporting/containers/reporting-header'
import MarketsList from 'modules/markets/components/markets-list'
import { TYPE_VIEW } from 'modules/market/constants/link-types'

import Styles from 'modules/reporting/components/reporting-resolved/reporting-resolved.styles'


function getMarketIds(markets) {
  const filteredMarkets = []
  markets.forEach((market) => {
    filteredMarkets.push(market.id)
  })
  return filteredMarkets
}

export default class ReportingResolved extends Component {
  static propTypes = {
    markets: PropTypes.array.isRequired,
    loadReporting: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      filteredMarkets: [],
    }
  }

  componentWillMount() {
    this.props.loadReporting()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.markets.length > 0 && nextProps.markets !== this.props.markets) {
      const filteredMarkets = getMarketIds(nextProps.markets)
      this.setState({ filteredMarkets })
    }
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <section>
        <Helmet>
          <title>Resolved</title>
        </Helmet>
        <ReportingHeader
          heading="Resolved"
        />
        <h2 className={Styles.ReportingResolved__heading}>Resolved</h2>
        <MarketsList
          isLogged={p.isLogged}
          markets={p.markets}
          filteredMarkets={s.filteredMarkets}
          location={p.location}
          history={p.history}
          linkType={TYPE_VIEW}
          toggleFavorite={p.toggleFavorite}
          loadMarketsInfo={p.loadMarketsInfo}
          paginationPageParam="reporting-resolved-page"
          isForking={p.isForking}
          isForkingMarketFinalized={p.isForkingMarketFinalized}
          forkingMarket={p.forkingMarket}
        />
      </section>
    )
  }
}
