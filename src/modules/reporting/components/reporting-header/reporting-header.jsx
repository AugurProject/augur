import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

import { getDaysRemaining, convertUnixToFormattedDate } from 'utils/format-date'
import { formatAttoRep } from 'utils/format-number'
import Styles from 'modules/reporting/components/reporting-header/reporting-header.styles'
import { MODAL_PARTICIPATE } from 'modules/modal/constants/modal-types'
import ForkingContent from 'modules/forking/components/forking-content/forking-content'
import { showMore } from 'modules/common/components/icons'
import classNames from 'classnames'

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
    isLogged: PropTypes.bool,
  }
  
  constructor(props) {
    super(props)

    this.state = {
      readMore: false,
    }

    this.showReadMore = this.showReadMore.bind(this)
  }

  componentWillMount() {
    const { loadReportingWindowBounds } = this.props
    loadReportingWindowBounds()
  }

  showReadMore() {
    this.setState({readMore: !this.state.readMore})
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
      isLogged,
    } = this.props
    const totalDays = getDaysRemaining(reportingWindowStats.endTime, reportingWindowStats.startTime)
    const daysLeft = getDaysRemaining(reportingWindowStats.endTime, currentTime)
    const formattedDate = convertUnixToFormattedDate(reportingWindowStats.endTime)
    const currentPercentage = ((totalDays - daysLeft) / totalDays) * 100
    const disableParticipate = (repBalance === '0')
    const disputeRep = formatAttoRep(reportingWindowStats.stake, { decimals: 4, denomination: ' REP' }).formattedValue || 0
    const disputingRep = formatAttoRep(reportingWindowStats.contributions, { decimals: 4, denomination: ' REP' }).formattedValue || 0
    const partRep = formatAttoRep(reportingWindowStats.participation, { decimals: 4, denomination: ' REP' }).formattedValue || 0

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

                  <div className={Styles['ReportingHeader__row']}>
                    <div className={Styles['ReportingHeader__column']}>
                      <div className={Styles['ReportingHeader__column']}>
                        <div className={Styles['ReportingHeader__value-label']}>
                          My Rep Staked
                        </div>
                        <div 
                          className={Styles['ReportingHeader__value-number']} 
                          onClick={this.showReadMore}
                        >
                          { disputeRep } <span className={Styles['ReportingHeader__value-unit']}>REP</span> 
                          { showMore }
                        </div>
                        { this.state.readMore && 
                          <div className={Styles['ReportingHeader__readMore']}>
                            <div className={Styles['ReportingHeader__column']} style={{marginRight: '30px'}}>
                              <div className={Styles['ReportingHeader__readMore-value-label']}>
                                Reporting
                              </div>
                              <div className={Styles['ReportingHeader__readMore-value-number']}>
                                { disputingRep } <span className={Styles['ReportingHeader__readMore-value-unit']}>REP</span> 
                              </div>
                            </div>
                            <div className={Styles['ReportingHeader__column']} style={{marginRight: '30px'}}>
                              <div className={Styles['ReportingHeader__readMore-value-label']}>
                                Disputing
                              </div>
                              <div className={Styles['ReportingHeader__readMore-value-number']}>
                                { disputingRep } <span className={Styles['ReportingHeader__readMore-value-unit']}>REP</span> 
                              </div>
                            </div>
                            <div className={Styles['ReportingHeader__column']}>
                              <div className={Styles['ReportingHeader__readMore-value-label']}>
                                Participation Tokens
                              </div>
                              <div className={Styles['ReportingHeader__readMore-value-number']}>
                                { partRep } <span className={Styles['ReportingHeader__readMore-value-unit']}>REP</span> 
                              </div>
                            </div>
                          </div>
                        }
                      </div>
                      <div>
                        <div className={Styles['ReportingHeader__value-label']}>
                          Total Fees Available
                        </div>
                        <div 
                          className={Styles['ReportingHeader__value-number']} 
                          onClick={this.showReadMore}
                        >
                          { disputeRep } <span className={Styles['ReportingHeader__value-unit']}>REP</span> 
                        </div>
                        <div className={Styles['ReportingHeader__value-label']}>
                          Total Rep Staked
                        </div>
                        <div 
                          className={Styles['ReportingHeader__value-number']} 
                          onClick={this.showReadMore}
                        >
                          { disputeRep } <span className={Styles['ReportingHeader__value-unit']}>REP</span> 
                        </div>
                      </div>
                    </div>
                    
                    <div className={Styles['ReportingHeader__participation']}>
                      <div className={Styles['ReportingHeader__participationHeader']}>
                        don't see any reports that need to be disputed?
                      </div>
                      <div className={Styles['ReportingHeader__participationText']}>
                        You can still earn a share of this dispute window's reporting fees by purchasing Participation Tokens.
                        {!isLogged && 
                          <b> Please login to purchase Participation tokens. </b>
                        }
                      </div>
                      {isLogged && 
                        <button
                          className={disableParticipate ? Styles['ReportingHeader__participationTokens--disabled'] : Styles.ReportingHeader__participationTokens}
                          disabled={disableParticipate}
                          onClick={() => updateModal({
                            type: MODAL_PARTICIPATE,
                            canClose: true,
                          })}
                        >
                          <span className={Styles['ReportingHeader__participationTokens--text']}>
                            buy participation tokens
                          </span>
                        </button>
                      }
                    </div>

                  </div>

                  <div className={classNames(Styles['ReportingHeader__endTimeRow'], Styles['ReportingHeader__row'])}>
                    <span data-testid="endTime" className={Styles.ReportingHeader__endTime}>
                      Dispute Window ends <span className={Styles.ReportingHeader__endTimeValue}> { formattedDate.formattedLocalShort } </span>
                    </span>
                  </div>
                </div>
                <div className={Styles['ReportingHeader__dispute-graph']}>
                  <div className={Styles.ReportingHeader__graph}>
                    <div className={currentPercentage <= 90 && !(isMobile && currentPercentage > 70) ? Styles['ReportingHeader__graph-current'] : Styles['ReportingHeader__graph-current-90']}>
                    </div>
                  </div>
                </div>
                <div className={Styles['ReportingHeader__daysLeft']}>
                  <span data-testid="daysLeft">{ daysLeft } {daysLeft === 1 ? 'day' : 'days'} left</span>
                </div>
              </div>
            }
          </div>
        </div>
      </article>
    )
  }
}
