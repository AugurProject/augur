import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { EthIcon, UsdIcon, XIcon } from './icons';
import Styles from './inputs.styles.less';
import { Cash } from '@augurproject/core/build/libraries/GenericContractInterfaces';
import { ETH } from '@augurproject/sdk-lite/build';
import { getCashFormat, formatCash, formatSimpleShares } from '../../utils/format-number';
import { USDC, ERROR_AMOUNT, SHARES } from '../constants';
import { useAppStatusStore } from '../stores/app-status';
import { TinyButton } from './buttons.styles.less';
import { CurrencyDropdown } from './selection.styles.less';

const ENTER_CHAR_CODE = 13;
export const SearchInput = ({ value, onChange, clearValue }) => {
  const input = useRef();
  const keypressHandler = (e) => {
    if (e.charCode === ENTER_CHAR_CODE) {
      input.current && input.current.blur();
    }
  };

  return (
    <div className={Styles.SearchInput}>
      <input
        ref={input}
        placeholder="Search for a market"
        value={value}
        onChange={onChange}
        onKeyPress={(event) => keypressHandler(event)}
      />
      <div
        className={classNames({ [Styles.faded]: !value })}
        onClick={clearValue}
      >
        {XIcon}
      </div>
    </div>
  );
};

export const TextInput = ({ placeholder, value, onChange }) => {
  return (
    <input
      className={Styles.TextInput}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};



interface AmountInputProps {
  updateInitialAmount: (string) => void;
  initialAmount: string;
  maxValue: string;
  showCurrencyDropdown?: boolean;
  updateCash?: (string) => void;
  chosenCash: string;
  rate?: string;
  amountError?: string;
  updateAmountError?: Function;
  ammCash: Cash;
  isBuy?: boolean;
}

export const AmountInput = ({
  updateInitialAmount,
  initialAmount,
  maxValue,
  showCurrencyDropdown,
  updateCash,
  chosenCash,
  rate,
  ammCash,
  updateAmountError = () => {},
  isBuy = true,
}: AmountInputProps) => {
  const { isLogged } = useAppStatusStore();
  const currencyName = chosenCash;
  const [amount, updateAmount] = useState(initialAmount);
  const icon = currencyName === USDC ? UsdIcon : EthIcon;
  const label = currencyName === USDC ? USDC : ETH;
  const { symbol, prepend } = getCashFormat(chosenCash);
  const setMax = () => {
    updateAmount(maxValue);
    updateInitialAmount(maxValue);
  };
  const errorCheck = (value) => {
    let returnError = '';
    if (
      value !== '' &&
      (isNaN(value) || Number(value) === 0 || Number(value) < 0)
    ) {
      returnError = ERROR_AMOUNT;
    }
    updateAmountError(returnError);
  };
  useEffect(() => updateAmount(initialAmount), [initialAmount]);
  useEffect(() => errorCheck(amount), [amount, maxValue]);
  return (
    <div
      className={classNames(Styles.AmountInput, {
        [Styles.Rate]: Boolean(rate),
      })}
    >
      <span>amount</span>
      <span onClick={setMax}>
        {isLogged &&
          `balance: ${
            isBuy
              ? formatCash(maxValue, ammCash?.name).full
              : formatSimpleShares(maxValue).formatted
          }`}
      </span>
      <div
        className={classNames(Styles.AmountInputDropdown, {
          [Styles.Edited]: amount !== '',
          [Styles.showCurrencyDropdown]: showCurrencyDropdown,
        })}
      >
        <span>{chosenCash !== SHARES && prepend && symbol}</span>
        <input
          type="number"
          onChange={(e) => {
            updateAmount(e.target.value);
            updateInitialAmount(e.target.value);
            errorCheck(e.target.value);
          }}
          value={amount}
          placeholder="0"
          // @ts-ignore
          onWheel={(e) => e?.target?.blur()}
        />
        {!!currencyName && chosenCash !== SHARES && !showCurrencyDropdown && (
          <span className={Styles.CurrencyLabel}>
            {icon} {label}
          </span>
        )}
        {chosenCash === SHARES && !showCurrencyDropdown && (
          <span className={Styles.SharesLabel}>
            Shares
            <TinyButton action={setMax} text="Max" />
          </span>
        )}
        {showCurrencyDropdown && (
          <CurrencyDropdown
            defaultValue={chosenCash}
            onChange={(cash) => updateCash(cash)}
          />
        )}
      </div>
      <span className={Styles.RateLabel}>
        <span>Rate</span>
        {rate}
      </span>
    </div>
  );
};
