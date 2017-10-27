import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Helmet } from 'react-helmet'

import MarketPreview from 'modules/market/components/market-preview/market-preview'
import ReportingDisputeForm from 'modules/reporting/components/reporting-dispute-form/reporting-dispute-form'
import ReportingDisputeConfirm from 'modules/reporting/components/reporting-dispute-confirm/reporting-dispute-confirm'

import FormStyles from 'modules/common/less/form'

export default class ReportingDispute extends Component {

  static propTypes = {
    market: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      stakeIsRequired: this.calcIsStakeRequired(),
      minimumStakeRequired: false,
      currentStep: 0,
      isFormValid: true,
      isMarketValid: null,
      selectedOutcome: '',
      stake: '',
      validations: {
        isMarketValid: false,
      }
    }

    if (this.calcIsStakeRequired()) {
      this.state.validations.stake = false
    }

    this.prevPage = this.prevPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.updateState = this.updateState.bind(this)
    this.calcIsStakeRequired = this.calcIsStakeRequired.bind(this)
    this.calcMinimumStakeRequired = this.calcMinimumStakeRequired.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.market.otherOutcomes !== this.props.market.otherOutcomes) {
      this.setStake({ stakeIsRequired: this.calcIsStakeRequired() })
    }
  }

  prevPage() {
    this.setState({ currentStep: this.state.currentStep <= 0 ? 0 : this.state.currentStep - 1 })
  }

  nextPage() {
    this.setState({ currentStep: this.state.currentStep >= 1 ? 1 : this.state.currentStep + 1 })
  }

  updateState(newState) {
    if ((newState.hasOwnProperty('selectedOutcome') && newState.selectedOutcome !== this.state.selectedOutcome)
      || (newState.hasOwnProperty('isMarketValid') && newState.isMarketValid !== this.state.isMarketValid)) {
      newState.minimumStakeRequired = this.calcMinimumStakeRequired()
    }
    console.log(newState)
    this.setState(newState)
  }

  calcIsStakeRequired() {
    const currentOutcome = { ...this.props.market.currentOutcome }
    currentOutcome.stake = this.props.market.currentOutcome.stake - this.props.disputeBond
    return [...this.props.market.otherOutcomes, currentOutcome].every(outcome => outcome.stake <= 0)
  }

  calcMinimumStakeRequired() {
    let minimumStake = false
    // this.state.selectedOutcome is lagging one step behind now that this function is being called before
    // the selectedOutcome state is updated, rather than after
    if (this.calcIsStakeRequired() && this.state.selectedOutcome) {
      minimumStake = '0'
      const outcomeObject = this.props.market.otherOutcomes.filter(outcome => outcome.name === this.state.selectedOutcome)
      if (this.state.isMarketValid && outcomeObject.length) {
        minimumStake = `${Math.abs(outcomeObject[0].stake)}`
      }
    }

    return minimumStake
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <section>
        <Helmet>
          <title>Dispute Report</title>
        </Helmet>
        <MarketPreview
          {...p.market}
          isLogged={p.isLogged}
          location={p.location}
          history={p.history}
          cardStyle="single-card"
          buttonText="View"
        />
        <article className={FormStyles.Form}>
          { s.currentStep === 0 &&
            <ReportingDisputeForm
              market={p.market}
              updateState={this.updateState}
              disputeBond={p.disputeBond}
              isMarketValid={s.isMarketValid}
              selectedOutcome={s.selectedOutcome}
              stake={s.stake}
              validations={s.validations}
              stakeIsRequired={s.stakeIsRequired}
              minimumStakeRequired={s.minimumStakeRequired}
            />
          }
          { s.currentStep === 1 &&
            <ReportingDisputeConfirm
              market={p.market}
              isMarketValid={s.isMarketValid}
              selectedOutcome={s.selectedOutcome}
              stake={s.stake}
              disputeBond={p.disputeBond}
            />
          }
          <div className={FormStyles.Form__navigation}>
            <button
              className={classNames(FormStyles.Form__prev, { [`${FormStyles['hide-button']}`]: s.currentStep === 0 })}
              onClick={this.prevPage}
            >Previous</button>
            <button
              className={classNames(FormStyles.Form__next, { [`${FormStyles['hide-button']}`]: s.currentStep === 1 })}
              disabled={!Object.keys(s.validations).every(key => s.validations[key] === true)}
              onClick={Object.keys(s.validations).every(key => s.validations[key] === true) && this.nextPage}
            >Dispute</button>
            { s.currentStep === 1 &&
              <button className={FormStyles.Form__submit}>Submit</button>
            }
          </div>
        </article>
      </section>
    )
  }
}
