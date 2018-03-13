import React from 'react'
import PropTypes from 'prop-types'
import Styles from 'modules/reporting/components/reporting-dispute-progress/reporting-dispute-progress.styles'
import { calculateTentativeStakePercentage, calculateTentativeRemainingRep } from 'modules/reporting/helpers/progress-calculations'

const ReportingDisputeProgress = (p) => {
  let remainingRepFormatted = p.remainingRep
  let totalPercentageComplete = p.percentageComplete
  const userStaked = p.tentativeStake > 0 && p.isSelected

  if (userStaked) {
    totalPercentageComplete = calculateTentativeStakePercentage(p.disputeBondValue, p.currentStake, p.tentativeStake)
    remainingRepFormatted = calculateTentativeRemainingRep(p.disputeBondValue, p.currentStake, p.tentativeStake)
  }

  const percentageComplete = {
    width: `${totalPercentageComplete}%`,
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
            <div className={userStaked ? Styles['ReportingDisputeProgress__graph-current-user'] : Styles['ReportingDisputeProgress__graph-current']}>
              <div style={percentageComplete} />
            </div>
          </div>
        </div>
        <div className={Styles['ReportingDisputeProgress__dispute-label']}>{ remainingRepFormatted } REP</div>
        { userStaked && totalPercentageComplete >= 100 &&
          <div className={Styles['ReportingDisputeProgress__dispute-tentative']}>New tentative outcome</div>
        }
      </section>
    </article>
  )
}

ReportingDisputeProgress.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  paddingAmount: PropTypes.number,
  percentageComplete: PropTypes.number,
  remainingRep: PropTypes.string,
  accountPercentage: PropTypes.number,
  tentativeStake: PropTypes.number,
  disputeBondValue: PropTypes.number,
  currentStake: PropTypes.number,
}

export default ReportingDisputeProgress
