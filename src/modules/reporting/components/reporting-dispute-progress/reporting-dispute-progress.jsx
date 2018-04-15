import React from 'react'
import PropTypes from 'prop-types'
import { formatAttoRep } from 'utils/format-number'
import Styles from 'modules/reporting/components/reporting-dispute-progress/reporting-dispute-progress.styles'
import { calculateAddedStakePercentage } from 'modules/reporting/helpers/progress-calculations'

const ReportingDisputeProgress = (p) => {
  let totalPercentageComplete = p.percentageComplete || 0
  let userPercentage = p.percentageAccount || 0
  const currentPercentageComplete = p.percentageComplete || 0
  const userStaked = p.tentativeStake > 0 && p.isSelected
  const remainingRepFormatted = formatAttoRep(p.stakeRemaining, { decimals: 4, roundUp: true }).formatted

  if (userStaked) {
    userPercentage = calculateAddedStakePercentage(p.bondSizeCurrent, p.accountStakeCurrent, p.tentativeStake)
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
              <div style={percentageAccount} />
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
  stakeRemaining: PropTypes.string,
  percentageComplete: PropTypes.number,
  percentageAccount: PropTypes.number,
  tentativeStake: PropTypes.number,
  bondSizeCurrent: PropTypes.string,
  stakeCurrent: PropTypes.string,
  accountStakeCurrent: PropTypes.string,
}

export default ReportingDisputeProgress
