import React, { Component } from 'react'
import PropTypes from 'prop-types'

import InputList from 'modules/common/components/input-list'

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'
import { NEW_MARKET_OUTCOMES } from 'modules/create-market/constants/new-market-creation-steps'
import { CATEGORICAL_OUTCOMES_MIN_NUM, CATEGORICAL_OUTCOMES_MAX_NUM, CATEGORICAL_OUTCOME_MAX_LENGTH } from 'modules/create-market/constants/new-market-constraints'

export default class CreateMarketFormOutcomesCategorical extends Component {
  static propTypes = {
    currentStep: PropTypes.number.isRequired,
    outcomes: PropTypes.array.isRequired,
    updateValidity: PropTypes.func.isRequired,
    updateNewMarket: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      errors: [],
      warnings: []
    }

    this.validateForm = this.validateForm.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentStep !== nextProps.currentStep && newMarketCreationOrder[nextProps.currentStep] === NEW_MARKET_OUTCOMES) this.validateForm(nextProps.outcomes)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentStep !== this.props.currentStep &&
      this.props.currentStep === newMarketCreationOrder.indexOf(NEW_MARKET_OUTCOMES)
    ) {
      this.defaultFormToFocus.getElementsByTagName('input')[0].focus()
    }
  }

  validateForm(outcomes) {
    const errors = Array(outcomes.length)
    errors.fill('')

    const warnings = Array(outcomes.length)
    warnings.fill('')

    outcomes.forEach((outcome, i) => {
      if (outcomes.indexOf(outcome) > -1 && outcomes.indexOf(outcome) !== i) {
        errors[i] = 'Category must be unique'
      } else if (outcome.length === CATEGORICAL_OUTCOME_MAX_LENGTH) {
        warnings[i] = `Outcome max length is: ${CATEGORICAL_OUTCOME_MAX_LENGTH}`
      }
    })

    if (errors.find(error => error.length) || outcomes.length < 2) {
      this.props.updateValidity(false)
    } else {
      this.props.updateValidity(true)
    }

    this.setState({ errors, warnings })

    this.props.updateNewMarket({ outcomes })
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <article className="create-market-form-part-content">
        <div className="create-market-form-part-input">
          <aside>
            <h3>Potential Outcomes</h3>
            <span>Input between <strong>two</strong> - <strong>eight</strong> potential outcomes for this market.</span>
          </aside>
          <div className="vertical-form-divider" />
          <form
            ref={(defaultFormToFocus) => { this.defaultFormToFocus = defaultFormToFocus }}
            onSubmit={e => e.preventDefault()}
          >
            <InputList
              list={p.outcomes}
              errors={s.errors}
              warnings={s.warnings}
              listMinElements={CATEGORICAL_OUTCOMES_MIN_NUM}
              listMaxElements={CATEGORICAL_OUTCOMES_MAX_NUM}
              itemMaxLength={CATEGORICAL_OUTCOME_MAX_LENGTH}
              onChange={outcomes => this.validateForm(outcomes)}
            />
          </form>
        </div>
      </article>
    )
  }
}
