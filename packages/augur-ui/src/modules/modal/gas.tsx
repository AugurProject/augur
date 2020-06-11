import React, { useState } from 'react';

import { AlertMessage, ButtonsRow, Title } from 'modules/modal/common';

import Styles from 'modules/modal/modal.styles.less';
import ChevronFlip from 'modules/common/chevron-flip';
import {
  formatGasCostToEther,
  formatEtherEstimate,
} from 'utils/format-number';
import {
  GWEI_CONVERSION,
  NEW_ORDER_GAS_ESTIMATE,
} from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';
import classNames from 'classnames';
import { displayGasInDai } from 'modules/app/actions/get-ethToDai-rate';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { registerUserDefinedGasPriceFunction } from 'modules/app/actions/register-user-defined-gasPrice-function';

export const getEthTradeCost = (gasPrice: number) => {
  return formatEtherEstimate(
    formatGasCostToEther(
      NEW_ORDER_GAS_ESTIMATE,
      { decimalsRounded: 4 },
      createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice)
    )
  );
};

export const Gas = () => {
  const { gasPriceInfo, modal, actions: { closeModal, updateGasPriceInfo } } = useAppStatusStore();
  const { feeTooLow } = modal;
  const closeAction = () => closeModal();
  const saveAction = (userDefinedGasPrice: number, average: number) => {
    updateGasPriceInfo({ userDefinedGasPrice });
    registerUserDefinedGasPriceFunction(userDefinedGasPrice, average);
    closeModal();
  };

  const {
    safeLow,
    average,
    fast,
    userDefinedGasPrice
  } = gasPriceInfo;

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
    if (newAmount) amt = Math.round(Math.abs(Number(amt)));
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

  const gasCostTrade = displayGasInDai(NEW_ORDER_GAS_ESTIMATE, amount * 10**9);
  return (
    <div onClick={event => event.stopPropagation()} className={Styles.Gas}>
      <Title title='Transaction Fee' closeAction={closeAction} />
      <main>
        <p>
          Selecting a faster transaction fee will result in your transaction
          being processed quicker. For more important transactions such as
          securing a sell order before anyone else takes it, we recommend a
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
              <span>{displayGasInDai(NEW_ORDER_GAS_ESTIMATE, data.gwei * 10**9)}</span>
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
        {(showAdvanced || !doesGasPriceMatchPresets(amount)) && (
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
                <span>&lt; {gasCostTrade}</span>
                <span> / Trade</span>
              </div>
              <span>{amount ? getEthTradeCost(amount).formatted : '-'} ETH</span>
            </div>
            <div>
              <span>{getEstTime(amount)}</span>
            </div>
          </div>
        )}
        {feeTooLow && (
          <AlertMessage preText='A Transaction you made was rejected by the network because your gas price was too low. Try increasing your gas price or waiting till the network is less busy.' />
        )}
        {showLowAlert && (
          <AlertMessage preText='Transactions are unlikely to be processed at your current gas price.' />
        )}
        <p>
          * Transaction fees are representative of a single Fill Order trade. A
          transaction containing multiple orders may cost more.
        </p>
      </main>
      <ButtonsRow buttons={buttons} />
    </div>
  );
};
