import React, { ReactNode } from "react";
import classNames from "classnames";

import ToggleRow from "modules/common/toggle-row";
import { MarketStatusLabel } from "modules/common/labels";
import MarketLink from "modules/market/components/market-link/market-link";

import Styles from "modules/portfolio/components/common/market-row.styles.less";

export interface TimeObject {
  formattedShortDate: string;
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
}

export interface MarketRowProps {
  market: Market;
  showState: boolean;
  toggleContent: ReactNode;
  rightContent: ReactNode;
  noToggle?: boolean;
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
        })}
      >
        {props.showState && (
          <div>
            <MarketStatusLabel
              marketStatus={props.market.marketStatus}
              alternate
              mini
            />
          </div>
        )}
        <MarketLink id={props.market.id}>
          {props.market.description}
        </MarketLink>
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
