import React, { Component, PropTypes } from 'react';

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
      previousStep: null,
      stepIncreasing: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newMarket.step !== this.props.newMarket.step) {
      this.setState({
        previousStep: this.props.newMarket.step,
        currentStep: nextProps.newMarket.step,
        stepIncreasing: nextProps.newMarket.step > this.props.newMarket.step
      });
    }
  }

  render() {
    // const p = this.props;
    // const s = this.state;

    return (
      <article className="create-market-form">
        <CreateMarketFormType />
        <CreateMarketFormDescription />
        <CreateMarketFormResolution />
        <CreateMarketFormFeesDepth />
      </article>
    );
  }
}
