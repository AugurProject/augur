import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import ReportingHeader from 'modules/reporting/containers/reporting-header'
import ReportDisputeNoRepState from 'src/modules/reporting/components/reporting-dispute-no-rep-state/reporting-dispute-no-rep-state'

const Styles = require('./reporting-dispute.styles')

export default class ReportingDispute extends Component {
  static propTypes = {
    doesUserHaveRep: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    markets: PropTypes.array.isRequired,
    marketsCount: PropTypes.number.isRequired,
    isMobile: PropTypes.bool,
    navigateToAccountDepositHandler: PropTypes.func.isRequired,
  }

  componentWillMount() {

  }

  render() {
    return (
      <section className={Styles.ReportDispute}>
        <Helmet>
          <title>Dispute</title>
        </Helmet>
        <ReportingHeader
          heading="Dispute"
          showReportingEndDate
        />
        {this.props.doesUserHaveRep || <ReportDisputeNoRepState
          btnText="Add Funds"
          message="You have 0 REP available. Add funds to dispute markets or purchase participation tokens."
          onClickHandler={this.props.navigateToAccountDepositHandler}
        />}
      </section>
    )
  }
}
