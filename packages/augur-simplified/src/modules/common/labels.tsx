import React, { useMemo } from 'react';
import Styles from 'modules/common/labels.styles.less';
import { useLocation } from 'react-router';
import classNames from 'classnames';
import { formatDai } from 'utils/format-number';
import { createBigNumber } from 'utils/create-big-number';
import {
  AugurBlankIcon,
  EthIcon,
  PlusIcon,
  UsdIcon,
} from 'modules/common/icons';
import {
  MODAL_ADD_LIQUIDITY,
  MARKET,
} from 'modules/constants';
import { CATEGORIES_ICON_MAP } from 'modules/common/category-icons-map';
import { useAppStatusStore } from 'modules/stores/app-status';
import parsePath from '../routes/helpers/parse-path';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from 'modules/common/tooltip.styles.less';
import { HelpIcon, USDCIcon } from './icons';
import { CREATE, USDC, MARKET_STATUS } from '../constants';
import { MarketInfo } from '../types';

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
  light,
}: ValueLabelProps) => {
  return (
    <div
      className={classNames(Styles.ValueLabel, {
        [Styles.large]: large,
        [Styles.Sublabel]: sublabel,
        [Styles.light]: light,
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

interface CategoriesProps {
  categories: Array<string>;
}

export const CategoryLabel = ({ categories }: CategoriesProps) => {
  return (
    <div className={classNames(Styles.CategoryLabel)}>
      {!!categories[1] ? categories[1] : categories[0]}
    </div>
  );
};

export const CategoryIcon = ({ categories }: CategoriesProps) => {
  const prime = CATEGORIES_ICON_MAP[categories[0].toLowerCase()];
  const secondary = prime?.subOptions[categories[1].toLowerCase()];
  const icon = secondary?.icon ? secondary.icon : prime?.icon;
  return (
    <div
      className={classNames(
        Styles.CategoryIcon,
        Styles[`${categories[0].toLowerCase()}`]
      )}
    >
      {!!icon
        ? icon
        : AugurBlankIcon}
    </div>
  );
};

export const ReportingStateLabel = ({ reportingState }) => {
  let content;
  switch (reportingState) {
    case (MARKET_STATUS.FINALIZED):
    case (MARKET_STATUS.SETTLED): {
      content = (<div className={Styles.Resolved}>
        Resolved
      </div>);
      break;
    }
    case (MARKET_STATUS.REPORTING):
    case (MARKET_STATUS.DISPUTING): {
      content = (<div className={Styles.InSettlement}>
        In Settlement
      </div>);
      break;
    }
    default:
      break;
  }
  return (
    <>
      {content}
    </>
  )
};

const ONE_HUNDRED_K = '100000.00';

const handleValue = (value) =>
  formatDai(value, {
    bigUnitPostfix: createBigNumber(value).gte(ONE_HUNDRED_K),
  }).full;

interface AppViewStatsProps {
  showCashAmounts?: boolean;
}

export const AppViewStats = ({ showCashAmounts }: AppViewStatsProps) => {
  const {
    isMobile,
    loginAccount,
    userInfo: { balances },
  } = useAppStatusStore();
  const isLogged = Boolean(loginAccount?.account);
  const totalAccountValue = useMemo(
    () => handleValue(isLogged ? balances?.totalAccountValue : 0),
    [isLogged, balances.totalAccountValue]
  );
  const positionsValue = useMemo(
    () => handleValue(isLogged ? balances?.totalPositionUsd : 0),
    [isLogged, balances.totalPositionUsd]
  );
  const availableFunds = useMemo(
    () => handleValue(isLogged ? balances?.availableFundsUsd : 0),
    [isLogged, balances.availableFundsUsd]
  );
  const usdValueETH = useMemo(
    () => handleValue(balances?.USDC?.usdValue || 0),
    [balances?.USDC?.usdValue]
  );
  const usdValueUSDC = useMemo(
    () => handleValue(balances?.ETH?.usdValue || 0),
    [balances?.ETH?.usdValue]
  );
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
        value={totalAccountValue}
      />
      <ValueLabel
        large
        label="positions"
        light={!isLogged}
        value={positionsValue}
      />
      <ValueLabel
        large
        light={!isLogged}
        label="available funds"
        value={availableFunds}
      />
      {showCashAmounts && (
        <>
          <IconLabel icon={EthIcon} value={usdValueETH} />
          <IconLabel icon={UsdIcon} value={usdValueUSDC} />
        </>
      )}
    </div>
  );
};


export const AddLiquidity = ({ market }: { market: MarketInfo }) => {
  const {
    actions: { setModal },
  } = useAppStatusStore();
  return (
    <div
      className={classNames(Styles.AddLiquidity)}
      onClick={() => setModal({ type: MODAL_ADD_LIQUIDITY, market })}
    >
      <span>
        {PlusIcon}
        add liquidity
      </span>
      <span>earn fees as a liquidity provider</span>
    </div>
  );
};

export const AddCurrencyLiquidity = ({ market, currency }: { market: MarketInfo, currency: string}) => {
  const {
    actions: { setModal },
  } = useAppStatusStore();

  return (
    <div
      className={classNames(Styles.AddCurrencyLiquidity)}
      onClick={() => setModal({ type: MODAL_ADD_LIQUIDITY, market, liquidityModalType: CREATE, currency })}
    >
      {currency === USDC ? USDCIcon : EthIcon}
      {`Create this market in ${currency}`}
    </div>
  );
};

export const ErrorBlock = ({ text }) => {
  return <div className={Styles.ErrorBlock}>{text}</div>;
};

export const NetworkMismatchBanner = () => {
  const {
    paraConfig: { networkId },
    loginAccount,
  } = useAppStatusStore();
  const location = useLocation();
  const path = parsePath(location.pathname)[0];
  const { chainId } = loginAccount || {};
  const isNetworkMismatch = useMemo(
    () => !!chainId && String(networkId) !== String(chainId),
    [chainId, networkId]
  );
  return (
    <>
      {isNetworkMismatch && (
        <article
          className={classNames(Styles.NetworkMismatch, {
            [Styles.Market]: path === MARKET,
          })}
        >
          You're connected to an unsupported network
        </article>
      )}
    </>
  );
};

export const generateTooltip = (tipText: string, key: string) => {
  return (
    <span className={TooltipStyles.Container}>
      <label
        className={classNames(TooltipStyles.TooltipHint)}
        data-tip
        data-for={key}
        data-iscapture={true}
      >
        {HelpIcon}
      </label>
      <ReactTooltip
        id={key}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="top"
        type="light"
        event="mouseover mouseenter"
        eventOff="mouseleave mouseout scroll mousewheel blur"
      >
        <p>{tipText}</p>
      </ReactTooltip>
    </span>
  );
};
