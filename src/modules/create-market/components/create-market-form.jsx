import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import CreateMarketFormButtons from 'modules/create-market/components/create-market-form-buttons';
import CreateMarketFormType from 'modules/create-market/components/create-market-form-type';
import CreateMarketFormDescription from 'modules/create-market/components/create-market-form-description';
import CreateMarketFormExpirySource from 'modules/create-market/components/create-market-form-expiry-source';
import CreateMarketFormEndDate from 'modules/create-market/components/create-market-form-end-date';
import CreateMarketFormDetails from 'modules/create-market/components/create-market-form-details';
import CreateMarketFormTopic from 'modules/create-market/components/create-market-form-topic';
import CreateMarketFormKeywords from 'modules/create-market/components/create-market-form-keywords';
import CreateMarketFormFees from 'modules/create-market/components/create-market-form-fees';

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order';
import {
  NEW_MARKET_TYPE,
  NEW_MARKET_DESCRIPTION,
  NEW_MARKET_OUTCOMES,
  NEW_MARKET_RESOLUTION_SOURCE,
  NEW_MARKET_END_DATE,
  NEW_MARKET_DETAILS,
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
          type={p.newMarket.type}
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
          description={p.newMarket.description}
          updateValidity={isValid => this.setState({ isValid })}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormExpirySource
          className={classNames({
            'hide-form': newMarketCreationOrder[s.currentStep] !== NEW_MARKET_RESOLUTION_SOURCE,
            'to-left': s.canAnimate && s.stepIncreasing && newMarketCreationOrder[s.currentStep] !== NEW_MARKET_RESOLUTION_SOURCE,
            'to-right': s.canAnimate && !s.stepIncreasing && newMarketCreationOrder[s.currentStep] !== NEW_MARKET_RESOLUTION_SOURCE,
            'display-form': newMarketCreationOrder[s.currentStep] === NEW_MARKET_RESOLUTION_SOURCE,
            'from-right': s.canAnimate && s.stepIncreasing && newMarketCreationOrder[s.currentStep] === NEW_MARKET_RESOLUTION_SOURCE,
            'from-left': s.canAnimate && !s.stepIncreasing && newMarketCreationOrder[s.currentStep] === NEW_MARKET_RESOLUTION_SOURCE,
          })}
          expirySourceType={p.newMarket.expirySourceType}
          expirySource={p.newMarket.expirySource}
          updateValidity={isValid => this.setState({ isValid })}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormEndDate
          className={classNames({
            'hide-form': newMarketCreationOrder[s.currentStep] !== NEW_MARKET_END_DATE,
            'to-left': s.canAnimate && s.stepIncreasing && newMarketCreationOrder[s.currentStep] !== NEW_MARKET_END_DATE,
            'to-right': s.canAnimate && !s.stepIncreasing && newMarketCreationOrder[s.currentStep] !== NEW_MARKET_END_DATE,
            'display-form': newMarketCreationOrder[s.currentStep] === NEW_MARKET_END_DATE,
            'from-right': s.canAnimate && s.stepIncreasing && newMarketCreationOrder[s.currentStep] === NEW_MARKET_END_DATE,
            'from-left': s.canAnimate && !s.stepIncreasing && newMarketCreationOrder[s.currentStep] === NEW_MARKET_END_DATE,
          })}
          endDate={p.newMarket.endDate}
          updateValidity={isValid => this.setState({ isValid })}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormDetails
          className={classNames({
            'hide-form': newMarketCreationOrder[s.currentStep] !== NEW_MARKET_DETAILS,
            'to-left': s.canAnimate && s.stepIncreasing && newMarketCreationOrder[s.currentStep] !== NEW_MARKET_DETAILS,
            'to-right': s.canAnimate && !s.stepIncreasing && newMarketCreationOrder[s.currentStep] !== NEW_MARKET_DETAILS,
            'display-form': newMarketCreationOrder[s.currentStep] === NEW_MARKET_DETAILS,
            'from-right': s.canAnimate && s.stepIncreasing && newMarketCreationOrder[s.currentStep] === NEW_MARKET_DETAILS,
            'from-left': s.canAnimate && !s.stepIncreasing && newMarketCreationOrder[s.currentStep] === NEW_MARKET_DETAILS,
          })}
          currentStep={p.newMarket.currentStep}
          detailsText={p.newMarket.detailsText}
          updateValidity={isValid => this.setState({ isValid })}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormTopic
          className={classNames({
            'hide-form': newMarketCreationOrder[s.currentStep] !== NEW_MARKET_TOPIC,
            'to-left': s.canAnimate && s.stepIncreasing && newMarketCreationOrder[s.currentStep] !== NEW_MARKET_TOPIC,
            'to-right': s.canAnimate && !s.stepIncreasing && newMarketCreationOrder[s.currentStep] !== NEW_MARKET_TOPIC,
            'display-form': newMarketCreationOrder[s.currentStep] === NEW_MARKET_TOPIC,
            'from-right': s.canAnimate && s.stepIncreasing && newMarketCreationOrder[s.currentStep] === NEW_MARKET_TOPIC,
            'from-left': s.canAnimate && !s.stepIncreasing && newMarketCreationOrder[s.currentStep] === NEW_MARKET_TOPIC,
          })}
          topic={p.newMarket.topic}
          updateValidity={isValid => this.setState({ isValid })}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormKeywords
          className={classNames({
            'hide-form': newMarketCreationOrder[s.currentStep] !== NEW_MARKET_KEYWORDS,
            'to-left': s.canAnimate && s.stepIncreasing && newMarketCreationOrder[s.currentStep] !== NEW_MARKET_KEYWORDS,
            'to-right': s.canAnimate && !s.stepIncreasing && newMarketCreationOrder[s.currentStep] !== NEW_MARKET_KEYWORDS,
            'display-form': newMarketCreationOrder[s.currentStep] === NEW_MARKET_KEYWORDS,
            'from-right': s.canAnimate && s.stepIncreasing && newMarketCreationOrder[s.currentStep] === NEW_MARKET_KEYWORDS,
            'from-left': s.canAnimate && !s.stepIncreasing && newMarketCreationOrder[s.currentStep] === NEW_MARKET_KEYWORDS,
          })}
          currentStep={p.newMarket.currentStep}
          keywords={p.newMarket.keywords}
          updateValidity={isValid => this.setState({ isValid })}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormFees
          className={classNames({
            'hide-form': newMarketCreationOrder[s.currentStep] !== NEW_MARKET_FEES,
            'to-left': s.canAnimate && s.stepIncreasing && newMarketCreationOrder[s.currentStep] !== NEW_MARKET_FEES,
            'to-right': s.canAnimate && !s.stepIncreasing && newMarketCreationOrder[s.currentStep] !== NEW_MARKET_FEES,
            'display-form': newMarketCreationOrder[s.currentStep] === NEW_MARKET_FEES,
            'from-right': s.canAnimate && s.stepIncreasing && newMarketCreationOrder[s.currentStep] === NEW_MARKET_FEES,
            'from-left': s.canAnimate && !s.stepIncreasing && newMarketCreationOrder[s.currentStep] === NEW_MARKET_FEES,
          })}
          currentStep={p.newMarket.currentStep}
          takerFee={p.newMarket.takerFee}
          makerFee={p.newMarket.makerFee}
          updateValidity={isValid => this.setState({ isValid })}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormButtons
          currentStep={p.newMarket.currentStep}
          isValid={s.isValid}
          validations={p.newMarket.validations}
          resetValidity={() => this.resetValidity()}
          addValidationToNewMarket={p.addValidationToNewMarket}
          removeValidationFromNewMarket={p.removeValidationFromNewMarket}
          updateNewMarket={p.updateNewMarket}
        />
      </article>
    );
  }
}
