import { TXEventName } from '@augurproject/sdk-lite';
import classNames from 'classnames';
import { SubmitTextButton } from 'modules/common/buttons';
import { SCALAR, SIGN_SEND_ORDERS } from 'modules/common/constants';
import {
  Archived,
  LiquidityDepletedLabel,
  MarketStatusLabel,
  MarketTypeLabel,
  TemplateShield,
} from 'modules/common/labels';

import ToggleRow from 'modules/common/toggle-row';
import MarketTitle from 'modules/market/containers/market-title';

import Styles from 'modules/portfolio/components/common/market-row.styles.less';
import { MarketData } from 'modules/types';
import React, { ReactNode } from 'react';

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
  unsignedOrdersModal?: Function;
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
  unsignedOrdersModal,
  showLiquidityDepleted
}: MarketRowProps) => {
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
            {market.marketType === SCALAR && <MarketTypeLabel marketType={market.marketType} />}
            {showLiquidityDepleted && <LiquidityDepletedLabel market={market} />}
          </div>
        )}
        {!market.pending && <MarketTitle id={market.id} />}
        {market.pending && <span>{market.description}</span>}
        {market.pending &&
          market.status === TXEventName.Pending && (
            <span>
              When the market is confirmed you can submit initial liquidity
            </span>
          )}
        {!market.pending &&
          showPending &&
          market.hasPendingLiquidityOrders && (
            <span>
              You have pending initial liquidity.
              <SubmitTextButton
                action={() => unsignedOrdersModal(market.marketId)}
                text={SIGN_SEND_ORDERS}
              />
            </span>
          )}
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
