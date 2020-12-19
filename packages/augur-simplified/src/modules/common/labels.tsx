import React from 'react';
import Styles from 'modules/common/labels.styles.less';
import classNames from 'classnames';
import { formatDai } from 'utils/format-number';
import {
  AugurBlankIcon,
  EthIcon,
  PlusIcon,
  UsdIcon,
} from 'modules/common/icons';
import { POPULAR_CATEGORIES_ICONS } from 'modules/constants';
import { useAppStatusStore } from 'modules/stores/app-status';

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
        [Styles.Sublabel]: sublabel,
      })}
    >
      <span>{label}</span>
      {sublabel && <span>{sublabel}</span>}
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

interface CategoryProps {
  category: string;
}

export const CategoryIcon = ({ category }: CategoryProps) => {
  return (
    <div
      className={classNames(
        Styles.CategoryIcon,
        Styles[`${category.toLowerCase()}`]
      )}
    >
      {POPULAR_CATEGORIES_ICONS[category]
        ? POPULAR_CATEGORIES_ICONS[category]
        : AugurBlankIcon}
    </div>
  );
};

export const fakeMarketViewStats = {
  totalAccountValue: 15571.58,
  positions: {
    hourChange: 56.29,
    value: 5045,
  },
  availableFunds: 1526.58,
  daiAmount: 526.58,
  cashAmount: 5000,
};

interface AppViewStatsProps {
  showCashAmounts?: boolean;
}

export const AppViewStats = ({ showCashAmounts }: AppViewStatsProps) => {
  const { isMobile } = useAppStatusStore();
  return (
    <div
      className={classNames(Styles.AppStats, {
        [Styles.CashAmounts]: showCashAmounts,
      })}
    >
      <ValueLabel
        large
        label={isMobile ? 'total acc. value' : 'total account value'}
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

export const AddLiquidity = () => {
  return (
    <div className={classNames(Styles.AddLiquidity)}>
      <span>
        {PlusIcon}
        add liquidity
      </span>
      <span>earn fees as a liquidity provider</span>
    </div>
  );
};
