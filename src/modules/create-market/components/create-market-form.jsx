import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import CreateMarketFormType from 'modules/create-market/components/create-market-form-type';

import { newMarketCreationOrder, NEW_MARKET_TYPE } from 'modules/create-market/constants/new-market-creation-order';

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
      canAnimate: false
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

  render() {
    const p = this.props;
    const s = this.state;

    console.log('current step -- ', newMarketCreationOrder[s.currentStep]);

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
          progressToNextStep={p.progressToNextStep}
        />
      </article>
    );
  }
}

// <CreateMarketFormType
//   className={classNames({
//     'hide-form': s.currentStep !== 1,
//     'to-left': s.canAnimate && s.stepIncreasing && s.currentStep !== 1,
//     'display-form': s.currentStep === 1,
//     'from-left': s.canAnimate && s.stepDecreasing && s.currentStep === 1
//   })}
//   newMarket={p.newMarket}
//   updateNewMarket={p.updateNewMarket}
// />
// <CreateMarketFormDescription
//   className={classNames({
//     'hide-form': s.currentStep !== 2,
//     'to-left': s.canAnimate && s.stepIncreasing && s.currentStep !== 2,
//     'to-right': s.canAnimate && s.stepDecreasing && s.currentStep !== 2,
//     'display-form': s.currentStep === 2,
//     'from-right': s.canAnimate && s.stepIncreasing && s.currentStep === 2,
//     'from-left': s.canAnimate && s.stepDecreasing && s.currentStep === 2,
//   })}
//   newMarket={p.newMarket}
//   updateNewMarket={p.updateNewMarket}
// />
// <CreateMarketFormResolution
//   className={classNames({
//     'hide-form': s.currentStep !== 3,
//     'to-left': s.canAnimate && s.stepIncreasing && s.currentStep !== 3,
//     'to-right': s.canAnimate && s.stepDecreasing && s.currentStep !== 3,
//     'display-form': s.currentStep === 3,
//     'from-right': s.canAnimate && s.stepIncreasing && s.currentStep === 3,
//     'from-left': s.canAnimate && s.stepDecreasing && s.currentStep === 3,
//   })}
//   newMarket={p.newMarket}
//   updateNewMarket={p.updateNewMarket}
// />
// <CreateMarketFormFeesDepth
//   className={classNames({
//     'hide-form': s.currentStep !== 4,
//     'to-left': s.canAnimate && s.stepIncreasing && s.currentStep !== 4,
//     'to-right': s.canAnimate && s.stepDecreasing && s.currentStep !== 4,
//     'display-form': s.currentStep === 4,
//     'from-right': s.canAnimate && s.stepIncreasing && s.currentStep === 4,
//     'from-left': s.canAnimate && s.stepDecreasing && s.currentStep === 4,
//   })}
//   newMarket={p.newMarket}
//   updateNewMarket={p.updateNewMarket}
// /></span>
