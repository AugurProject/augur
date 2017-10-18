import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import Styles from 'modules/reporting/components/reporting-view/reporting-view.styles'

export default class ReportingView extends Component {
  static propTypes = {
    marketsReporting: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      totalStake: 1,
      endDate: 'November 20, 2017'
    }
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <section>
        <Helmet>
          <title>Reporting</title>
        </Helmet>
        <article className={Styles.ReportingHeader}>
          <div className={Styles.ReportingHeader__header}>
            <div>
              <h1 className={Styles.ReportingHeader__heading}>Reporting</h1>
              <span className={Styles.ReportingHeader__endDate}>Reporting cycle ends { s.endDate }</span>
            </div>
            <div>
              <span className={Styles.ReportingHeader__stake}>Total Stake: { s.totalStake } REP</span>
            </div>
          </div>
        </article>
      </section>
    )
  }
}
