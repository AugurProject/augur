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
    history: PropTypes.object,
    isLogged: PropTypes.bool,
    loadMarketsInfo: PropTypes.func,
    loadReporting: PropTypes.func.isRequired,
    location: PropTypes.object,
    markets: PropTypes.array.isRequired,
    toggleFavorite: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      filteredMarkets: [],
    }
  }

  componentWillMount() {
    const { loadReporting } = this.props
    loadReporting()
  }

  componentWillReceiveProps(nextProps) {
    const { markets } = this.props
    if (nextProps.markets.length > 0 && nextProps.markets !== markets) {
      const filteredMarkets = getMarketIds(nextProps.markets)
      this.setState({ filteredMarkets })
    }
  }

  render() {
    const {
      history,
      isLogged,
      loadMarketsInfo,
      location,
      markets,
      toggleFavorite,
    } = this.props
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
          isLogged={isLogged}
          markets={markets}
          filteredMarkets={s.filteredMarkets}
          location={location}
          history={history}
          linkType={TYPE_VIEW}
          toggleFavorite={toggleFavorite}
          loadMarketsInfo={loadMarketsInfo}
          paginationPageParam="reporting-resolved-page"
        />
      </section>
    )
  }
}
