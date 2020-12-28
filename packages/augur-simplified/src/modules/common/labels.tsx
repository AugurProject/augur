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
  light?: boolean;
}

export const ValueLabel = ({
  large,
  label,
  sublabel,
  value,
  light
}: ValueLabelProps) => {
  return (
    <div
      className={classNames(Styles.ValueLabel, {
        [Styles.large]: large,
        [Styles.Sublabel]: sublabel,
        [Styles.light]: light
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
      {POPULAR_CATEGORIES_ICONS[category.toLowerCase()]
        ? POPULAR_CATEGORIES_ICONS[category.toLowerCase()]
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
  const { isMobile, loginAccount } = useAppStatusStore();
  const isLogged = loginAccount !== null;
  return (
    <div
      className={classNames(Styles.AppStats, {
        [Styles.CashAmounts]: showCashAmounts,
      })}
    >
      <ValueLabel
        large
        label={isMobile ? 'total acc. value' : 'total account value'}
        light={!isLogged}
        value={formatDai(isLogged ? fakeMarketViewStats.totalAccountValue : 0).full}
      />
      <ValueLabel
        large
        label={'positions'}
        light={!isLogged}
        sublabel={isLogged ? `${
          formatDai(fakeMarketViewStats.positions.hourChange).full
        } (24hr)` : null}
        value={formatDai(isLogged ? fakeMarketViewStats.positions.value : 0).full}
      />
      <ValueLabel
        large
        light={!isLogged}
        label={'available funds'}
        value={formatDai(isLogged ? fakeMarketViewStats.availableFunds : 0).full}
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
