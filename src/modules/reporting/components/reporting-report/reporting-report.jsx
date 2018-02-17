import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Helmet } from 'react-helmet'

import MarketPreview from 'modules/market/components/market-preview/market-preview'
import NullStateMessage from 'modules/common/components/null-state-message/null-state-message'
import ReportingReportForm from 'modules/reporting/components/reporting-report-form/reporting-report-form'
import ReportingReportConfirm from 'modules/reporting/components/reporting-report-confirm/reporting-report-confirm'
import { isEmpty } from 'lodash'
import FormStyles from 'modules/common/less/form'
import Styles from 'modules/reporting/components/reporting-report/reporting-report.styles'

export default class ReportingReport extends Component {

  static propTypes = {
    market: PropTypes.object.isRequired,
    marketId: PropTypes.string.isRequired,
    isConnected: PropTypes.bool.isRequired,
    isMarketLoaded: PropTypes.bool.isRequired,
    loadFullMarket: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      currentStep: 0,
      isMarketValid: null,
      selectedOutcome: '',
      stake: '0',
      validations: {
        isMarketValid: false,
        stake: false,
      }
    }

    this.prevPage = this.prevPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.updateState = this.updateState.bind(this)
  }

  componentWillMount() {
    if (this.props.isConnected && !this.props.isMarketLoaded) {
      this.props.loadFullMarket()
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      (this.props.isConnected === false && nextProps.isConnected === true) &&
      !!nextProps.marketId
    ) {
      nextProps.loadFullMarket()
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
          />
        }
        { !isEmpty(p.market) &&
          <article className={FormStyles.Form}>
            { s.currentStep === 0 &&
              <ReportingReportForm
                market={p.market}
                updateState={this.updateState}
                isMarketValid={s.isMarketValid}
                selectedOutcome={s.selectedOutcome}
                stake={s.stake}
                validations={s.validations}
              />
            }
            { s.currentStep === 1 &&
              <ReportingReportConfirm
                market={p.market}
                isMarketValid={s.isMarketValid}
                selectedOutcome={s.selectedOutcome}
                stake={s.stake}
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
                onClick={Object.keys(s.validations).every(key => s.validations[key] === true) && this.nextPage}
              >Report
              </button>
              { s.currentStep === 1 &&
                <button className={FormStyles.Form__submit}>Submit</button>
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
