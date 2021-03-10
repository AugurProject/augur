import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Styles from './inputs.styles.less';
import { useAppStatusStore } from '../stores/app-status';
import { TinyButton } from './buttons.styles.less';
import { AmmOutcome, Cash } from '../types';
import { Constants, Icons, Formatter, SelectionComps } from '@augurproject/augur-comps';
const {
  ETH,
  USDC,
  ERROR_AMOUNT,
  SHARES,
  OUTCOME_YES_NAME,
  YES_NO,
} = Constants;
const { CurrencyDropdown } = SelectionComps;
const {
  EthIcon, LinkIcon, UsdIcon, XIcon
} = Icons;
const {
  getCashFormat,
  formatCash,
  formatSimpleShares,
  formatCashPrice,
  formatDai,
} = Formatter;

const ENTER_CHAR_CODE = 13;

interface SearchInputProps {
  value: string;
  onChange: Function;
  clearValue: Function;
  showFilter: boolean;
}

export const SearchInput = ({
  value,
  onChange,
  clearValue,
  showFilter,
}: SearchInputProps) => {
  useEffect(() => {
    if (showFilter) input.current && input.current.focus();
  }, [showFilter]);

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
  error?: boolean;
  updateAmountError?: Function;
  ammCash: Cash;
  isBuy?: boolean;
  disabled?: boolean;
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
  error,
  disabled = false,
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
        className={classNames(Styles.AmountInputField, {
          [Styles.Edited]: amount !== '',
          [Styles.showCurrencyDropdown]: showCurrencyDropdown,
          [Styles.Error]: error,
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
          title={disabled ? 'Liquidity Depleted' : 'enter amount'}
          value={amount}
          placeholder="0"
          disabled={disabled}
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

const PLACEHOLDER = '0';

export const isInvalidNumber = (number) => {
  return (
    number !== '' &&
    (isNaN(number) || Number(number) < 0 || Number(number) === 0)
  );
};

const Outcome = ({
  outcome,
  marketType,
  selected,
  onClick,
  showAllHighlighted,
  nonSelectable,
  editable,
  setEditableValue,
  ammCash,
  showAsButton,
  invalidSelected,
  error,
}) => {
  const [customVal, setCustomVal] = useState('');
  const input = useRef(null);
  const { isLogged } = useAppStatusStore();
  const { prepend, symbol } = getCashFormat(ammCash?.name);
  useEffect(() => {
    if (outcome.price !== '0' && outcome.price && outcome.price !== '') {
      let numInput = outcome.price.split('.');
      numInput.shift();
      setCustomVal(numInput.join('.'));
    }
  }, [outcome.price]);
  const formattedPrice = formatDai(outcome.price);
  return (
    <div
      onClick={() => (outcome.isInvalid ? null : onClick())}
      className={classNames(Styles.Outcome, {
        [Styles.YesNo]: !outcome.isInvalid && marketType === YES_NO,
        [Styles.Selected]: selected,
        [Styles.Yes]: outcome.name === OUTCOME_YES_NAME,
        [Styles.ShowAllHighlighted]: showAllHighlighted,
        [Styles.nonSelectable]: nonSelectable,
        [Styles.Edited]: customVal !== '',
        [Styles.showAsButton]: showAsButton,
        [Styles.Invalid]: outcome.isInvalid,
        [Styles.InvalidSelected]: invalidSelected,
        [Styles.loggedOut]: !isLogged,
        [Styles.Error]: error,
      })}
    >
      {outcome.isInvalid ? (
        // TODO: add either balancer pool address or invalid token address, need to research
        <a href="https://https://balancer.exchange/#/swap/" target="_blank" rel="noopener noreferrer">
          <span>{outcome.name}</span>
          {outcome.isInvalid && LinkIcon}
        </a>
      ) : (
        <>
          <span>{outcome.name}</span>

          {editable ? (
            <div onClick={() => input.current && input.current.focus()}>
              <span>{`${prepend && symbol}0.`}</span>
              <input
                value={customVal}
                onChange={(v) => {
                  setCustomVal(`${v.target.value}`);
                  setEditableValue(
                    v.target.value && v.target.value !== '0'
                      ? `.${v.target.value}`
                      : `${v.target.value}`
                  );
                }}
                type="text"
                placeholder={PLACEHOLDER}
                ref={input}
                // @ts-ignore
                onWheel={(e) => e?.target?.blur()}
              />
            </div>
          ) : (
            <span>
              {
                formatCashPrice(formattedPrice.fullPrecision, ammCash?.name)
                  .full
              }
            </span>
          )}
        </>
      )}
    </div>
  );
};

interface OutcomesGridProps {
  outcomes: AmmOutcome[];
  selectedOutcome?: AmmOutcome;
  setSelectedOutcome: Function;
  marketType: string;
  orderType?: string;
  showAllHighlighted?: boolean;
  nonSelectable?: boolean;
  editable?: boolean;
  setEditableValue?: Function;
  ammCash: Cash;
  showAsButtons?: boolean;
  dontFilterInvalid?: boolean;
  error?: boolean;
}
export const OutcomesGrid = ({
  outcomes,
  selectedOutcome,
  setSelectedOutcome,
  marketType,
  showAllHighlighted,
  nonSelectable,
  editable,
  setEditableValue,
  ammCash,
  showAsButtons,
  dontFilterInvalid,
  error,
}: OutcomesGridProps) => {
  return (
    <div
      className={classNames(Styles.Outcomes, {
        [Styles.YesNo]: marketType === YES_NO,
        [Styles.nonSelectable]: nonSelectable,
        [Styles.showAsButtons]: showAsButtons,
      })}
    >
      {outcomes
        .filter((outcome) => (dontFilterInvalid ? true : !outcome.isInvalid))
        .reverse()
        .map((outcome, index) => (
          <Outcome
            key={outcome.id}
            selected={
              selectedOutcome &&
              (outcome.id === selectedOutcome.id ||
                (showAllHighlighted && !outcome.isInvalid))
            }
            nonSelectable={nonSelectable}
            showAllHighlighted={showAllHighlighted}
            outcome={outcome}
            onClick={() => setSelectedOutcome(outcome)}
            marketType={marketType}
            editable={editable}
            setEditableValue={(price) => setEditableValue(price, outcome.id)}
            ammCash={ammCash}
            showAsButton={showAsButtons}
            invalidSelected={selectedOutcome?.isInvalid}
            error={error}
          />
        ))}
    </div>
  );
};
