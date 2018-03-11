import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/reporting/components/reporting-dispute-progress/reporting-dispute-progress.styles'

const ReportingDisputeProgress = (p) => {

  const currentPeriodStyle = {
    width: `${p.percentageComplete}%`,
  }

  // using magic number to align dispute bars
  const paddingValue = {
    paddingLeft: `${(p.paddingAmount * 7.5) + 80}px`,
  }

  return (
    <article>
      <section className={Styles['ReportingDisputeProgress__dispute-wrapper']}>
        <div className={Styles['ReportingDisputeProgress__dispute-graph']} style={paddingValue}>
          <div className={Styles.ReportingDisputeProgress__graph}>
            <div className={Styles['ReportingDisputeProgress__graph-current']}>
              <div style={currentPeriodStyle} />
            </div>
          </div>
        </div>
        <div className={Styles['ReportingDisputeProgress__dispute-label']}>{ p.remainingRep } REP</div>
      </section>
    </article>
  )
}

ReportingDisputeProgress.propTypes = {
  paddingAmount: PropTypes.number,
  percentageComplete: PropTypes.number,
  remainingRep: PropTypes.string,
  accountPercentage: PropTypes.number,
}

export default ReportingDisputeProgress
