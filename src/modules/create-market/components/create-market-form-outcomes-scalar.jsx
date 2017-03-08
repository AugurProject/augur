import React, { Component, PropTypes } from 'react';
import BigNumber from 'bignumber.js';

import Input from 'modules/common/components/input';

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order';
import { NEW_MARKET_OUTCOMES } from 'modules/create-market/constants/new-market-creation-steps';

export default class CreateMarketFormOutcomesScalar extends Component {
  static propTypes = {
    currentStep: PropTypes.number.isRequired,
    scalarSmallNum: PropTypes.number,
    scalarBigNum: PropTypes.number,
    updateNewMarket: PropTypes.func.isRequired
  };

  static defaultProps = {
    errors: {
      small: [],
      big: []
    },
    warnings: {
      small: [],
      big: []
    },
    scalarSmallNum: '',
    scalarBigNum: ''
  };

  constructor(props) {
    super(props);

    this.validateForm = this.validateForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentStep !== nextProps.currentStep && newMarketCreationOrder[nextProps.currentStep] === NEW_MARKET_OUTCOMES) this.validateForm(nextProps.scalarSmallNum, nextProps.scalarBigNum);
  }

  validateForm(scalarSmallNumRaw, scalarBigNumRaw) {
    console.log('### validateForm -- ', scalarSmallNumRaw, scalarBigNumRaw);

    const errors = {
      small: [],
      big: []
    };
    const warnings = {
      small: [],
      big: []
    };
    const scalarSmallNum = scalarSmallNumRaw instanceof BigNumber ? scalarSmallNumRaw.toNumber() : parseFloat(scalarSmallNumRaw || 0);
    const scalarBigNum = scalarBigNumRaw instanceof BigNumber ? scalarBigNumRaw.toNumber() : parseFloat(scalarBigNumRaw || 0);
  }

  render() {
    const p = this.props;

    return (
      <div className="create-market-form-part-content">
        <div className="create-market-form-part-input">
          <aside>
            <h3>Minimum Value</h3>
            <span>What is the <strong>minimum</strong> value possible for this event.</span>
          </aside>
          <div className="vertical-form-divider" />
          <form onSubmit={e => e.preventDefault()} >
            <Input
              className="constrained-width"
              type="number"
              isIncrementable
              incrementAmount={1}
              value={p.scalarSmallNum}
              updateValue={scalarSmallNum => this.validateForm(scalarSmallNum, undefined)}
              onChange={scalarSmallNum => this.validateForm(scalarSmallNum, undefined)}
            />
          </form>
        </div>
        <div className="create-market-form-part-input">
          <aside>
            <h3>Maximum Value</h3>
            <span>What is the <strong>maximum</strong> value possible for this event.</span>
          </aside>
          <div className="vertical-form-divider" />
          <form onSubmit={e => e.preventDefault()} >
            <Input
              className="constrained-width"
              type="number"
              isIncrementable
              incrementAmount={1}
              value={p.scalarBigNum}
              updateValue={scalarBigNum => this.validateForm(undefined, scalarBigNum)}
              onChange={scalarBigNum => this.validateForm(undefined, scalarBigNum)}
            />
          </form>
        </div>
      </div>
    );
  }
}
