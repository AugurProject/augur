import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Input from 'modules/common/components/input';
import DropDown from 'modules/common/components/dropdown';

import isAddress from 'utils/is-address';

export default class AccountTransfer extends Component {
  static propTypes = {
    ethTokens: PropTypes.object.isRequired,
    eth: PropTypes.object.isRequired,
    rep: PropTypes.object.isRequired,
    transferFunds: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.ETH = 'ETHER';
    this.ETH_TOKEN = 'ETH_TOKEN';
    this.REP = 'REP';

    this.assetTypes = [
      {
        label: 'ETH',
        value: this.ETH
      },
      {
        label: 'ETH Tokens',
        value: this.ETH_TOKEN
      },
      {
        label: 'REP',
        value: this.REP
      }
    ];

    this.state = {
      upperBound: this.props.eth,
      selectedAsset: this.assetTypes[0].value,
      amount: '',
      to: '',
      isValid: false,
      isAmountValid: false,
      isAddressValid: false
    };

    this.updateSelectedAsset = this.updateSelectedAsset.bind(this);
  }

  updateSelectedAsset(selectedAsset) {
    let upperBound;
    switch (selectedAsset) {
      case this.ETH_TOKEN:
        upperBound = this.props.ethTokens;
        break;
      case this.REP:
        upperBound = this.props.rep;
        break;
      case this.ETH:
      default:
        upperBound = this.props.eth;
    }

    this.setState({
      selectedAsset,
      upperBound
    });
  }

  checkValidity(amount, address) {
    const amountToCheck = sanitizeArg(amount);
    const addressToCheck = sanitizeArg(address);

    let validity = {};

    if (amountToCheck !== '' || addressToCheck !== '') {
      if (
        amountToCheck !== '' &&
        (
          isNaN(parseFloat(amountToCheck)) ||
          !isFinite(amountToCheck) ||
          (amountToCheck > this.state.upperBound || amountToCheck <= 0)
        )
      ) {
        validity = {
          amount: '',
          isValid: false,
          isAmountValid: false
        };
      }
      if (addressToCheck !== '' && !isAddress(addressToCheck)) {
        validity = {
          ...validity,
          address: '',
          isValid: false,
          isAddressValid: false
        };
      }
    }

    this.setState({
      amount: validity.amount || amountToCheck,
      address: validity.address || addressToCheck,
      isValid: validity.isValid || true,
      isAmountValid: validity.isAmountValid || true,
      isAddressValid: validity.isAddressValid || true
    });

    function sanitizeArg(arg) {
      return (arg == null || arg === '') ? '' : arg;
    }
  }

  render() {
    const s = this.state;

    return (
      <article className="account-transfer account-sub-view">
        <aside>
          <h3>Tranfer Funds</h3>
          <p>Use this form to send your ETH Tokens, ETH, and REP to another address.</p>
        </aside>
        <div className="account-actions">
          <DropDown
            default={this.assetTypes[0].value}
            options={this.assetTypes}
            onChange={selectedAsset => this.updateSelectedAsset(selectedAsset)}
          />
          <Input
            isIncrementable
            incrementAmount={1}
            max={s.upperBound}
            min={0.1}
            value={s.amount}
            updateValue={amount => this.checkValidity(amount)}
            onChange={amount => this.checkValidity(amount)}
            placeholder={`Amount of ${this.assetTypes.find(asset => asset.value === s.selectedAsset).label} to send`}
          />
          <span
            className={classNames('account-transfer-amount-error', {
              'input-in-error': !s.isAmountValid
            })}
          >
            {`Amount must be between 0 and ${s.upperBound} ${this.assetTypes.find(asset => asset.value === s.selectedAsset).label}`}
          </span>
          <Input
            value={s.to}
            updateValue={to => this.setState({ to })}
            onChange={to => this.setState({ to })}
            placeholder={`Recipient address`}
          />
          <span
            className={classNames('account-transfer-amount-error', {
              'input-in-error': !s.isAddressValid
            })}
          >
            Not a valid Ethereum address
          </span>
          <button
            type="submit"
            className={classNames('account-convert-submit', { 'form-is-valid': s.isValid })}
          >
            Transfer
          </button>
        </div>
      </article>
    );
  }
}
