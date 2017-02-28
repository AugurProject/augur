import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import CreateMarketFormButtons from 'modules/create-market/components/create-market-form-buttons';
import CreateMarketFormType from 'modules/create-market/components/create-market-form-type';
import CreateMarketFormDescription from 'modules/create-market/components/create-market-form-description';
import CreateMarketFormResolutionSource from 'modules/create-market/components/create-market-form-resolution-source';

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

export default class CreateMarketForm extends Component {
  static propTypes = {
    newMarket: PropTypes.object.isRequired,
    updateNewMarket: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      newMarket: props.newMarket,
      currentStep: props.newMarket.currentStep,
      stepIncreasing: null,
      canAnimate: false,
      isValid: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newMarket.currentStep !== this.props.newMarket.currentStep) {
      this.setState({
        currentStep: nextProps.newMarket.currentStep,
        stepIncreasing: nextProps.newMarket.currentStep > this.props.newMarket.currentStep,
        canAnimate: nextProps.newMarket.currentStep > 1
      });
    }
  }

  componentWillUpdate(nextProps) {
    if (this.state.newMarket !== nextProps.newMarket) this.setState({ newMarket: nextProps.newMarket });
  }

  resetValidity() {
    this.setState({ isValid: false });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <article className={classNames('create-market-form', { 'no-preview': s.currentStep === 0 })}>
        <CreateMarketFormType
          className={classNames({
            'hide-form': newMarketCreationOrder[s.currentStep] !== NEW_MARKET_TYPE,
            'to-left': s.canAnimate && s.stepIncreasing && newMarketCreationOrder[s.currentStep] !== NEW_MARKET_TYPE,
            'display-form': newMarketCreationOrder[s.currentStep] === NEW_MARKET_TYPE,
            'from-left': s.canAnimate && !s.stepIncreasing && newMarketCreationOrder[s.currentStep] === NEW_MARKET_TYPE,
          })}
          type={s.newMarket.type}
          addValidationToNewMarket={p.addValidationToNewMarket}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormDescription
          className={classNames({
            'hide-form': newMarketCreationOrder[s.currentStep] !== NEW_MARKET_DESCRIPTION,
            'to-left': s.canAnimate && s.stepIncreasing && newMarketCreationOrder[s.currentStep] !== NEW_MARKET_DESCRIPTION,
            'to-right': s.canAnimate && !s.stepIncreasing && newMarketCreationOrder[s.currentStep] !== NEW_MARKET_DESCRIPTION,
            'display-form': newMarketCreationOrder[s.currentStep] === NEW_MARKET_DESCRIPTION,
            'from-right': s.canAnimate && s.stepIncreasing && newMarketCreationOrder[s.currentStep] === NEW_MARKET_DESCRIPTION,
            'from-left': s.canAnimate && !s.stepIncreasing && newMarketCreationOrder[s.currentStep] === NEW_MARKET_DESCRIPTION,
          })}
          description={s.newMarket.description}
          updateValidity={isValid => this.setState({ isValid })}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormResolutionSource
          className={classNames({
            'hide-form': newMarketCreationOrder[s.currentStep] !== NEW_MARKET_RESOLUTION_SOURCE,
            'to-left': s.canAnimate && s.stepIncreasing && newMarketCreationOrder[s.currentStep] !== NEW_MARKET_RESOLUTION_SOURCE,
            'to-right': s.canAnimate && !s.stepIncreasing && newMarketCreationOrder[s.currentStep] !== NEW_MARKET_RESOLUTION_SOURCE,
            'display-form': newMarketCreationOrder[s.currentStep] === NEW_MARKET_RESOLUTION_SOURCE,
            'from-right': s.canAnimate && s.stepIncreasing && newMarketCreationOrder[s.currentStep] === NEW_MARKET_RESOLUTION_SOURCE,
            'from-left': s.canAnimate && !s.stepIncreasing && newMarketCreationOrder[s.currentStep] === NEW_MARKET_RESOLUTION_SOURCE,
          })}
          resolutionSource={s.newMarket.resolutionSource}
          resolutionSourceURL={s.newMarket.resolutionSourceURL}
          updateValidity={isValid => this.setState({ isValid })}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormButtons
          currentStep={s.newMarket.currentStep}
          isValid={s.isValid}
          validations={s.newMarket.validations}
          resetValidity={() => this.resetValidity()}
          addValidationToNewMarket={p.addValidationToNewMarket}
          removeValidationFromNewMarket={p.removeValidationFromNewMarket}
          updateNewMarket={p.updateNewMarket}
        />
      </article>
    );
  }
}
