import React, { useEffect, useMemo } from 'react';
import Styles from './labels.styles.less';
import { useLocation } from 'react-router';
import classNames from 'classnames';
import { MarketInfo } from '../types';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import {
  useAppStatusStore,
  useGraphDataStore,
  useUserStore,
  Icons,
  Utils,
  Constants,
  PARA_CONFIG,
  LabelComps,
} from '@augurproject/augur-comps';
const { CREATE, USDC, ETH, MODAL_ADD_LIQUIDITY, MARKET, ADD } = Constants;
const { ValueLabel, IconLabel } = LabelComps;
const {
  PathUtils: { parsePath },
  Formatter: { formatCash },
} = Utils;
const { USDCIcon, EthIcon, PlusIcon, UsdIcon } = Icons;

const handleValue = (value, cashName = USDC) =>
  formatCash(value, cashName, {
    bigUnitPostfix: true,
  }).full;

export const AppViewStats = ({ small }) => {
  const { isLogged } = useAppStatusStore();
  const { balances } = useUserStore();
  const totalAccountValue = useMemo(
    () => handleValue(isLogged ? balances?.totalAccountValue : 0),
    [isLogged, balances.totalAccountValue]
  );
  const positionsValue = useMemo(
    () => handleValue(isLogged ? balances?.totalPositionUsd : 0),
    [isLogged, balances.totalPositionUsd]
  );
  const ethValue = useMemo(
    () => handleValue(balances?.ETH?.balance || 0, ETH),
    [balances?.ETH?.balance]
  );
  const usdValueUSDC = useMemo(
    () => handleValue(balances?.USDC?.usdValue || 0),
    [balances?.USDC?.usdValue]
  );
  return (
    <div className={classNames(Styles.AppStats, { [Styles.small]: small })}>
      <ValueLabel
        large={!small}
        label="total acc value"
        light={!isLogged}
        value={totalAccountValue}
        small={small}
      />
      <ValueLabel
        large={!small}
        label="positions"
        light={!isLogged}
        value={positionsValue}
        small={small}
      />
      <ValueLabel
        large={!small}
        small={small}
        label="Available USDC"
        value={usdValueUSDC}
      />
      <ValueLabel
        large={!small}
        small={small}
        label="Available ETH"
        value={ethValue}
      />
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
      title={
        isLogged
          ? `Create this market in ${currency}`
          : `Connect an account to create this market in ${currency}`
      }
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

export const NetworkMismatchBanner = () => {
  const { errors } = useGraphDataStore();
  const { loginAccount } = useUserStore();
  const { error } = useWeb3React();
  const { networkId } = PARA_CONFIG;
  const location = useLocation();
  const path = parsePath(location.pathname)[0];
  const { chainId } = loginAccount || {};
  const isNetworkMismatch = useMemo(
    () => !!chainId && String(networkId) !== String(chainId),
    [chainId, networkId]
  );
  const isGraphError = !!errors;
  const unsupportedChainIdError =
    error && error instanceof UnsupportedChainIdError;

  useEffect(() => {
    // in the event of an error, scroll to top to force banner to be seen.
    if (isNetworkMismatch || isGraphError || unsupportedChainIdError) {
      document.getElementById('mainContent')?.scrollTo(0, 0);
      window.scrollTo(0, 1);
    }
  }, [isNetworkMismatch, isGraphError, unsupportedChainIdError]);

  return (
    <>
      {(isNetworkMismatch || unsupportedChainIdError) && (
        <article
          className={classNames(Styles.NetworkMismatch, {
            [Styles.Market]: path === MARKET,
          })}
        >
          You're connected to an unsupported network
        </article>
      )}
      {isGraphError && (
        <article
          className={classNames(Styles.NetworkMismatch, {
            [Styles.Market]: path === MARKET,
          })}
        >
          Unable to retrieve market data
        </article>
      )}
    </>
  );
};
