import React from 'react';

import {AlertMessage, ButtonsRow, Title,} from 'modules/modal/common';

import Styles from 'modules/modal/modal.styles.less';
import {Chevron} from 'modules/common/icons';
import {SecondaryButton} from 'modules/common/buttons';
import classNames = require('classnames');
import ChevronFlip from 'modules/common/chevron-flip';

interface GasProps {
  saveAction: Function;
  closeAction: Function;
  safeLow: number;
  average: number;
  fast: number;
  blockNumber: number;
  userDefinedGasPrice?: number;
}

interface GasState {
  amount: number;
  showLowAlert: boolean;
  showAdvanced: boolean;
}

export class Gas extends React.Component<GasProps, GasState> {
  state: GasState = {
    amount: this.props.userDefinedGasPrice || this.props.average,
    showLowAlert:
      (this.props.userDefinedGasPrice || this.props.average) <
      this.props.safeLow,
    showAdvanced: false,
  };

  updateAmount(amount: number) {
    let amt = this.state.amount;
    if (amount) amt = amount;
    if (isNaN(amount)) amt = 0;
    this.setState({ amount: amt, showLowAlert: amt < this.props.safeLow });
  }

  render() {
    const { closeAction, saveAction, safeLow, average, fast } = this.props;
    const { amount, showLowAlert, showAdvanced } = this.state;
    const disabled = !amount || amount <= 0;

    const buttons = [
      {
        text: 'Set Transaction Fee',
        action: () => saveAction(amount),
        disabled,
      },
      {
        text: 'Cancel',
        action: () => closeAction(),
      },
    ];

    const gasButtonsData = [
      {
        speed: 'Fast',
        avgTime: ' < 2 min',
        gwei: fast,
        action: () => {
          this.updateAmount(fast);
        },
      },
      {
        speed: 'Recommended',
        avgTime: ' < 5 min',
        gwei: average,
        action: () => {
          this.updateAmount(average);
        },
      },
      {
        speed: 'Slow',
        avgTime: ' < 30 min',
        gwei: safeLow,
        action: () => {
          this.updateAmount(safeLow);
        },
      },
    ];

    return (
      <div onClick={event => event.stopPropagation()} className={Styles.Gas}>
        <Title title='Transaction Fee' closeAction={closeAction} />
        <main>
          <p>
            Selecting a faster transaction fee will result in your transaction being processed quicker.
            For more important transactions such as securing a sell order before anyone else takes it,
            we recommend a faster transaction fee.*
          </p>
          <div>
            {gasButtonsData.map(data => (
              <div key={data.speed}
                   onClick={data.action}
                   className={classNames({
                     [Styles.GasCheckedButton]: amount === data.gwei
                   })}
              >
                <div><span>{data.speed}</span><span>{data.avgTime}</span></div>
                <div><span>${data.gwei}</span><span> / Trade</span></div>
              </div>
            ))}
          </div>
          <button onClick={() => this.setState({ showAdvanced: !showAdvanced })}>
            Advanced
            <ChevronFlip
              pointDown={showAdvanced}
              stroke='#fff'
              filledInIcon
              quick
            />
          </button>
          {showAdvanced && (
            <div>
              <div>
                <label>Gas Price (GWEI)</label>
                <input
                  id='price'
                  placeholder='price'
                  step={1}
                  type='number'
                  value={this.state.amount}
                  onChange={(e) => {
                    this.updateAmount(parseFloat(e.target.value));
                  }}
                />
              </div>
              <div>
                <div>
                  <span>&lt; $0.059</span><span> / Trade</span>
                </div>
                <span>0.012441 ETH</span>
              </div>
              <div>
                <span>~ 30 seconds</span>
              </div>
            </div>
          )}
          {showLowAlert && (
            <AlertMessage preText='Transactions are unlikely to be processed at your current gas price.' />
          )}
          <p>
            * Transaction fees are representative of a single Fill Order trade.
            A transaction containing multiple orders may cost more.
          </p>
        </main>
        <ButtonsRow buttons={buttons} />
      </div>
    );
  }
}
