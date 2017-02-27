import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order';
import {
  NEW_MARKET_TYPE,
  NEW_MARKET_DESCRIPTION,
  NEW_MARKET_OUTCOMES,
  NEW_MARKET_RESOLUTION_SOURCE,
  NEW_MARKET_END_DATE,
  NEW_MARKET_ADDITIONAL_INFORMATION,
  NEW_MARKET_TOPIC,
  NEW_MARKET_KEYWORDS,
  NEW_MARKET_FEES,
  NEW_MARKET_ORDER_BOOK,
  NEW_MARKET_REVIEW
} from 'modules/create-market/constants/new-market-creation-steps';

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
    console.log('newMarketCreationOrder -- ', newMarketCreationOrder);
    console.log('validations -- ', validations);

    let firstInvalidStep = newMarketCreationOrder.find(step => !validations.find(validStep => step === validStep));

    console.log('currentStep -- ', currentStep, newMarketCreationOrder[currentStep], newMarketCreationOrder.length);
    console.log('firstInvalidStep -- ', firstInvalidStep);

    if (firstInvalidStep === newMarketCreationOrder[currentStep] &&
        currentStep === newMarketCreationOrder.length - 1
    ) {
      console.log('on last step');
      this.setState({ nextButtonCopy: 'Create Market' });
    } else if (firstInvalidStep === newMarketCreationOrder[currentStep] &&
      currentStep !== newMarketCreationOrder.length - 1
    ) {
      console.log('running again...');
      firstInvalidStep = newMarketCreationOrder.find((step) => {
        if (step === newMarketCreationOrder[currentStep]) {
          return false;
        }
        return !validations.find(validStep => step === validStep);
      });
    }

    console.log('firstInvalidStep -- ', firstInvalidStep);
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

// let nextButtonCopy = '';
//
// const nextStep =
//
// switch (newMarketCreationOrder[p.currentStep]) {
//   case NEW_MARKET_DESCRIPTION:
//     nextButtonCopy = 'Description';
//     break;
//   default:
//     nextButtonCopy = 'test';
// }
