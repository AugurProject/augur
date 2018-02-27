import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Helmet } from 'react-helmet'
import { augur } from 'services/augurjs'

import { formatEtherEstimate } from 'utils/format-number'
import MarketPreview from 'modules/market/components/market-preview/market-preview'
import NullStateMessage from 'modules/common/components/null-state-message/null-state-message'
import ReportingReportForm from 'modules/reporting/components/reporting-report-form/reporting-report-form'
import ReportingReportConfirm from 'modules/reporting/components/reporting-report-confirm/reporting-report-confirm'
import { isEmpty } from 'lodash'
import FormStyles from 'modules/common/less/form'
import Styles from 'modules/reporting/components/reporting-report/reporting-report.styles'

export default class ReportingReport extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
    market: PropTypes.object.isRequired,
    isOpenReporting: PropTypes.bool.isRequired,
    universe: PropTypes.string.isRequired,
    marketId: PropTypes.string.isRequired,
    isConnected: PropTypes.bool.isRequired,
    isMarketLoaded: PropTypes.bool.isRequired,
    loadFullMarket: PropTypes.func.isRequired,
    submitInitialReport: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      currentStep: 0,
      showingDetails: true,
      isMarketInValid: null,
      selectedOutcome: '',
      selectedOutcomeName: '',
      // need to get value from augur-node for
      // designated reporter or initial reporter (open reporting)
      stake: '0',
      validations: {
        selectedOutcome: null,
      },
      reporterGasCost: null,
      designatedReportNoShowReputationBond: 0,
    }

    this.prevPage = this.prevPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.updateState = this.updateState.bind(this)
    this.toggleDetails = this.toggleDetails.bind(this)
  }

  componentWillMount() {
    // needed for both DR and open reporting
    this.calculateMarketCreationCosts()
    if (this.props.isConnected && !this.props.isMarketLoaded) {
      this.props.loadFullMarket()
    }
  }

  prevPage() {
    this.setState({ currentStep: this.state.currentStep <= 0 ? 0 : this.state.currentStep - 1 })
  }

  nextPage() {
    this.setState({ currentStep: this.state.currentStep >= 1 ? 1 : this.state.currentStep + 1 })
  }

  updateState(newState) {
    this.setState(newState)
  }

  toggleDetails() {
    this.setState({ showingDetails: !this.state.showingDetails })
  }

  calculateMarketCreationCosts() {
    // TODO: might have short-cut, reporter gas cost (creationFee) and designatedReportStake is on market from augur-node
    augur.createMarket.getMarketCreationCostBreakdown({ universe: this.props.universe }, (err, marketCreationCostBreakdown) => {
      if (err) return console.error(err)

      const repAmount = formatEtherEstimate(marketCreationCostBreakdown.designatedReportNoShowReputationBond)

      this.setState({
        designatedReportNoShowReputationBond: repAmount,
        reporterGasCost: formatEtherEstimate(marketCreationCostBreakdown.targetReporterGasCosts),
        stake: this.props.isOpenReporting ? '0' : repAmount.formatted,
      })


    })
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <section>
        <Helmet>
          <title>Submit Report</title>
        </Helmet>
        { !isEmpty(p.market) &&
          <MarketPreview
            {...p.market}
            isLogged={p.isLogged}
            location={p.location}
            history={p.history}
            cardStyle="single-card"
            buttonText="View"
            showAdditionalDetailsToggle
            showingDetails={s.showingDetails}
            toggleDetails={this.toggleDetails}
          />
        }
        { !isEmpty(p.market) && s.showingDetails &&
          <div className={Styles[`ReportingReportMarket__details-container-wrapper`]}>
            <div className={Styles[`ReportingReportMarket__details-container`]}>
              <div className={Styles.ReportingReportMarket__details}>
                <span>
                  {p.market.extraInfo}
                </span>
              </div>
              <div className={Styles[`ReportingReportMarket__resolution-source`]}>
                <h4>Resolution Source:</h4>
                <span>{p.market.resolutionSource || 'Outcome will be determined by news media'}</span>
              </div>
            </div>
          </div>
        }
        { !isEmpty(p.market) &&
          <article className={FormStyles.Form}>
            { s.currentStep === 0 &&
              <ReportingReportForm
                market={p.market}
                updateState={this.updateState}
                isMarketInValid={s.isMarketInValid}
                selectedOutcome={s.selectedOutcome}
                stake={s.stake}
                validations={s.validations}
                isOpenReporting={p.isOpenReporting}
              />
            }
            { s.currentStep === 1 &&
              <ReportingReportConfirm
                market={p.market}
                isMarketInValid={s.isMarketInValid}
                selectedOutcome={s.selectedOutcomeName}
                stake={s.stake}
                designatedReportNoShowReputationBond={s.designatedReportNoShowReputationBond}
                reporterGasCost={s.reporterGasCost}
                isOpenReporting={p.isOpenReporting}
              />
            }
            <div className={FormStyles.Form__navigation}>
              <button
                className={classNames(FormStyles.Form__prev, { [`${FormStyles['hide-button']}`]: s.currentStep === 0 })}
                onClick={this.prevPage}
              >Previous
              </button>
              <button
                className={classNames(FormStyles.Form__next, { [`${FormStyles['hide-button']}`]: s.currentStep === 1 })}
                disabled={!Object.keys(s.validations).every(key => s.validations[key] === true)}
                onClick={Object.keys(s.validations).every(key => s.validations[key] === true) ? this.nextPage : undefined}
              >Report
              </button>
              { s.currentStep === 1 &&
              <button
                className={FormStyles.Form__submit}
                onClick={() => p.submitInitialReport(p.market.id, s.selectedOutcome, s.isMarketInValid, p.history)}
              >Submit
              </button>
              }
            </div>
          </article>
        }
        { isEmpty(p.market) &&
          <div className={Styles.NullState}>
            <NullStateMessage
              message="Market not found"
              className={Styles.NullState}
            />
          </div>
        }
      </section>
    )
  }
}
