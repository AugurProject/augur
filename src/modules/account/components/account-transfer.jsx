import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import BigNumber from 'bignumber.js';

import Input from 'modules/common/components/input';
// import DropDown from 'modules/common/components/dropdown';
import EtherLogo from 'modules/common/components/ether-logo';
import EtherTokenLogo from 'modules/common/components/ether-token-logo';
import AugurLogoIcon from 'modules/common/components/augur-logo-icon';

import { ETH_TOKEN, ETH, REP } from 'modules/account/constants/asset-types';

import isAddress from 'modules/auth/helpers/is-address';

export default class AccountTransfer extends Component {
  static propTypes = {
    ethTokens: PropTypes.object.isRequired,
    eth: PropTypes.object.isRequired,
    rep: PropTypes.object.isRequired,
    transferFunds: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.assetTypes = [
      {
        label: 'ETH',
        value: ETH
      },
      {
        label: 'ETH Tokens',
        value: ETH_TOKEN
      },
      {
        label: 'REP',
        value: REP
      }
    ];

    this.DEFAULT_STATE = {
      upperBound: this.props.eth.value,
      selectedAsset: this.assetTypes[0].value,
      amount: '',
      address: '',
      isValid: null,
      isAmountValid: null,
      isAddressValid: null
    };

    this.state = this.DEFAULT_STATE;

    this.updateSelectedAsset = this.updateSelectedAsset.bind(this);
    this.validateAmount = this.validateAmount.bind(this);
    this.validateAddress = this.validateAddress.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.isAmountValid !== nextState.isAmountValid ||
      this.state.isAddressValid !== nextState.isAddressValid
    ) {
      this.validateForm(nextState.isAmountValid, nextState.isAddressValid);
    }
  }

  updateSelectedAsset(selectedAsset) {
    let upperBound;
    switch (selectedAsset) {
      case this.ETH_TOKEN:
        upperBound = this.props.ethTokens.value;
        break;
      case this.REP:
        upperBound = this.props.rep.value;
        break;
      case this.ETH:
      default:
        upperBound = this.props.eth.value;
    }

    this.setState({
      selectedAsset,
      upperBound
    });
  }

  validateAmount(amount) {
    const sanitizedAmount = sanitizeArg(amount);

    if (isNaN(parseFloat(sanitizedAmount)) || !isFinite(sanitizedAmount) || (sanitizedAmount > this.state.upperBound || sanitizedAmount <= 0)) {
      this.setState({
        amount: sanitizedAmount,
        isAmountValid: false
      });
      return;
    }

    this.setState({
      amount: sanitizedAmount,
      isAmountValid: true
    });
  }

  validateAddress(address) {
    const sanitizedAddress = sanitizeArg(address);

    if (!isAddress(sanitizedAddress)) {
      this.setState({
        address: sanitizedAddress,
        isAddressValid: false
      });
      return;
    }

    this.setState({
      address: sanitizedAddress,
      isAddressValid: true
    });
  }

  validateForm(isAmountValid, isAddressValid) {
    if (isAmountValid && isAddressValid) {
      this.setState({
        isValid: true
      });
    } else {
      this.setState({
        isValid: false
      });
    }
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <article className="account-transfer account-sub-view">
        <aside>
          <h3>Tranfer Funds</h3>
          <p>Use this form to send your ETH Tokens, ETH, and REP to another address.</p>
        </aside>
        <div className="account-actions">
          <form
            onSubmit={(e) => {
              e.preventDefault();

              console.log('submit transfer');

              if (s.isValid) {
                const stringedAmount = s.amount instanceof BigNumber ? s.amount.toString() : s.amount;
                p.transferFunds(stringedAmount, s.selectedAsset, s.to);

                this.setState(this.DEFAULT_STATE);
              }
            }}
          >
            <div className="account-transfer-step account-transfer-asset-type">
              <button
                type="button"
                className="unstyled logo-button"
                onClick={() => this.setDirection(this.TO_ETHER)}
              >
                <EtherLogo />
                <span>Ether</span>
              </button>
              <button
                type="button"
                className="unstyled logo-button"
                onClick={() => this.setDirection(this.TO_TOKEN)}
              >
                <EtherTokenLogo />
                <span>Ether Token</span>
              </button>
              <button
                type="button"
                className="unstyled logo-button"
                onClick={() => this.setDirection(this.TO_TOKEN)}
              >
                <AugurLogoIcon
                  invert
                />
                <span>Augur REP</span>
              </button>
            </div>
            <div className="account-transfer-step">
              <Input
                isIncrementable
                incrementAmount={1}
                max={s.upperBound}
                min={0.1}
                value={s.amount}
                updateValue={amount => this.validateAmount(amount)}
                onChange={amount => this.validateAmount(amount)}
                placeholder={`Amount of ${this.assetTypes.find(asset => asset.value === s.selectedAsset).label} to send`}
              />
              <span
                className={classNames('account-input-error', {
                  'input-in-error': s.amount !== '' && s.isAmountValid !== null && !s.isAmountValid
                })}
              >
                {`Amount must be between 0 and ${s.upperBound} ${this.assetTypes.find(asset => asset.value === s.selectedAsset).label}`}
              </span>
            </div>
            <div className="account-transfer-step">
              <Input
                value={s.address}
                updateValue={address => this.validateAddress(address)}
                onChange={address => this.validateAddress(address)}
                placeholder={`Recipient address`}
              />
              <span
                className={classNames('account-input-error', {
                  'input-in-error': s.address !== '' && s.isAddressValid !== null && !s.isAddressValid
                })}
              >
                Not a valid Ethereum address
              </span>
            </div>
            <button
              type="submit"
              className={classNames('account-convert-submit', { 'form-is-valid': s.isValid })}
            >
              Transfer
            </button>
          </form>
        </div>
      </article>
    );
  }
}

function sanitizeArg(arg) {
  return (arg == null || arg === '') ? '' : arg;
}

/*
<DropDown
  default={this.assetTypes[0].value}
  options={this.assetTypes}
  onChange={selectedAsset => this.updateSelectedAsset(selectedAsset)}
/>
*/
