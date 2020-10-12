import React from 'react';
import { TXEventName } from '@augurproject/sdk-lite';
import classNames from 'classnames';
import { SubmitTextButton, TextUnderlineButton } from 'modules/common/buttons';
import { SCALAR, SIGN_SEND_ORDERS } from 'modules/common/constants';
import {
  Archived,
  LiquidityDepletedLabel,
  MarketStatusLabel,
  MarketTypeLabel,
  TemplateShield,
} from 'modules/common/labels';

import ToggleRow from 'modules/common/toggle-row';
import {
  MarketStatusLabel,
  TemplateShield,
  MarketTypeLabel,
  LiquidityDepletedLabel,
  Archived,
} from 'modules/common/labels';
import {
  SCALAR,
  SIGN_SEND_ORDERS,
  MODAL_UNSIGNED_ORDERS,
  THEMES,
} from 'modules/common/constants';
import MarketTitle from 'modules/market/components/common/market-title';
import { TXEventName } from '@augurproject/sdk';
import { SubmitTextButton } from 'modules/common/buttons';

import Styles from 'modules/portfolio/components/common/market-row.styles.less';
import { MarketData } from 'modules/types';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { useMarketsStore } from 'modules/markets/store/markets';

export interface TimeObject {
  formattedUtcShortDate: string;
}
export interface FormatObject {
  formatted: string;
}

export interface MarketRowProps {
  market: MarketData;
  showState: boolean;
  toggleContent: ReactNode;
  rightContent: ReactNode;
  noToggle?: boolean;
  showPending?: boolean;
  addedClass?: string | object;
  showLiquidityDepleted?: boolean;
}

const MarketRow = ({
  market,
  showState,
  toggleContent,
  rightContent,
  noToggle,
  showPending,
  addedClass,
  showLiquidityDepleted,
}: MarketRowProps) => {
  const {
    theme,
    actions: { setModal },
  } = useAppStatusStore();
  const renderLiquidityDepletedLabel = theme === THEMES.SPORTS || showLiquidityDepleted;
  const content = (
    <div
      className={classNames(Styles.MarketRowContent, addedClass, {
        [Styles.NoToggle]: noToggle,
      })}
    >
      <div
        className={classNames({
          [Styles.Show]: showState,
          [Styles.Pending]:
            market?.pending ||
            (showPending && market.hasPendingLiquidityOrders),
        })}
      >
        {showState && !market?.pending && (
          <div>
            {market.isTemplate && <TemplateShield market={market} />}
            <Archived market={market} />
            <MarketStatusLabel
              reportingState={market.reportingState}
              alternate
              mini
              isWarpSync={market.isWarpSync}
            />
            {market.marketType === SCALAR && (
              <MarketTypeLabel marketType={market.marketType} />
            )}
            {renderLiquidityDepletedLabel && (
              <LiquidityDepletedLabel market={market} />
            )}
            <span>{rightContent}</span>
          </div>
        )}
        {!market.pending && <MarketTitle id={market.id} />}
        {market.pending && <span>{market.description}</span>}
        {market.pending && market.status === TXEventName.Pending && (
          <span>
            When the market is confirmed you can submit initial liquidity
          </span>
        )}
        {!market.pending && showPending && market.hasPendingLiquidityOrders && (
          <span>
            {theme === THEMES.SPORTS
              ? ''
              : 'You have pending initial liquidity.'}
            {theme !== THEMES.SPORTS && (
              <SubmitTextButton
                action={() =>
                  setModal({
                    type: MODAL_UNSIGNED_ORDERS,
                    marketId: market.marketId,
                  })
                }
                text={SIGN_SEND_ORDERS}
              />
            )}
          </span>
        )}
        <span>{rightContent}</span>
      </div>
      <span
        className={classNames({
          [Styles.MarketRow__timeShow]: showState,
        })}
      >
        {rightContent}
      </span>
    </div>
  );

  return (
    <div className={Styles.MarketRow}>
      {noToggle ? (
        content
      ) : (
        <ToggleRow
          arrowClassName={Styles.Arrow}
          rowContent={content}
          toggleContent={toggleContent}
        />
      )}
    </div>
  );
};

export default MarketRow;
