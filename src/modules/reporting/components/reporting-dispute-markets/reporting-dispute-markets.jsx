import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import ReportingHeader from 'modules/reporting/containers/reporting-header'
import ReportDisputeNoRepState from 'src/modules/reporting/components/reporting-dispute-no-rep-state/reporting-dispute-no-rep-state'
import NullStateMessage from 'modules/common/components/null-state-message/null-state-message'
import DisputeMarketCard from 'modules/reporting/components/dispute-market-card/dispute-market-card'
import MarketsHeaderStyles from 'modules/markets/components/markets-header/markets-header.styles'

const Styles = require('./reporting-dispute-markets.styles')

export default class ReportingDisputeMarkets extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    doesUserHaveRep: PropTypes.bool.isRequired,
    markets: PropTypes.array.isRequired,
    upcomingMarkets: PropTypes.array.isRequired,
    marketsCount: PropTypes.number.isRequired,
    upcomingMarketsCount: PropTypes.number.isRequired,
    isMobile: PropTypes.bool,
    navigateToAccountDepositHandler: PropTypes.func.isRequired,
    isConnected: PropTypes.bool.isRequired,
    isMarketsLoaded: PropTypes.bool.isRequired,
    loadMarkets: PropTypes.func.isRequired,
    outcomes: PropTypes.object.isRequired,
    account: PropTypes.string.isRequired,
    isForking: PropTypes.bool.isRequired,
    forkEndTime: PropTypes.string,
    currentTime: PropTypes.number.isRequired,
    isForkingMarketFinalized: PropTypes.bool,
    forkingMarket: PropTypes.string,
    updateModal: PropTypes.func.isRequired,
  }

  componentWillMount() {
    if (this.props.isConnected && !this.props.isMarketsLoaded) {
      this.props.loadMarkets()
    }
  }

  render() {
    const p = this.props
    return (
      <section>
        <Helmet>
          <title>Dispute</title>
        </Helmet>
        <section className={Styles.ReportDispute}>
          <ReportingHeader
            heading="Dispute"
            isForking={p.isForking}
            forkEndTime={p.forkEndTime}
            currentTime={p.currentTime}
          />
          { !p.doesUserHaveRep && !p.forkEndTime &&
          <ReportDisputeNoRepState
            btnText="Add Funds"
            message="You have 0 REP available. Add funds to dispute markets or purchase participation tokens."
            onClickHandler={p.navigateToAccountDepositHandler}
          />}
        </section>
        { p.marketsCount > 0 &&
            p.markets.map(market =>
              (<DisputeMarketCard
                key={market.id}
                market={market}
                isMobile={p.isMobile}
                location={p.location}
                history={p.history}
                outcomes={p.outcomes}
              />))
        }
        { p.marketsCount === 0 &&
          <NullStateMessage
            message="There are currently no markets available for dispute."
          />
        }
        <article className={MarketsHeaderStyles.MarketsHeader}>
          <h4 className={MarketsHeaderStyles.MarketsHeader__subheading}>Upcoming Dispute Window</h4>
        </article>
        {p.upcomingMarketsCount > 0 &&
            p.upcomingMarkets.map(market =>
              (<DisputeMarketCard
                key={market.id}
                market={market}
                isMobile={p.isMobile}
                location={p.location}
                history={p.history}
                outcomes={p.outcomes}
              />))
        }
        { p.upcomingMarketsCount === 0 &&
          <NullStateMessage
            message="There are currently no markets slated for the upcoming dispute window."
          />
        }
      </section>
    )
  }
}
