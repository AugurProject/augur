import React, { useState } from 'react';
import Styles from 'modules/market/trading-form.styles.less';
import classNames from 'classnames';
import { BUY, SELL, YES_NO } from 'modules/constants';
import { PrimaryButton } from 'modules/common/buttons';
import { CurrencyDropdown } from 'modules/common/selection';
import { useAppStatusStore } from 'modules/stores/app-status';
import { CloseIcon } from 'modules/common/icons';

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

// const fakeScalarOutcomes = [
//   {
//     id: 0,
//     name: '293 of fewer',
//     price: '$0.75',
//   },
//   {
//     id: 1,
//     name: '294 to 296',
//     price: '$0.15',
//   },
//   {
//     id: 2,
//     name: '297 to 299',
//     price: '$0.05',
//   },
//   {
//     id: 3,
//     name: '300 to 302',
//     price: '$0.03',
//   },
//   {
//     id: 4,
//     name: 'Invalid',
//     price: '$0.00',
//     isInvalid: true,
//   },
// ];

const Outcome = ({
  outcome,
  marketType,
  selected,
  onClick,
  invalidSelected,
  showAllHighlighted,
}) => {
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
      })}
    >
      <span>{outcome.name}</span>
      <span>{outcome.price}</span>
    </div>
  );
};

export const AmountInput = () => {
  const [amount, updateAmount] = useState('');
  return (
    <div className={Styles.AmountInput}>
      <span>amount</span>
      <span>balance: $1000</span>
      <div className={Styles.AmountInputDropdown}>
        <input
          onChange={(e) => updateAmount(e.target.value)}
          value={amount}
          placeholder={'$0'}
        />
        <CurrencyDropdown onChange={() => null} />
      </div>
    </div>
  );
};

interface OutcomesGridProps {
  outcomes: OutcomeType[];
  selectedOutcome: OutcomeType;
  setSelectedOutcome: Function;
  marketType: string;
  orderType?: string;
  showAllHighlighted?: boolean;
}
export const OutcomesGrid = ({
  outcomes,
  selectedOutcome,
  setSelectedOutcome,
  marketType,
  showAllHighlighted,
}: OutcomesGridProps) => {
  return (
    <div
      className={classNames(Styles.Outcomes, {
        [Styles.YesNo]: marketType === YES_NO,
      })}
    >
      {outcomes.map((outcome) => (
        <Outcome
          key={outcome.id}
          selected={
            outcome.id === selectedOutcome.id ||
            (showAllHighlighted && !outcome.isInvalid)
          }
          showAllHighlighted={showAllHighlighted}
          outcome={outcome}
          onClick={() => setSelectedOutcome(outcome)}
          marketType={marketType}
          invalidSelected={selectedOutcome.isInvalid}
        />
      ))}
    </div>
  );
};

interface InfoNumber {
  label: string;
  value: string;
}

interface InfoNumbersProps {
  infoNumbers: InfoNumber[];
}

export const InfoNumbers = ({ infoNumbers }: InfoNumbersProps) => {
  return (
    <div className={Styles.OrderInfo}>
      {infoNumbers.map((infoNumber) => (
        <div key={infoNumber.label}>
          <span>{infoNumber.label}</span>
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
}) => {
  const {
    isMobile,
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
        <AmountInput />
        <InfoNumbers
          infoNumbers={[
            {
              label: 'average price',
              value: '$0.00',
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
        <PrimaryButton disabled text={orderType} />
      </div>
    </div>
  );
};

export default TradingForm;
