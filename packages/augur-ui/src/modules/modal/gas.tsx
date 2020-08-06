import React, { useState } from 'react';

import { AlertMessage, ButtonsRow, Title } from 'modules/modal/common';

import Styles from 'modules/modal/modal.styles.less';
import ChevronFlip from 'modules/common/chevron-flip';
import {
  formatGasCostToEther,
  formatEtherEstimate,
  formatDai,
  formatEther,
} from 'utils/format-number';
import {
  GWEI_CONVERSION,
  TRADE_ORDER_GAS_MODAL_ESTIMATE,
} from 'modules/common/constants';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
import classNames from 'classnames';
import { DismissableNotice, DISMISSABLE_NOTICE_BUTTON_TYPES } from 'modules/reporting/common';
import { FormattedNumber } from 'modules/types';

export const getGasCost = (gasLimit: Number, gasPrice: BigNumber, ethToDaiRate: FormattedNumber): FormattedNumber => {
  const gasCostInEth = createBigNumber(
    formatGasCostToEther(
      gasLimit,
      { decimalsRounded: 4 },
      createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice)
    )
  );
  if (ethToDaiRate) {
    return formatDai(ethToDaiRate.value * gasCostInEth);
  }
  return formatEther(gasCostInEth);
}

interface GasProps {
  saveAction: Function;
  closeAction: Function;
  safeLow: number;
  average: number;
  fast: number;
  userDefinedGasPrice: number;
  feeTooLow: boolean;
}

interface GasState {
  amount: number;
  showLowAlert: boolean;
  showAdvanced: boolean;
}

export const getEthTradeCost = (gasPrice: number) => {
  return formatEtherEstimate(
    formatGasCostToEther(
      TRADE_ORDER_GAS_MODAL_ESTIMATE,
      { decimalsRounded: 4 },
      createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice)
    )
  );
};

export const Gas = (props: GasProps) => {
  const {
    closeAction,
    saveAction,
    safeLow,
    average,
    fast,
    feeTooLow,
    userDefinedGasPrice,
    ethToDaiRate,
  } = props;
  const doesGasPriceMatchPresets = (amount: number) => {
    return amount === fast || amount === average || amount === safeLow;
  };

  const [showLowAlert, setShowLowAlert] = useState(
    (userDefinedGasPrice || average) < safeLow
  );
  const [amount, setAmount] = useState(
    userDefinedGasPrice || average
  );
  const [showAdvanced, setShowAdvanced] = useState(
    !doesGasPriceMatchPresets(amount)
  );
  const disabled = !amount || amount <= 0;

  const getEstTime = (amount: number) => {
    if (amount >= fast) {
      return '< 1 min';
    } else if (amount >= average) {
      return '< 3 min';
    }
    return '< 30 min';
  };

  const updateAmount = (newAmount: number) => {
    let amt = newAmount;
    setAmount(amt);
    setShowLowAlert(!amt || amt < props.safeLow);
  };

  const buttons = [
    {
      text: 'Set Transaction Fee',
      action: () => saveAction(amount, average),
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
      avgTime: ' < 1 min',
      gwei: fast,
      action: () => {
        updateAmount(fast);
      },
    },
    {
      speed: 'Recommended',
      avgTime: ' < 3 min',
      gwei: average,
      action: () => {
        updateAmount(average);
      },
    },
    {
      speed: 'Slow',
      avgTime: ' < 30 min',
      gwei: safeLow,
      action: () => {
        updateAmount(safeLow);
      },
    },
  ];

  const gasCostTrade = getGasCost(TRADE_ORDER_GAS_MODAL_ESTIMATE, amount, ethToDaiRate);
  return (
    <div onClick={event => event.stopPropagation()} className={Styles.Gas}>
      <Title title='Transaction Fee' closeAction={closeAction} />
      <main>
        <p>
          Selecting a faster transaction fee will result in your transaction
          being processed quicker. For more important transactions such as
          securing a sell order before anyone else, it is recommend to use a
          faster transaction fee.
        </p>
        <div>
          {gasButtonsData.map(data => (
            <div
              key={data.speed}
              onClick={data.action}
              className={classNames({
                [Styles.GasCheckedButton]: amount === data.gwei,
              })}
            >
              <div>
                <span>{data.speed}</span>
                <span>{data.avgTime}</span>
              </div>
              <div>
              <span>${(getGasCost(TRADE_ORDER_GAS_MODAL_ESTIMATE, data.gwei, ethToDaiRate)).formattedValue}</span>
                <span> / Trade</span>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => setShowAdvanced(!showAdvanced)}>
          Advanced
          <ChevronFlip
            pointDown={showAdvanced}
            stroke='#fff'
            filledInIcon
            quick
          />
        </button>
        {showAdvanced && (
          <>
          <div>
            <div>
              <label>Gas Price (GWEI)</label>
              <input
                id='price'
                placeholder='Price'
                step={1}
                type='number'
                value={amount}
                onChange={e => {
                  updateAmount(e.target.value);
                }}
              />
            </div>
            <div>
              <div>
                <span>&lt; ${gasCostTrade.formattedValue}</span>
                <span> / Trade</span>
              </div>
              <span>{amount ? getEthTradeCost(amount).formatted : '-'} ETH</span>
            </div>
            <div>
              <span>{getEstTime(amount)}</span>
            </div>
          </div>
          {showLowAlert && (
            <AlertMessage preText='Transactions are unlikely to be processed at your current gas price.' />
          )}
          </>
        )}
        <p>
          * Transaction fees are representative of a single Fill Order trade. A
          transaction containing multiple orders will cost more.
        </p>
        <section>
          {feeTooLow && (
              <AlertMessage preText='A Transaction you made was rejected by the network because your gas price was too low. Try increasing your gas price or waiting till the network is less busy.' />
          )}
          {amount === average && (
            <DismissableNotice
              show
              description=""
              title={`Transaction fee will automatically update to maintain RECOMMENDED transaction fee`}
              buttonType={DISMISSABLE_NOTICE_BUTTON_TYPES.NONE}
            />
          )}
          {amount !== average && (
            <DismissableNotice
              show
              description=""
              title={`Transaction fee is set to ${amount} for all transactions until manually changed`}
              buttonType={DISMISSABLE_NOTICE_BUTTON_TYPES.NONE}
            />
          )}
        </section>
      </main>
      <ButtonsRow buttons={buttons} />
    </div>
  );
};
