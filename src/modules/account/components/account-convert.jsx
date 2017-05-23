import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Input from 'modules/common/components/input';
import EtherLogo from 'modules/common/components/ether-logo';
import EtherTokenLogo from 'modules/common/components/ether-token-logo';

export default class AccountConvert extends Component {
  static propTypes = {
    etherTokens: PropTypes.object.isRequired,
    ether: PropTypes.object.isRequired,
    convertToToken: PropTypes.func.isRequired,
    convertToEther: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.TO_ETHER = 'TO_ETHER';
    this.TO_TOKEN = 'TO_TOKEN';

    this.state = {
      direction: this.TO_TOKEN,
      amount: '',
      isValid: false
    };

    this.checkValidity = this.checkValidity.bind(this);
    this.convert = this.convert.bind(this);
  }

  checkValidity(amount) {
    const amountToCheck = (amount == null || amount === '') ? '' : amount;
    const upperBound = this.state.direction === this.TO_TOKEN ? this.props.ether.value : this.props.etherTokens.value;

    if (amountToCheck !== '') {
      if (isNaN(parseFloat(amountToCheck)) || !isFinite(amountToCheck) || (amountToCheck > upperBound || amountToCheck <= 0)) {
        this.setState({
          amount: '',
          isValid: false
        });
        return;
      }
    }

    this.setState({
      amount: amountToCheck, // Set sanitized amount
      isValid: true
    });
  }

  convert() {
    if (this.state.direction === this.TO_TOKEN) {
      this.props.convertToToken(this.state.amount);
    } else {
      this.props.convertToEther(this.state.amount);
    }

    this.setState({ // Reset form, leaving direction in place
      amount: '',
      isValid: false
    });
  }

  render() {
    const p = this.props;
    const s = this.state;


    return (
      <article className="account-convert account-sub-view">
        <aside>
          <h3>Convert Account Ether</h3>
          <p>All trading on Augur is conducted with ETH Tokens, which are exchanged one-to-one with ETH.</p>
        </aside>
        <div className="account-actions">
          <form
            onSubmit={(e) => {
              e.preventDefault();

              if (s.isValid) {
                this.convert();
              }
            }}
          >
            <div className="account-convert-select-direction">
              <button
                type="button"
                className="unstyled logo-button"
                onClick={() => this.setState({ direction: this.TO_TOKEN })}
              >
                <EtherTokenLogo />
                <span>Ether Token</span>
              </button>
              <button
                type="button"
                className="unstyled direction-indicator"
                onClick={() => this.setState({ direction: this.state.direction === this.TO_TOKEN ? this.TO_ETHER : this.TO_TOKEN })}
              >
                <i className={classNames('fa fa-angle-double-left', { 'direction-to-token': s.direction === this.TO_TOKEN })} />
              </button>
              <button
                type="button"
                className="unstyled logo-button"
                onClick={() => this.setState({ direction: this.TO_ETHER })}
              >
                <EtherLogo />
                <span>Ether</span>
              </button>
            </div>
            <Input
              isIncrementable
              incrementAmount={1}
              max={s.direction === this.TO_TOKEN ? p.ether.value : p.etherTokens.value}
              min={0.1}
              value={s.amount}
              updateValue={amount => this.checkValidity(amount)}
              onChange={amount => this.checkValidity(amount)}
              placeholder={`Amount of ${s.direction === this.TO_TOKEN ? 'ETH' : 'ETH Tokens'} to Convert`}
            />
            <span
              className={classNames('account-convert-amount-error', {
                'form-in-error': !s.isValid && s.amount !== ''
              })}
            >
              {`Amount must be between 0 and ${s.direction === this.TO_TOKEN ? p.ether.value : p.etherTokens.value}`}
            </span>
            <button
              type="submit"
              className={classNames('account-convert-submit', { 'form-is-valid': s.isValid && s.amount !== '' })}
            >
              Convert
            </button>
          </form>
        </div>
      </article>
    );
  }
}
