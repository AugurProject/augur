import React from 'react';
import classNames from 'classnames';

import Styles from './market-card.styles.less';
import {MarketInfo} from '../../utils/types';
import { formatPercent } from '../../utils/format-number';

export const LoadingMarketCard = () => {
  return (
    <article className={Styles.LoadingMarketCard}>
      <div>
        <div />
        <div />
        <div />
      </div>
      <div>
        <div />
        <div />
        <div />
      </div>
      <div>
        <div />
        <div />
        <div />
      </div>
    </article>
  );
};
export const MarketCard = ({
  market,
  handleNoLiquidity = (market: MarketInfo) => {},
  noLiquidityDisabled = false,
}: {
  market: MarketInfo;
  handleNoLiquidity: Function;
  noLiquidityDisabled: boolean;
}) => {
  const {
    categories,
    description,
    marketId,
    amm,
    reportingState,
    outcomes,
  } = market;
  const formattedApy = amm?.apy && formatPercent(amm.apy).full;
  return (
    <article
      className={classNames(Styles.MarketCard, {
        [Styles.NoLiquidity]: !amm,
      })}
      onClick={() => handleNoLiquidity(market)}
    >
      {/* <div>
        <article
          className={classNames({
            [Styles.Trading]: reportingState === MARKET_STATUS.TRADING,
          })}
        >
          <ReportingStateLabel {...{reportingState}} />
          <CategoryIcon {...{categories}} />
          <CategoryLabel {...{categories}} />
          <div>
            <ReportingStateLabel {...{reportingState}} />
            <InvalidFlagTipIcon {...{market}} />
            <CurrencyTipIcon name={amm?.cash?.name} marketId={marketId} />
          </div>
        </article>
        {!amm ? (
          <>
            <span>{description}</span>
            <div>
              <span>Market requires Initial liquidity</span>
              <PrimaryButton
                title={
                  noLiquidityDisabled
                    ? "Connect an account to earn fees as a liquidity provider"
                    : "Earn fees as a liquidity provider"
                }
                disabled={noLiquidityDisabled}
                text="Earn fees as a liquidity provider"
              />
            </div>
          </>
        ) : (
          <MarketLink id={marketId} dontGoToMarket={!amm} ammId={amm?.id}>
            <span>{description}</span>
            <ValueLabel
              label="total volume"
              value={formatDai(market.amm?.volumeTotalUSD).full}
            />
            <ValueLabel label="APY" value={formattedApy} />
            <OutcomesTable amm={amm} marketOutcomes={outcomes} />
          </MarketLink>
        )}
      </div> */}
    </article>
  );
};
