import React, { useState } from 'react';
import Styles from 'modules/market/trading-form.styles.less';
import classNames from 'classnames';
import { BUY, SELL, YES_NO, USDC, ETH } from 'modules/constants';
import { PrimaryButton } from 'modules/common/buttons';
import { useAppStatusStore } from 'modules/stores/app-status';
import { CloseIcon, UsdIcon, EthIcon } from 'modules/common/icons';
import { ApprovalButton, TinyButton } from '../common/buttons';
import { ApprovalAction, SHARES } from '../constants';
import { CurrencyDropdown } from '../common/selection';
import { generateTooltip } from '../common/labels';

interface OutcomeType {
  id: number;
  name: string;
  price: string;
  isInvalid?: boolean;
}

export const fakeYesNoOutcomes = [
  {
    id: 0,
    name: 'yes',
    price: '$0.75',
  },
  {
    id: 1,

    name: 'No',
    price: '$0.25',
  },
  {
    id: 2,
    name: 'Invalid',
    price: '$0.00',
    isInvalid: true,
  },
];

const PLACEHOLDER = '0';

const Outcome = ({
  outcome,
  marketType,
  selected,
  onClick,
  invalidSelected,
  showAllHighlighted,
  nonSelectable,
  editable,
  setEditableValue,
}) => {
  const [customVal, setCustomVal] = useState('');
  return (
    <div
      onClick={onClick}
      className={classNames(Styles.Outcome, {
        [Styles.YesNo]: !outcome.isInvalid && marketType === YES_NO,
        [Styles.Selected]: selected,
        [Styles.Invalid]: outcome.isInvalid,
        [Styles.Yes]: outcome.name === 'yes',
        [Styles.ShowAllHighlighted]: showAllHighlighted,
        [Styles.InvalidSelected]: invalidSelected,
        [Styles.nonSelectable]: nonSelectable,
      })}
    >
      <span>{outcome.name}</span>
      {editable ? (
        <div className={classNames({ [Styles.edited]: customVal !== '' })}>
          <span>$</span>
          <input
            value={customVal}
            onChange={v => {
              setCustomVal(v.target.value);
              setEditableValue(v.target.value);
            }}
            placeholder={PLACEHOLDER}
          />
        </div>
      ) : (
        <span>{outcome.price}</span>
      )}
    </div>
  );
};

export const AmountInput = ({
  currencyName,
  updateInitialAmount,
  initialAmount,
  showCurrencyDropdown,
  updateCash,
  chosenCash,
}) => {
  const [amount, updateAmount] = useState(initialAmount);
  const icon = currencyName === USDC ? UsdIcon : EthIcon;
  const label = currencyName === USDC ? USDC : ETH;
  const showRate = currencyName !== SHARES;
  return (
    <div
      className={classNames(Styles.AmountInput, { [Styles.Rate]: showRate })}
    >
      <span>amount</span>
      <span>balance: $1000</span>
      <div
        className={classNames(Styles.AmountInputDropdown, {
          [Styles.Edited]: amount !== '',
        })}
      >
        <span>$</span>
        <input
          onChange={e => {
            updateAmount(e.target.value);
            updateInitialAmount(e.target.value);
          }}
          value={amount}
          placeholder="0"
        />
        {!!currencyName && currencyName !== SHARES && !showCurrencyDropdown && (
          <span className={Styles.CurrencyLabel}>
            {icon} {label}
          </span>
        )}
        {currencyName === SHARES && !showCurrencyDropdown && (
          <span className={Styles.SharesLabel}>
            Shares
            <TinyButton text="Max" />
          </span>
        )}
        {showCurrencyDropdown && (
          <CurrencyDropdown
            defaultValue={chosenCash}
            onChange={cash => updateCash(cash)}
          />
        )}
      </div>
      {showRate && (
        <span className={Styles.RateLabel}>
          <span>Rate</span>1 USDC = 1 Share
        </span>
      )}
    </div>
  );
};

interface OutcomesGridProps {
  outcomes: OutcomeType[];
  selectedOutcome?: OutcomeType;
  setSelectedOutcome: Function;
  marketType: string;
  orderType?: string;
  showAllHighlighted?: boolean;
  nonSelectable?: boolean;
  editable?: boolean;
  setEditableValue?: Function;
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
}: OutcomesGridProps) => {
  return (
    <div
      className={classNames(Styles.Outcomes, {
        [Styles.YesNo]: marketType === YES_NO,
        [Styles.nonSelectable]: nonSelectable,
      })}
    >
      {outcomes
        .filter(outcome => !outcome.isInvalid)
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
            invalidSelected={nonSelectable || selectedOutcome?.isInvalid}
            editable={editable}
            setEditableValue={price => setEditableValue(price, index)}
          />
        ))}
    </div>
  );
};

interface InfoNumber {
  label: string;
  value: string;
  tooltipText?: string;
  tooltipKey?: string;
}

interface InfoNumbersProps {
  infoNumbers: InfoNumber[];
}

export const InfoNumbers = ({ infoNumbers }: InfoNumbersProps) => {
  return (
    <div className={Styles.OrderInfo}>
      {infoNumbers.map(infoNumber => (
        <div key={infoNumber.label}>
          <span>
            {infoNumber.label}
            <span>
              {infoNumber.tooltipText &&
                generateTooltip(infoNumber.tooltipText, infoNumber.tooltipKey)}
            </span>
          </span>
          <span>{infoNumber.value}</span>
        </div>
      ))}
    </div>
  );
};

const TradingForm = ({
  outcomes = fakeYesNoOutcomes,
  initialSelectedOutcome,
  marketType = YES_NO,
  marketCashType,
  amm,
}) => {
  const {
    isMobile,
    loginAccount,
    approvals,
    actions: { setShowTradingForm },
  } = useAppStatusStore();
  const [orderType, setOrderType] = useState(BUY);
  const [selectedOutcome, setSelectedOutcome] = useState(
    initialSelectedOutcome
  );
  return (
    <div className={Styles.TradingForm}>
      <div>
        <span
          onClick={() => setOrderType(BUY)}
          className={classNames({ [Styles.Selected]: BUY === orderType })}
        >
          {BUY}
        </span>
        <span
          onClick={() => setOrderType(SELL)}
          className={classNames({ [Styles.Selected]: SELL === orderType })}
        >
          {SELL}
        </span>
        <div>
          <span>fee</span>
          <span>0.1%</span>
        </div>
        {isMobile && (
          <div onClick={() => setShowTradingForm(false)}>{CloseIcon}</div>
        )}
      </div>
      <div>
        <OutcomesGrid
          outcomes={outcomes}
          selectedOutcome={selectedOutcome}
          setSelectedOutcome={setSelectedOutcome}
          marketType={marketType}
          orderType={orderType}
        />
        <AmountInput
          currencyName={marketCashType}
          updateInitialAmount={() => null}
          initialAmount={''}
        />
        <InfoNumbers
          infoNumbers={[
            {
              label: 'average price',
              value: '$0.00',
              tooltipText: 'tooltip copy',
              tooltipKey: 'averagePrice',
            },
            {
              label: 'shares bought',
              value: '0.00',
            },
            {
              label: 'max winnings',
              value: '$0.00',
            },
          ]}
        />
        {loginAccount && (
          <ApprovalButton amm={amm} actionType={ApprovalAction.TRADE} />
        )}
        <PrimaryButton
          disabled={!approvals?.trade[marketCashType]}
          text={orderType}
        />
      </div>
    </div>
  );
};

export default TradingForm;
