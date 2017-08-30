import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order'
import { NEW_MARKET_OUTCOMES, NEW_MARKET_REVIEW } from 'modules/create-market/constants/new-market-creation-steps'
import { BINARY } from 'modules/markets/constants/market-types'

export default class CreateMarketFormButtons extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    currentStep: PropTypes.number.isRequired,
    isValid: PropTypes.bool.isRequired,
    holdForUserAction: PropTypes.bool.isRequired,
    validations: PropTypes.array.isRequired,
    updateNewMarket: PropTypes.func.isRequired,
    newMarket: PropTypes.object.isRequired,
    submitNewMarket: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    updateButtonHeight: PropTypes.func.isRequired,
    updateValidations: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      nextButtonCopy: '',
      nextStep: null
    }

    this.updateNextButtonCopy = this.updateNextButtonCopy.bind(this)
    this.handleBackButton = this.handleBackButton.bind(this)
    this.handleNextButton = this.handleNextButton.bind(this)
    this.updateFormButtonHeight = this.updateFormButtonHeight.bind(this)
  }

  componentWillMount() {
    this.updateNextButtonCopy(this.props.currentStep, this.props.validations)
  }

  componentDidMount() {
    this.updateFormButtonHeight(this.props.currentStep)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentStep !== nextProps.currentStep ||
        this.props.validations !== nextProps.validations
    ) {
      this.updateNextButtonCopy(nextProps.currentStep, nextProps.validations)
    }

    if (this.props.currentStep !== nextProps.currentStep) this.updateFormButtonHeight(nextProps.currentStep)
  }

  updateNextButtonCopy(currentStep, validations) {
    let nextButtonCopy = newMarketCreationOrder.find(step => !validations.find(validStep => step === validStep))

    if (currentStep === newMarketCreationOrder.length - 1) {
      nextButtonCopy = 'Create Market'
      this.props.updateNewMarket({ isValid: true })
    } else if (nextButtonCopy === newMarketCreationOrder[currentStep] &&
      currentStep !== newMarketCreationOrder.length - 1
    ) {
      nextButtonCopy = newMarketCreationOrder.find((step) => {
        if (step === newMarketCreationOrder[currentStep]) {
          return false
        }
        return !validations.find(validStep => step === validStep)
      })
    } else if (nextButtonCopy == null) {
      nextButtonCopy = NEW_MARKET_REVIEW
    }

    this.setState({
      nextButtonCopy,
      nextStep: newMarketCreationOrder.indexOf(nextButtonCopy)
    })
  }

  handleBackButton() {
    if (this.props.type === BINARY && newMarketCreationOrder[this.props.currentStep - 1] === NEW_MARKET_OUTCOMES) {
      this.props.updateNewMarket({ currentStep: this.props.currentStep - 2 })
    } else {
      this.props.updateNewMarket({ currentStep: this.props.currentStep - 1 })
    }
  }

  handleNextButton() {
    if (this.props.currentStep === newMarketCreationOrder.length - 1) {
      this.props.submitNewMarket(this.props.newMarket, this.props.history)
    } else if (this.props.holdForUserAction) {
      this.props.updateValidations(this.props.isValid, this.props.currentStep)
      this.props.updateNewMarket({
        isValid: false,
        holdForUserAction: false,
        currentStep: this.state.nextStep
      })
    } else {
      this.props.updateNewMarket({
        isValid: false,
        currentStep: this.state.nextStep
      })
    }
  }

  updateFormButtonHeight(step) {
    let newHeight = 0
    if (step !== 0) newHeight = this.formButtons.children[0].clientHeight - 1 // -1 protects against a rendering issue during animation where the height changes to just under measured amount, causing a gap
    this.formButtons.style.height = `${newHeight}px`
    this.props.updateButtonHeight(newHeight)
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <article
        ref={(formButtons) => { this.formButtons = formButtons }}
        className="create-market-form-buttons"
        style={{ bottom: p.footerHeight }}
      >
        <div className="create-market-form-buttons-container">
          <div className="create-market-form-buttons-content">
            <button onClick={this.handleBackButton} >
              Back
            </button>
            <button
              className={classNames({
                disabled: !p.isValid
              })}
              onClick={p.isValid && this.handleNextButton}
            >
              Next: {s.nextButtonCopy}
            </button>
          </div>
        </div>
      </article>
    )
  }
}
