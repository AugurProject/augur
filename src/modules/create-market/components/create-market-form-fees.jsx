import React, { Component, PropTypes } from 'react';
import BigNumber from 'bignumber.js';

import Input from 'modules/common/components/input';
// import CreateMarketFormInputNotifications from 'modules/create-market/components/create-market-form-input-notifications';

import { formatPercent } from 'utils/format-number';

import { TWO } from 'modules/trade/constants/numbers';
import { TAKER_FEE_MIN, TAKER_FEE_MAX, MAKER_FEE_MIN } from 'modules/create-market/constants/new-market-constraints';
import newMarketCreationOrder from 'modules/create-market/constants/new-market-creation-order';
import { NEW_MARKET_FEES } from 'modules/create-market/constants/new-market-creation-steps';

export default class CreateMarketFormDescription extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: []
    };

    this.validateForm = this.validateForm.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentStep !== nextProps.currentStep &&
        newMarketCreationOrder[nextProps.currentStep] === NEW_MARKET_FEES
    ) {
      this.validateForm(nextProps.takerFee, nextProps.makerFee);
    }

    if (this.props.takerFee !== nextProps.takerFee ||
        this.props.makerFee !== nextProps.makerFee
    ) {
      this.validateForm(nextProps.takerFee, nextProps.makerFee);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.errors !== nextState.errors) {
      nextProps.updateValidity(!nextState.errors.length);
    }
  }

  validateForm(takerFee, makerFee) {
    const errors = [];

    const takerFeeErrors = validateTakerFee(takerFee);
    if (takerFeeErrors) errors.push(takerFeeErrors);

    const makerFeeErrors = validateMakerFee(makerFee, takerFee);
    if (!takerFeeErrors && makerFeeErrors) errors.push(makerFeeErrors);

    this.setState({ errors });
  }

  render() {
    const p = this.props;
    const s = this.state;

    const makerFeeMax = new BigNumber(p.takerFee || TAKER_FEE_MAX).dividedBy(TWO).toNumber();

    return (
      <article className={`create-market-form-part ${p.className || ''}`}>
        <div className="create-market-form-part-content">
          <div className="create-market-form-part-input">
            <aside>
              <h3>Taker Fee</h3>
              <span>Specify the fee paid by those taking an existing order from the order book.</span>
            </aside>
            <div className="vertical-form-divider" />
            <form>
              <Input
                type="number"
                value={p.takerFee}
                isIncrementable
                incrementAmount={0.1}
                min={TAKER_FEE_MIN}
                max={TAKER_FEE_MAX}
                updateValue={(takerFee) => {
                  const sanitizedTakerFee = takerFee instanceof BigNumber ? takerFee.toNumber() : parseFloat(takerFee);
                  const feeErrors = validateTakerFee(sanitizedTakerFee);
                  if (!feeErrors) {
                    p.updateNewMarket({ takerFee: sanitizedTakerFee });
                  } else {
                    this.setState({ errors: [feeErrors] });
                  }
                }}
                onChange={(takerFee) => {
                  const sanitizedTakerFee = takerFee instanceof BigNumber ? takerFee.toNumber() : parseFloat(takerFee);
                  const feeErrors = validateTakerFee(sanitizedTakerFee);
                  if (!feeErrors) {
                    p.updateNewMarket({ takerFee: sanitizedTakerFee });
                  } else {
                    this.setState({ errors: [feeErrors] });
                  }
                }}
              />
            </form>
          </div>
          <div className="create-market-form-part-input">
            <aside>
              <h3>Maker Fee</h3>
              <span>Specify the fee paid by those adding an order to the order book.</span>
            </aside>
            <div className="vertical-form-divider" />
            <form>
              <Input
                type="number"
                value={p.makerFee}
                isIncrementable
                incrementAmount={0.1}
                min={MAKER_FEE_MIN}
                max={makerFeeMax}
                updateValue={(makerFee) => {
                  const sanitizedMakerFee = makerFee instanceof BigNumber ? makerFee.toNumber() : parseFloat(makerFee);
                  const feeErrors = validateMakerFee(sanitizedMakerFee, p.takerFee);
                  if (!feeErrors) {
                    p.updateNewMarket({ makerFee: sanitizedMakerFee });
                  } else {
                    this.setState({ errors: [feeErrors] });
                  }
                }}
                onChange={(makerFee) => {
                  const sanitizedMakerFee = makerFee instanceof BigNumber ? makerFee.toNumber() : parseFloat(makerFee);
                  const feeErrors = validateMakerFee(sanitizedMakerFee, p.takerFee);
                  if (!feeErrors) {
                    p.updateNewMarket({ makerFee: sanitizedMakerFee });
                  } else {
                    this.setState({ errors: [feeErrors] });
                  }
                }}
              />
            </form>
          </div>
        </div>
      </article>
    );
  }
}

CreateMarketFormDescription.propTypes = {
  currentStep: PropTypes.number.isRequired,
  takerFee: PropTypes.number.isRequired,
  makerFee: PropTypes.number.isRequired,
  updateValidity: PropTypes.func.isRequired,
  updateNewMarket: PropTypes.func.isRequired
};

function validateTakerFee(takerFee) {
  if (!takerFee) {
    return 'Please specify a taker fee %';
  }
  if (Number.isNaN(takerFee) && !Number.isFinite(takerFee)) {
    return 'Trading fee must be a number';
  }
  if (takerFee < TAKER_FEE_MIN || takerFee > TAKER_FEE_MAX) {
    return `Trading fee must be between ${
      formatPercent(TAKER_FEE_MIN, true).full
      } and ${
      formatPercent(TAKER_FEE_MAX, true).full
      }`;
  }
}

function validateMakerFee(makerFee, takerFee) {
  let halfTakerFee;
  if (isNaN(parseFloat(takerFee))) {
    halfTakerFee = 0;
  } else {
    halfTakerFee = new BigNumber(takerFee).dividedBy(TWO).toNumber();
  }

  if (!makerFee && isNaN(makerFee)) {
    return 'Please specify a maker fee %';
  }
  if (Number.isNaN(makerFee) && !Number.isFinite(makerFee)) {
    return 'Maker fee must be a number';
  }
  if (makerFee < MAKER_FEE_MIN || makerFee > halfTakerFee) {
    return `Maker fee must be between ${
      formatPercent(MAKER_FEE_MIN, true).full
      } and ${
      formatPercent(halfTakerFee, true).full
      }`;
  }
}
