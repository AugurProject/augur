import React from 'react';
import Styles from './market-card.styles.less';
import { MarketLink } from '../routes/helpers/links';
import {
  ValueLabel,
  CategoryLabel,
  CategoryIcon,
  CurrencyTipIcon,
  ReportingStateLabel,
  InvalidFlagTipIcon,
} from '../common/labels';
import {
  formatCashPrice,
  formatDai,
  formatPercent,
} from '../../utils/format-number';
import { ConfirmedCheck } from '../common/icons';
import classNames from 'classnames';
import { PrimaryButton } from '../common/buttons';
import { AmmExchange, AmmOutcome, MarketInfo, MarketOutcome } from '../types';
import { MARKET_STATUS } from '../constants';

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

export const combineOutcomeData = (
  ammOutcomes: AmmOutcome[],
  marketOutcomes: MarketOutcome[]
) => {
  if (!ammOutcomes || ammOutcomes.length === 0) return [];
  return marketOutcomes.map((mOutcome, index) => ({
    ...mOutcome,
    ...ammOutcomes[index],
  }));
};

export const getWinningOutcome = (
  ammOutcomes: AmmOutcome[],
  marketOutcomes: MarketOutcome[]
) =>
  combineOutcomeData(ammOutcomes, marketOutcomes).filter(
    ({ payoutNumerator }) => payoutNumerator !== null && payoutNumerator !== '0'
  );

export const outcomesToDisplay = (
  ammOutcomes: AmmOutcome[],
  marketOutcomes: MarketOutcome[]
) => {
  const combinedData = combineOutcomeData(ammOutcomes, marketOutcomes);
  const invalid = combinedData.slice(0, 1);
  const yes = combinedData.slice(2, 3);
  const no = combinedData.slice(1, 2);
  let newOrder = invalid.concat(yes).concat(no).concat(combinedData.slice(3));
  if (
    newOrder[0].isFinalNumerator &&
    newOrder[0].payoutNumerator !== '0' &&
    newOrder[0].payoutNumerator !== null
  ) {
    // invalid is winner -- only pass invalid
    newOrder = invalid;
  } else {
    newOrder = newOrder.filter((outcome) => !outcome.isInvalid);
  }
  return newOrder;
};

const OutcomesTable = ({
  amm,
  marketOutcomes,
}: {
  amm: AmmExchange;
  marketOutcomes: MarketOutcome[];
}) => (
  <div
    className={classNames(Styles.OutcomesTable, {
      [Styles.hasWinner]: marketOutcomes[0].isFinalNumerator,
    })}
  >
    {outcomesToDisplay(amm.ammOutcomes, marketOutcomes).map((outcome) => {
      const isWinner =
        outcome.isFinalNumerator && outcome.payoutNumerator !== '0';
      return (
        <div
          key={`${outcome.name}-${amm?.marketId}-${outcome.id}`}
          className={classNames({ [Styles.WinningOutcome]: isWinner })}
        >
          <span>{outcome.name.toLowerCase()}</span>
          <span>
            {isWinner
              ? ConfirmedCheck
              : outcome.isFinalNumerator
              ? ''
              : amm?.liquidity !== '0'
              ? formatCashPrice(outcome.price, amm?.cash?.name).full
              : '-'}
          </span>
        </div>
      );
    })}
  </div>
);

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
      <div>
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
      </div>
    </article>
  );
};
