import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import CreateMarketFormType from 'modules/create-market/components/create-market-form-type';
import CreateMarketFormDescription from 'modules/create-market/components/create-market-form-description';
import CreateMarketFormResolution from 'modules/create-market/components/create-market-form-resolution';
import CreateMarketFormFeesDepth from 'modules/create-market/components/create-market-form-fees-depth';

export default class CreateMarketView extends Component {
  static propTypes = {
    newMarket: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      currentStep: props.newMarket.step,
      stepIncreasing: null,
      canAnimate: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newMarket.step !== this.props.newMarket.step) {
      this.setState({
        currentStep: nextProps.newMarket.step,
        stepIncreasing: nextProps.newMarket.step > this.props.newMarket.step,
        canAnimate: nextProps.newMarket.step > 1
      });
    }
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <article className="create-market-form">
        <CreateMarketFormType
          className={classNames({
            'hide-form': s.currentStep !== 1,
            'to-left': s.canAnimate && s.stepIncreasing && s.currentStep !== 1,
            'display-form': s.currentStep === 1,
            'from-left': s.canAnimate && s.stepDecreasing && s.currentStep === 1
          })}
          newMarket={p.newMarket}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormDescription
          className={classNames({
            'hide-form': s.currentStep !== 2,
            'to-left': s.canAnimate && s.stepIncreasing && s.currentStep !== 2,
            'to-right': s.canAnimate && s.stepDecreasing && s.currentStep !== 2,
            'display-form': s.currentStep === 2,
            'from-right': s.canAnimate && s.stepIncreasing && s.currentStep === 2,
            'from-left': s.canAnimate && s.stepDecreasing && s.currentStep === 2,
          })}
          newMarket={p.newMarket}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormResolution
          className={classNames({
            'hide-form': s.currentStep !== 3,
            'to-left': s.canAnimate && s.stepIncreasing && s.currentStep !== 3,
            'to-right': s.canAnimate && s.stepDecreasing && s.currentStep !== 3,
            'display-form': s.currentStep === 3,
            'from-right': s.canAnimate && s.stepIncreasing && s.currentStep === 3,
            'from-left': s.canAnimate && s.stepDecreasing && s.currentStep === 3,
          })}
          newMarket={p.newMarket}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormFeesDepth
          className={classNames({
            'hide-form': s.currentStep !== 4,
            'to-left': s.canAnimate && s.stepIncreasing && s.currentStep !== 4,
            'to-right': s.canAnimate && s.stepDecreasing && s.currentStep !== 4,
            'display-form': s.currentStep === 4,
            'from-right': s.canAnimate && s.stepIncreasing && s.currentStep === 4,
            'from-left': s.canAnimate && s.stepDecreasing && s.currentStep === 4,
          })}
          newMarket={p.newMarket}
          updateNewMarket={p.updateNewMarket}
        />
      </article>
    );
  }
}
