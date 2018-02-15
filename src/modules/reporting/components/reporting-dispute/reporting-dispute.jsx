import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import ReportingHeader from 'modules/reporting/containers/reporting-header'
import ReportDisputeNoRepState from 'src/modules/reporting/components/reporting-dispute-no-rep-state/reporting-dispute-no-rep-state'
import NullStateMessage from 'modules/common/components/null-state-message/null-state-message'
import DisputeMarketCard from 'modules/reporting/components/dispute-market-card/dispute-market-card'

const Styles = require('./reporting-dispute.styles')

export default class ReportingDispute extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    doesUserHaveRep: PropTypes.bool.isRequired,
    markets: PropTypes.array.isRequired,
    marketsCount: PropTypes.number.isRequired,
    isMobile: PropTypes.bool,
    navigateToAccountDepositHandler: PropTypes.func.isRequired,
  }

  componentWillMount() {

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
            showReportingEndDate
          />
          { !p.doesUserHaveRep &&
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
              />))
        }
        { p.marketsCount === 0 &&
          <NullStateMessage message="No Markets to Dispute" />
        }
      </section>
    )
  }
}
