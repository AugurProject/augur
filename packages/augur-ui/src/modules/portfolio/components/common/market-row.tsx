import React, { ReactNode } from 'react';
import classNames from 'classnames';

import ToggleRow from 'modules/common/toggle-row';
import { MarketStatusLabel } from 'modules/common/labels';
import MarketTitle from 'modules/market/containers/market-title';
import { TXEventName } from '@augurproject/sdk';
import { SubmitTextButton } from 'modules/common/buttons';

import Styles from 'modules/portfolio/components/common/market-row.styles.less';

export interface TimeObject {
  formattedUtcShortDate: string;
}
export interface FormatObject {
  formatted: string;
}

export interface Market {
  id: string;
  description: string;
  reportingState: string;
  creationTime: number;
  endTime: number;
  volume: FormatObject;
  openInterest: FormatObject;
  marketStatus: string;
  unsignedOrdersModal: Function;
}

export interface MarketRowProps {
  market: Market;
  showState: boolean;
  toggleContent: ReactNode;
  rightContent: ReactNode;
  noToggle?: boolean;
  showPending?: boolean;
}

const MarketRow = (props: MarketRowProps) => {
  const content = (
    <div
      className={classNames(Styles.MarketRowContent, {
        [Styles.NoToggle]: props.noToggle,
      })}
    >
      <div
        className={classNames({
          [Styles.Show]: props.showState,
          [Styles.Pending]:
            props.market.pending ||
            (props.showPending && props.market.hasPendingLiquidityOrders),
        })}
      >
        {props.showState && !props.market.pending && (
          <div>
            <MarketStatusLabel
              reportingState={props.market.reportingState}
              alternate
              mini
            />
          </div>
        )}
        {!props.market.pending && <MarketTitle id={props.market.id} />}
        {props.market.pending && <span>{props.market.description}</span>}
        {props.market.pending &&
          props.market.status === TXEventName.Pending && (
            <span>
              When the market is confirmed you can submit initial liquidity
            </span>
          )}
        {!props.market.pending &&
          props.showPending &&
          props.market.hasPendingLiquidityOrders && (
            <span>
              You have pending initial liquidity.
              <SubmitTextButton
                action={() => props.unsignedOrdersModal(props.market.marketId)}
                text="View orders"
              />
            </span>
          )}
      </div>
      <span
        className={classNames({
          [Styles.MarketRow__timeShow]: props.showState,
        })}
      >
        {props.rightContent}
      </span>
    </div>
  );

  return (
    <div className={Styles.MarketRow}>
      {props.noToggle ? (
        content
      ) : (
        <ToggleRow
          arrowClassName={Styles.Arrow}
          rowContent={content}
          toggleContent={props.toggleContent}
        />
      )}
    </div>
  );
};

export default MarketRow;
