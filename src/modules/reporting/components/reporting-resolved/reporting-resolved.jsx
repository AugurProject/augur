import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import ReportingHeader from 'modules/reporting/containers/reporting-header'
import MarketsList from 'modules/markets/components/markets-list'
import { TYPE_VIEW } from 'modules/market/constants/link-types'

import Styles from 'modules/reporting/components/reporting-resolved/reporting-resolved.styles'

export default class ReportingResolved extends Component {
  static propTypes = {
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
    console.log('componentWillReceiveProps', nextProps);
    // TODO: clean this up so it actaully works.
    if (nextProps.markets.resolved.length > 0 && this.state.filteredMarkets.length === 0) {
      const filter = []
      for (var i = 0; i < 10; i++) {
        if (nextProps.markets.resolved[i] && nextProps.markets.resolved[i].id)
          filter.push(nextProps.markets.resolved[i].id)
      }
      this.setState({ filteredMarkets: filter })
    }
  }

  render() {
    const p = this.props
    const s = this.state
    console.log(p.markets.resolved.length);
    console.log(s);
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
          markets={p.markets.resolved}
          filteredMarkets={s.filteredMarkets}
          location={p.location}
          history={p.history}
          linkType={TYPE_VIEW}
          toggleFavorite={p.toggleFavorite}
          loadMarketsInfo={p.loadMarketsInfo}
          paginationPageParam="reporting-resolved-page"
        />
      </section>
    )
  }
}
