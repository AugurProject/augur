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
import { useActiveWeb3React } from 'modules/ConnectAccount/hooks';

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

interface AppViewStatsProps {
  showCashAmounts?: boolean;
}

export const AppViewStats = ({ showCashAmounts }: AppViewStatsProps) => {
  const { isMobile, userInfo } = useAppStatusStore();
  const { account } = useActiveWeb3React();
  const isLogged = Boolean(account);
  console.log('isLogged', isLogged)
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
        value={formatDai(isLogged ? userInfo?.balances?.totalAccountValue : 0).full}
      />
      <ValueLabel
        large
        label={'positions'}
        light={!isLogged}
        sublabel={isLogged ? `${
          formatDai(userInfo?.balances?.total24hrPositionUsd).full
        } (24hr)` : null}
        value={formatDai(isLogged ? userInfo?.balances?.change24hrPositionUsd : 0).full}
      />
      <ValueLabel
        large
        light={!isLogged}
        label={'available funds'}
        value={formatDai(isLogged ? userInfo?.balances?.availableFundsUsd : 0).full}
      />
      {showCashAmounts && (
        <>
          <IconLabel
            icon={EthIcon}
            value={formatDai(userInfo?.balances?.ETH?.usdValue).full}
          />
          <IconLabel
            icon={UsdIcon}
            value={formatDai(userInfo?.balances?.USDC?.usdValue).full}
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
