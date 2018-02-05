import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import ReportingHeader from 'modules/reporting/containers/reporting-header'

const Styles = require('./reporting-dispute.styles')

export default class ReportingDispute extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    markets: PropTypes.array.isRequired,
    marketsCount: PropTypes.number.isRequired,
    isMobile: PropTypes.bool,
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

      </section>
    )
  }
}
