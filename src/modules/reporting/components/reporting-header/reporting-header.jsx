import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/reporting/components/reporting-header/reporting-header.styles'

export default class ReportingHeader extends Component {
  static propTypes = {
    heading: PropTypes.string.isRequired,
    showReportingEndDate: PropTypes.bool.isRequired,
    loadReportingWindowBounds: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      daysLeft: 9,
      endDate: 'November 20, 2017',
      totalStake: 1,
    }
  }

  componentWillMount() {
    this.props.loadReportingWindowBounds()
  }

  render() {
    const s = this.state
    const p = this.props

    const currentPeriodStyle = {
      width: `${((27 - s.daysLeft) / 27) * 100}%`
    }

    return (
      <article className={Styles.ReportingHeader}>
        <div className={Styles.ReportingHeader__header}>
          <div>
            <h1 className={Styles.ReportingHeader__heading}>{p.heading}</h1>
            { p.showReportingEndDate &&
              <span className={Styles.ReportingHeader__endDate}>Reporting cycle ends { s.endDate }</span>
            }
          </div>
          <div>
            <span className={Styles.ReportingHeader__stake}>Total Stake: { s.totalStake } REP</span>
          </div>
        </div>
        <div className={Styles['ReportingHeader__graph-wrapper']}>
          <div className={Styles.ReportingHeader__graph}>
            <div className={Styles['ReportingHeader__graph-current']}>
              <div style={currentPeriodStyle}>
                <span>{ s.daysLeft } days left</span>
              </div>
            </div>
            <div className={Styles['ReportingHeader__graph-dispute']} />
          </div>
          <div className={Styles.ReportingHeader__labels}>
            <span>Current Cycle</span>
            <span>Dispute</span>
          </div>
        </div>
      </article>
    )
  }
}
