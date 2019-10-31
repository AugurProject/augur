import React from 'react';

import {AlertMessage, ButtonsRow, Title,} from 'modules/modal/common';

import Styles from 'modules/modal/modal.styles.less';
import ChevronFlip from 'modules/common/chevron-flip';
import {formatGasCostToEther} from 'utils/format-number';
import {NEW_ORDER_GAS_ESTIMATE} from 'modules/common/constants';
import {createBigNumber} from 'utils/create-big-number';
import classNames = require('classnames');

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
  };

  getGasPrice = (amount) => {
    const GWEI_CONVERSION = 1000000000;

    return createBigNumber(amount)
      .times(createBigNumber(GWEI_CONVERSION))
      .toNumber();
  };

  render() {
    const { closeAction, saveAction, safeLow, average, fast } = this.props;
    const { amount, showLowAlert, showAdvanced } = this.state;
    const disabled = !amount || amount <= 0;

    const EXCHANGE_RATE = 0.00001; // (ETH / DAI)

    // const ETH_TRADE_COST = formatGasCostToEther(
    //   NEW_ORDER_GAS_ESTIMATE,
    //   { decimalsRounded: 4 },
    //   this.getGasPrice(amount)
    // );
    //
    // const gasCostInEth = createBigNumber(ETH_TRADE_COST).times(EXCHANGE_RATE);

    const ETH_TRADE_COST = NEW_ORDER_GAS_ESTIMATE.times(amount);
    const gasCostInEth = createBigNumber(ETH_TRADE_COST).times(EXCHANGE_RATE).toNumber();

    // AMOUNT = ETH_TRADE_COST * EXCHANGE_RATE

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
                  <span>&lt; ${amount}</span><span> / Trade</span>
                </div>
                <span>{gasCostInEth} ETH</span>
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
