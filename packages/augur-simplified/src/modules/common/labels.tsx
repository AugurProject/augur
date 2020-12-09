import React from 'react';
import Styles from 'modules/common/labels.styles.less';
import classNames from 'classnames';
import { formatDai } from 'utils/format-number';
import { EthIcon, UsdIcon } from './icons';

interface ValueLabelProps {
  large?: boolean;
  label?: string;
  sublabel?: string;
  value: string | number;
}

export const ValueLabel = ({
  large,
  label,
  sublabel,
  value,
}: ValueLabelProps) => {
  return (
    <div
      className={classNames(Styles.ValueLabel, {
        [Styles.large]: large,
      })}
    >
      <span>
        {label}
        {sublabel && <span>{sublabel}</span>}
      </span>
      <span>{value}</span>
    </div>
  );
};

interface IconLabelProps {
  icon: Object;
  value: string | number;
}

export const IconLabel = ({ icon, value }: IconLabelProps) => {
  return (
    <div className={classNames(Styles.IconLabel)}>
      <span>{icon}</span>
      <span>{value}</span>
    </div>
  );
};

interface CategoryProps {
  category: string;
}

export const CategoryLabel = ({ category }: CategoryProps) => {
  return <div className={classNames(Styles.CategoryLabel)}>{category}</div>;
};

export const fakeMarketViewStats = {
  totalAccountValue: 15571.58,
  positions: {
    hourChange: 56.29,
    value: 5045,
  },
  availableFunds: 10526.58,
  daiAmount: 526.58,
  cashAmount: 5000,
};

interface AppViewStatsProps {
  showCashAmounts?: boolean;
}

export const AppViewStats = ({ showCashAmounts }: AppViewStatsProps) => {
  return (
    <div className={classNames(Styles.AppStats, {[Styles.CashAmounts]: showCashAmounts})}>
      <ValueLabel
        large
        label={'total account value'}
        value={formatDai(fakeMarketViewStats.totalAccountValue).full}
      />
      <ValueLabel
        large
        label={'positions'}
        sublabel={`${
          formatDai(fakeMarketViewStats.positions.hourChange).full
        } (24hr)`}
        value={formatDai(fakeMarketViewStats.positions.value).full}
      />
      <ValueLabel
        large
        label={'available funds'}
        value={formatDai(fakeMarketViewStats.availableFunds).full}
      />
      {showCashAmounts && (
        <>
          <IconLabel
            icon={EthIcon}
            value={formatDai(fakeMarketViewStats.daiAmount).full}
          />
          <IconLabel
            icon={UsdIcon}
            value={formatDai(fakeMarketViewStats.cashAmount).full}
          />
        </>
      )}
    </div>
  );
};
