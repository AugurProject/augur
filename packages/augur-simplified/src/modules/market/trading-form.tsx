import React, { useState } from 'react';
import Styles from 'modules/market/trading-form.styles.less';
import classNames from 'classnames';
import { BUY, SELL, YES_NO } from 'modules/constants';
import { PrimaryButton } from 'modules/common/buttons';

const fakeYesNoOutcomes = [
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

const fakeScalarOutcomes = [
  {
    id: 0,
    name: '293 of fewer',
    price: '$0.75',
  },
  {
    id: 1,
    name: '294 to 296',
    price: '$0.15',
  },
  {
    id: 2,
    name: '297 to 299',
    price: '$0.05',
  },
  {
    id: 3,
    name: '300 to 302',
    price: '$0.03',
  },
  {
    id: 4,
    name: 'Invalid',
    price: '$0.00',
    isInvalid: true,
  },
];

const Outcome = ({ outcome, marketType, selected, onClick, orderType, invalidSelected }) => {
  return (
    <div
      onClick={onClick}
      className={classNames(Styles.Outcome, {
        [Styles.YesNo]: !outcome.isInvalid && marketType === YES_NO,
        [Styles.Selected]: selected,
        [Styles.Invalid]: outcome.isInvalid,
        [Styles.Buy]: orderType === BUY,
        [Styles.InvalidSelected]: invalidSelected
      })}
    >
      <span>{outcome.name}</span>
      <span>{outcome.price}</span>
    </div>
  );
};

const TradingForm = ({
  outcomes = fakeYesNoOutcomes,
  marketType = YES_NO,
}) => {
  const [orderType, setOrderType] = useState(BUY);
  const [selectedOutcome, setSelectedOutcome] = useState(outcomes[0]);
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
      </div>
      <div>
        <div
          className={classNames(Styles.Outcomes, {
            [Styles.YesNo]: marketType === YES_NO,
          })}
        >
          {outcomes.map((outcome) => (
            <Outcome
              key={outcome.id}
              selected={outcome.id === selectedOutcome.id}
              outcome={outcome}
              onClick={() => setSelectedOutcome(outcome)}
              marketType={marketType}
              orderType={orderType}
              invalidSelected={selectedOutcome.isInvalid}
            />
          ))}
        </div>
        <PrimaryButton disabled text={orderType} />
      </div>
    </div>
  );
};

export default TradingForm;
