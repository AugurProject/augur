import React from 'react'
import PropTypes from 'prop-types'
import { formatAttoRep } from 'utils/format-number'
import Styles from 'modules/reporting/components/reporting-dispute-progress/reporting-dispute-progress.styles'
import { calculateAddedStakePercentage, calculateTentativeCurrentRep } from 'modules/reporting/helpers/progress-calculations'

const ReportingDisputeProgress = (p) => {
  let totalPercentageComplete = p.percentageComplete || 0
  let userPercentage = p.percentageAccount || 0
  const currentPercentageComplete = p.percentageComplete || 0
  const userStaked = p.tentativeStake > 0 && p.isSelected
  const bondSizeCurrent = formatAttoRep(p.bondSizeCurrent, { decimals: 4, roundUp: true })
  let repStakedFormatted = formatAttoRep(p.stakeCurrent, { decimals: 4, roundUp: true }).formatted

  if (userStaked) {
    userPercentage = calculateAddedStakePercentage(bondSizeCurrent.fullPrecision, p.accountStakeCurrent, p.tentativeStake)
    repStakedFormatted = calculateTentativeCurrentRep(p.stakeCurrent, p.tentativeStake)
    totalPercentageComplete = currentPercentageComplete + userPercentage
  }

  const percentageAccount = {
    width: `${userPercentage}%`,
  }
  const percentageComplete = {
    width: `${currentPercentageComplete}%`,
  }

  return (
    <article>
      <section className={Styles['ReportingDisputeProgress__dispute-wrapper']}>
        <div className={Styles['ReportingDisputeProgress__dispute-graph']}>
          <div className={Styles.ReportingDisputeProgress__graph}>
            <div className={Styles['ReportingDisputeProgress__graph-current']}>
              <div style={percentageComplete} />
              <div style={percentageAccount} />
            </div>
          </div>
        </div>
        <div className={Styles['ReportingDisputeProgress__dispute-label']}>
          <span className={Styles['ReportingDisputeProgress__dispute-label-total-rep-text']}>{repStakedFormatted}</span>
          <span className={Styles['ReportingDisputeProgress__dispute-label-break']}> / </span>
          <span className={Styles['ReportingDisputeProgress__dispute-label-goal-text']}>{ bondSizeCurrent.formatted } REP</span>
        </div>
        { userStaked && totalPercentageComplete >= 100 &&
          <div className={Styles['ReportingDisputeProgress__dispute-tentative']}>New tentative outcome</div>
        }
      </section>
    </article>
  )
}

ReportingDisputeProgress.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  percentageComplete: PropTypes.number,
  percentageAccount: PropTypes.number,
  tentativeStake: PropTypes.number,
  bondSizeCurrent: PropTypes.string,
  stakeRemaining: PropTypes.string,
  stakeCurrent: PropTypes.string,
  accountStakeCurrent: PropTypes.string,
}

export default ReportingDisputeProgress
