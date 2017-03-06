import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order';

export default class CreateMarketFormButtons extends Component {
  static propTypes = {
    currentStep: PropTypes.number.isRequired,
    isValid: PropTypes.bool.isRequired,
    updateValidity: PropTypes.func.isRequired,
    validations: PropTypes.array.isRequired,
    addValidationToNewMarket: PropTypes.func.isRequired,
    removeValidationFromNewMarket: PropTypes.func.isRequired,
    resetValidity: PropTypes.func.isRequired,
    updateNewMarket: PropTypes.func.isRequired,
    newMarket: PropTypes.object.isRequired,
    submitNewMarket: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      nextButtonCopy: '',
      nextStep: null
    };

    this.updateNextButtonCopy = this.updateNextButtonCopy.bind(this);
    this.handleNextButton = this.handleNextButton.bind(this);
    this.updateFormButtonHeight = this.updateFormButtonHeight.bind(this);
  }

  componentWillMount() {
    this.updateNextButtonCopy(this.props.currentStep, this.props.validations);
  }

  componentDidMount() {
    this.updateFormButtonHeight(this.props.currentStep);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isValid !== nextProps.isValid) {
      if (nextProps.isValid) {
        nextProps.addValidationToNewMarket(newMarketCreationOrder[nextProps.currentStep]);
      } else {
        nextProps.removeValidationFromNewMarket(newMarketCreationOrder[nextProps.currentStep]);
      }
    }

    if (this.props.currentStep !== nextProps.currentStep ||
        this.props.validations !== nextProps.validations
    ) {
      this.updateNextButtonCopy(nextProps.currentStep, nextProps.validations);
    }

    if (this.props.currentStep !== nextProps.currentStep) this.updateFormButtonHeight(nextProps.currentStep);
  }

  updateNextButtonCopy(currentStep, validations) {
    let nextButtonCopy = newMarketCreationOrder.find(step => !validations.find(validStep => step === validStep));

    if (currentStep === newMarketCreationOrder.length - 1) {
      nextButtonCopy = 'Create Market';
      this.props.updateValidity(true);
    } else if (nextButtonCopy === newMarketCreationOrder[currentStep] &&
      currentStep !== newMarketCreationOrder.length - 1
    ) {
      nextButtonCopy = newMarketCreationOrder.find((step) => {
        if (step === newMarketCreationOrder[currentStep]) {
          return false;
        }
        return !validations.find(validStep => step === validStep);
      });
    }

    this.setState({
      nextButtonCopy,
      nextStep: newMarketCreationOrder.indexOf(nextButtonCopy)
    });
  }

  handleBackButton() {
    console.log('go back!');
  }

  handleNextButton() {
    if (this.props.currentStep === newMarketCreationOrder.length - 1) {
      this.props.submitNewMarket(this.props.newMarket);
    } else {
      this.props.updateNewMarket({ currentStep: this.state.nextStep });
      this.props.resetValidity();
    }
  }

  updateFormButtonHeight(step) {
    let newHeight = 0;
    if (step !== 0) newHeight = this.formButtons.children[0].clientHeight;
    this.formButtons.style.height = `${newHeight}px`;
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <article
        ref={(formButtons) => { this.formButtons = formButtons; }}
        className="create-market-form-buttons"
      >
        <div className="create-market-form-buttons-container">
          <div className="create-market-form-buttons-content">
            <button
              className="unstyled"
              onClick={this.handleBackButton}
            >
              Back
            </button>
            <button
              className={classNames('unstyled', {
                'disable-button': !p.isValid
              })}
              onClick={() => p.isValid && this.handleNextButton}
            >
              Next: {s.nextButtonCopy}
            </button>
          </div>
        </div>
      </article>
    );
  }
}
