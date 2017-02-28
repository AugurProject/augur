import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order';

export default class CreateMarketFormButtons extends Component {
  static propTypes = {
    currentStep: PropTypes.number.isRequired,
    isValid: PropTypes.bool.isRequired,
    validations: PropTypes.array.isRequired,
    addValidationToNewMarket: PropTypes.func.isRequired,
    removeValidationFromNewMarket: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      nextButtonCopy: ''
    };

    this.updateNextButtonCopy = this.updateNextButtonCopy.bind(this);
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
    let firstInvalidStep = newMarketCreationOrder.find(step => !validations.find(validStep => step === validStep));

    if (firstInvalidStep === newMarketCreationOrder[currentStep] &&
        currentStep === newMarketCreationOrder.length - 1
    ) {
      this.setState({ nextButtonCopy: 'Create Market' });
    } else if (firstInvalidStep === newMarketCreationOrder[currentStep] &&
      currentStep !== newMarketCreationOrder.length - 1
    ) {
      firstInvalidStep = newMarketCreationOrder.find((step) => {
        if (step === newMarketCreationOrder[currentStep]) {
          return false;
        }
        return !validations.find(validStep => step === validStep);
      });
    }

    this.setState({ nextButtonCopy: firstInvalidStep });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <article className="create-market-form-buttons">
        <button className={classNames({ 'hide-button': !p.isValid && p.currentStep < 1 })}>
          {s.nextButtonCopy}
        </button>
      </article>
    );
  }
}
