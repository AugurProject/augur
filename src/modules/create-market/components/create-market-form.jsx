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
            'hide-form-to-left': s.canAnimate && s.stepIncreasing && s.currentStep > 1,
            'display-form-from-left': s.canAnimate && s.stepDecreasing && s.currentStep === 1
          })}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormDescription
          className={classNames({
            'hide-form-to-left': s.canAnimate && s.stepIncreasing && s.currentStep > 2,
            'hide-form-to-right': s.canAnimate && s.stepDecreasing && s.currentStep < 2,
            'display-form-from-left': s.canAnimate && s.stepDecreasing && s.currentStep === 2,
            'display-form-from-right': s.canAnimate && s.stepIncreasing && s.currentStep === 2
          })}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormResolution
          className={classNames({
            'hide-form-to-left': s.canAnimate && s.stepIncreasing && s.currentStep > 3,
            'hide-form-to-right': s.canAnimate && s.stepDecreasing && s.currentStep < 3,
            'display-form-from-left': s.canAnimate && s.stepDecreasing && s.currentStep === 3,
            'display-form-from-right': s.canAnimate && s.stepIncreasing && s.currentStep === 3
          })}
          updateNewMarket={p.updateNewMarket}
        />
        <CreateMarketFormFeesDepth
          className={classNames({
            'hide-form-to-left': s.canAnimate && s.stepIncreasing && s.currentStep > 4,
            'hide-form-to-right': s.canAnimate && s.stepDecreasing && s.currentStep < 4,
            'display-form-from-left': s.canAnimate && s.stepDecreasing && s.currentStep === 4,
            'display-form-from-right': s.canAnimate && s.stepIncreasing && s.currentStep === 4
          })}
          updateNewMarket={p.updateNewMarket}
        />
      </article>
    );
  }
}
