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
  }

  componentWillMount() {
    this.updateNextButtonCopy(this.props.currentStep, this.props.validations);
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

  handleNextButton() {
    if (this.props.currentStep === newMarketCreationOrder.length - 1) {
      console.log('last step -- ', this.props.newMarket);
      this.props.submitNewMarket(this.props.newMarket);
    } else {
      this.props.updateNewMarket({ currentStep: this.state.nextStep });
      this.props.resetValidity();
    }
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <article className="create-market-form-buttons">
        <button
          className={classNames({
            'hide-button': !p.isValid || p.currentStep < 1
          })}
          onClick={this.handleNextButton}
        >
          {s.nextButtonCopy}
        </button>
      </article>
    );
  }
}
