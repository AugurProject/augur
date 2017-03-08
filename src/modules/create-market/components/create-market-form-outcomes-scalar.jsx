import React, { Component, PropTypes } from 'react';
import BigNumber from 'bignumber.js';

import Input from 'modules/common/components/input';
import CreateMarketFormInputNotifications from 'modules/create-market/components/create-market-form-input-notifications';

import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order';
import { NEW_MARKET_OUTCOMES } from 'modules/create-market/constants/new-market-creation-steps';

export default class CreateMarketFormOutcomesScalar extends Component {
  static propTypes = {
    currentStep: PropTypes.number.isRequired,
    scalarSmallNum: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    scalarBigNum: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    updateValidity: PropTypes.func.isRequired,
    updateNewMarket: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      errors: {
        small: [],
        big: []
      }
    };

    this.validateForm = this.validateForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentStep !== nextProps.currentStep && newMarketCreationOrder[nextProps.currentStep] === NEW_MARKET_OUTCOMES) this.validateForm(nextProps.scalarSmallNum, nextProps.scalarBigNum);
  }

  validateForm(scalarSmallNumRaw, scalarBigNumRaw) {
    const errors = {
      small: [],
      big: []
    };

    const sanitizeValue = (value, type) => {
      if (value == null) {
        if (type === 'big') {
          return this.props.scalarBigNum;
        }
        return this.props.scalarSmallNum;
      } else if (value instanceof BigNumber) {
        return value.toNumber();
      } else if (value !== '') {
        return parseFloat(value);
      }

      return value;
    };

    const scalarSmallNum = sanitizeValue(scalarSmallNumRaw);
    const scalarBigNum = sanitizeValue(scalarBigNumRaw, 'big');

    if (scalarBigNumRaw == null && scalarBigNum !== '' && scalarSmallNum >= scalarBigNum) {
      errors.small.push(`Must be smaller than maximum value of: ${scalarBigNum}`);
    } else if (scalarBigNum !== '' && scalarBigNum <= scalarSmallNum) {
      errors.big.push(`Must be greater than minimum value of: ${scalarSmallNum}`);
    }

    if (errors.small.length || errors.big.length || scalarSmallNum === '' || scalarBigNum === '') {
      this.props.updateValidity(false);
    } else {
      this.props.updateValidity(true);
    }

    this.setState({ errors });

    this.props.updateNewMarket({ scalarSmallNum, scalarBigNum });
  }

  render() {
    const p = this.props;
    const s = this.state;

    const maxSmall = p.scalarBigNum === '' ? undefined : p.scalarBigNum;
    const minBig = p.scalarSmallNum === '' ? undefined : p.scalarSmallNum;

    // console.log(s.errors.small, s.errors.big);

    return (
      <article className="create-market-form-part-content">
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
              max={maxSmall}
              value={p.scalarSmallNum}
              updateValue={scalarSmallNum => this.validateForm(scalarSmallNum, undefined)}
              onChange={scalarSmallNum => this.validateForm(scalarSmallNum, undefined)}
            />
            <CreateMarketFormInputNotifications
              errors={s.errors.small}
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
              min={minBig}
              value={p.scalarBigNum}
              updateValue={scalarBigNum => this.validateForm(undefined, scalarBigNum)}
              onChange={scalarBigNum => this.validateForm(undefined, scalarBigNum)}
            />
            <CreateMarketFormInputNotifications
              errors={s.errors.big}
            />
          </form>
        </div>
      </article>
    );
  }
}
