import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

import { getDaysRemaining, convertUnixToFormattedDate } from 'utils/format-date'
import { formatAttoRep } from 'utils/format-number'
import Styles from 'modules/reporting/components/reporting-header/reporting-header.styles'
import TooltipStyles from 'modules/common/less/tooltip'
import { MODAL_PARTICIPATE } from 'modules/modal/constants/modal-types'
import ForkingContent from 'modules/forking/components/forking-content/forking-content'

import { Participate } from 'modules/common/components/icons'

export default class ReportingHeader extends Component {
  static propTypes = {
    heading: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired,
    loadReportingWindowBounds: PropTypes.func.isRequired,
    reportingWindowStats: PropTypes.object.isRequired,
    repBalance: PropTypes.string.isRequired,
    updateModal: PropTypes.func.isRequired,
    currentTime: PropTypes.number.isRequired,
    doesUserHaveRep: PropTypes.bool.isRequired,
    finalizeMarket: PropTypes.func.isRequired,
    isForking: PropTypes.bool,
    forkingMarket: PropTypes.string,
    forkEndTime: PropTypes.string,
    forkReputationGoal: PropTypes.string,
    isForkingMarketFinalized: PropTypes.bool,
  }

  componentWillMount() {
    const { loadReportingWindowBounds } = this.props
    loadReportingWindowBounds()
  }

  render() {
    const {
      currentTime,
      forkEndTime,
      forkingMarket,
      heading,
      isForking,
      isMobile,
      repBalance,
      reportingWindowStats,
      updateModal,
      doesUserHaveRep,
      forkReputationGoal,
      finalizeMarket,
      isForkingMarketFinalized,
    } = this.props
    const totalDays = getDaysRemaining(reportingWindowStats.endTime, reportingWindowStats.startTime)
    const daysLeft = getDaysRemaining(reportingWindowStats.endTime, currentTime)
    const formattedDate = convertUnixToFormattedDate(reportingWindowStats.endTime)
    const currentPercentage = ((totalDays - daysLeft) / totalDays) * 100
    const disableParticipate = (repBalance === '0')
    const currentPeriodStyle = {
      width: `${((totalDays - daysLeft) / totalDays) * 100}%`,
    }
    const disputeRep = formatAttoRep(reportingWindowStats.stake, { decimals: 4, denomination: ' REP' }).formattedValue || 0

    return (
      <article className={Styles.ReportingHeader}>
        <div className={Styles.ReportingHeader__header}>
          <div>
            <h1 className={Styles.ReportingHeader__heading}>Reporting: {heading}</h1>
            { heading === 'Dispute' && isForking &&
              <ForkingContent
                forkingMarket={forkingMarket}
                forkEndTime={forkEndTime}
                currentTime={currentTime}
                expanded={false}
                doesUserHaveRep={doesUserHaveRep}
                forkReputationGoal={forkReputationGoal}
                finalizeMarket={finalizeMarket}
                isForkingMarketFinalized={isForkingMarketFinalized}
              />
            }
            { heading === 'Dispute' && !isForking &&
              <div className={Styles['ReportingHeader__dispute-wrapper']}>
                <div className={Styles['ReportingHeader__dispute-header']}>
                  <div className={Styles['ReportingHeader__meta-wrapper']}>
                    <span className={Styles.ReportingHeader__endTime}>Dispute Window ends { formattedDate.formattedLocal }</span>
                    <span className={Styles.ReportingHeader__stake}> | </span><span className={Styles.ReportingHeader__stake}>{ disputeRep } REP Staked</span>
                  </div>
                  <button
                    className={disableParticipate ? Styles['ReportingHeader__participationTokens--disabled'] : Styles.ReportingHeader__participationTokens}
                    data-tip
                    data-for="tooltip--participation-tokens"
                    disabled={disableParticipate}
                    onClick={() => updateModal({
                      type: MODAL_PARTICIPATE,
                      canClose: true,
                    })}
                  >
                    { Participate }
                    <span className={Styles['ReportingHeader__participationTokens--text']}>
                      participate
                    </span>
                  </button>
                  { !isMobile &&
                    <ReactTooltip
                      id="tooltip--participation-tokens"
                      className={TooltipStyles.Tooltip}
                      effect="solid"
                      place="left"
                      type="light"
                    >
                      <h4>Don&apos;t see any markets that need to be disputed?</h4>
                      <p>Purchase participation tokens to earn a share of the reporting fees collected during this dispute window.</p>
                    </ReactTooltip>
                  }
                </div>
                <div className={Styles['ReportingHeader__dispute-graph']}>
                  <div className={Styles.ReportingHeader__graph}>
                    <div className={currentPercentage <= 90 && !(isMobile && currentPercentage > 70) ? Styles['ReportingHeader__graph-current'] : Styles['ReportingHeader__graph-current-90']}>
                      <div style={currentPeriodStyle}>
                        <span>{ daysLeft } {daysLeft === 1 ? 'day' : 'days'} left</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </article>
    )
  }
}
