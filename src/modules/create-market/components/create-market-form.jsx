import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import CreateMarketFormButtons from 'modules/create-market/components/create-market-form-buttons';
import CreateMarketFormType from 'modules/create-market/components/create-market-form-type';
import CreateMarketFormDescription from 'modules/create-market/components/create-market-form-description';

import {
  newMarketCreationOrder,
  NEW_MARKET_TYPE,
  NEW_MARKET_DESCRIPTION
} from 'modules/create-market/constants/new-market-creation-order';

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
      isValid: null
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
    this.setState({ isValid: null });
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
        <CreateMarketFormButtons
          isValid={s.isValid}
          validations={p.validations}
          resetValidity={() => this.resetValidity()}
          updateNewMarket={p.updateNewMarket}
        />
      </article>
    );
  }
}
