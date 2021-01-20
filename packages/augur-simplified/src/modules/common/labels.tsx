import React, { useMemo } from 'react';
import Styles from './labels.styles.less';
import { useLocation } from 'react-router';
import classNames from 'classnames';
import { formatDai } from '../../utils/format-number';
import { createBigNumber } from '../../utils/create-big-number';
import { CATEGORIES_ICON_MAP } from './category-icons-map';
import { useAppStatusStore } from '../stores/app-status';
import parsePath from '../routes/helpers/parse-path';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from './tooltip.styles.less';
import {
  HelpIcon,
  USDCIcon,
  AugurBlankIcon,
  EthIcon,
  PlusIcon,
  UsdIcon,
} from './icons';
import {
  CREATE,
  USDC,
  MARKET_STATUS,
  MODAL_ADD_LIQUIDITY,
  MARKET,
  ADD,
} from '../constants';
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
  big?: boolean;
}

export const CategoryLabel = ({ categories, big = false }: CategoriesProps) => {
  return (
    <div data-big={big} className={classNames(Styles.CategoryLabel)}>
      {!!categories[1] ? categories[1] : categories[0]}
    </div>
  );
};

export const CategoryIcon = ({ categories, big = false }: CategoriesProps) => {
  const prime = CATEGORIES_ICON_MAP[categories[0].toLowerCase()];
  const secondary = prime?.subOptions[categories[1].toLowerCase()];
  const icon = secondary?.icon ? secondary.icon : prime?.icon;
  return (
    <div
      data-big={big}
      className={classNames(
        Styles.CategoryIcon,
        Styles[`${categories[0].toLowerCase()}`]
      )}
    >
      {!!icon ? icon : AugurBlankIcon}
    </div>
  );
};

const AMM_MAP = {
  ETH: {
    icon: EthIcon,
    label: 'ETH Market',
  },
  USDC: {
    icon: UsdIcon,
    label: 'USDC Market',
  },
};

const getInfo = (name) =>
  AMM_MAP[name] ? AMM_MAP[name] : { label: 'Add Liquidity', icon: null };

export const CurrencyTipIcon = ({ name, marketId }) => {
  const { label, icon } = getInfo(name);
  return (
    <span
      className={classNames(Styles.CurrencyTipIcon, TooltipStyles.Container)}
    >
      <label
        className={classNames(TooltipStyles.TooltipHint)}
        data-tip
        data-for={`currencyTipIcon-${marketId}-${name}`}
        data-iscapture={true}
      >
        {icon}
      </label>
      <ReactTooltip
        id={`currencyTipIcon-${marketId}-${name}`}
        className={TooltipStyles.Tooltip}
        effect="solid"
        place="top"
        type="light"
        event="mouseover mouseenter"
        eventOff="mouseleave mouseout scroll mousewheel blur"
      >
        <p>{label}</p>
      </ReactTooltip>
    </span>
  );
  // return icon ? icon : null;
};

export const CurrencyLabel = ({ name }) => {
  let content = <>Add Liquidity</>;
  const { label, icon } = getInfo(name);
  if (icon) {
    content = (
      <>
        <span>{label}</span> {icon}
      </>
    );
  }
  return <span className={Styles.CurrencyLabel}>{content}</span>;
};

export const ReportingStateLabel = ({ reportingState, big = false }) => {
  let content;
  switch (reportingState) {
    case MARKET_STATUS.FINALIZED:
    case MARKET_STATUS.SETTLED: {
      content = (
        <div data-big={big} className={Styles.Resolved}>
          Resolved
        </div>
      );
      break;
    }
    case MARKET_STATUS.REPORTING:
    case MARKET_STATUS.DISPUTING: {
      content = (
        <div data-big={big} className={Styles.InSettlement}>
          In Settlement
        </div>
      );
      break;
    }
    default:
      break;
  }
  return <>{content}</>;
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
    isLogged,
    userInfo: { balances },
  } = useAppStatusStore();
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
  const usdValueETH = useMemo(() => handleValue(balances?.ETH?.usdValue || 0), [
    balances?.ETH?.usdValue,
  ]);
  const usdValueUSDC = useMemo(
    () => handleValue(balances?.USDC?.usdValue || 0),
    [balances?.USDC?.usdValue]
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
    isLogged,
    actions: { setModal },
  } = useAppStatusStore();
  return (
    <button
      className={classNames(Styles.AddLiquidity)}
      title={isLogged ? 'Add liquidity' : 'Connect an account to add liquidity'}
      onClick={() => {
        if (isLogged) {
          setModal({
            type: MODAL_ADD_LIQUIDITY,
            market,
            liquidityModalType: ADD,
            currency: market?.amm?.cash?.name,
          });
        }
      }}
      disabled={!isLogged}
    >
      <span>
        {PlusIcon}
        add liquidity
      </span>
      <span>earn fees as a liquidity provider</span>
    </button>
  );
};

export const AddCurrencyLiquidity = ({
  market,
  currency,
}: {
  market: MarketInfo;
  currency: string;
}) => {
  const {
    isLogged,
    actions: { setModal },
  } = useAppStatusStore();
  return (
    <button
      className={classNames(Styles.AddCurrencyLiquidity)}
      title={isLogged ? `Create this market in ${currency}` : `Connect an account to create this market in ${currency}`}
      onClick={() => {
        if (isLogged) {
          setModal({
            type: MODAL_ADD_LIQUIDITY,
            market,
            liquidityModalType: CREATE,
            currency,
          });
        }
      }}
      disabled={!isLogged}
    >
      {currency === USDC ? USDCIcon : EthIcon}
      {`Create this market in ${currency}`}
    </button>
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
