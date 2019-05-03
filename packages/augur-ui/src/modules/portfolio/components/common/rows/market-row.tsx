import React, { ReactNode } from "react";
import classNames from "classnames";

import ToggleRow from "modules/portfolio/components/common/rows/toggle-row";
import { MarketStatusLabel } from "modules/common-elements/labels";
import MarketLink from "modules/market/components/market-link/market-link";

import Styles from "modules/portfolio/components/common/rows/market-row.styles";

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
      className={classNames(Styles.MarketRow__contentContainer, {
        [Styles.MarketRow__noToggle]: props.noToggle
      })}
    >
      <div
        className={classNames(Styles.MarketRow__content, {
          [Styles.MarketRow__contentShow]: props.showState
        })}
      >
        {props.showState && (
          <div className={Styles.MarketRow__firstRow}>
            <MarketStatusLabel
              marketStatus={props.market.marketStatus}
              alternate
              mini
            />
          </div>
        )}
        <span className={Styles.MarketRow__description}>
          <MarketLink id={props.market.id}>
            {props.market.description}
          </MarketLink>
        </span>
      </div>
      <span
        className={classNames(Styles.MarketRow__time, {
          [Styles.MarketRow__timeShow]: props.showState
        })}
      >
        {props.rightContent}
      </span>
    </div>
  );

  return (
    <div className={Styles.MarketRow__container}>
      {props.noToggle ? (
        content
      ) : (
        <ToggleRow
          arrowClassName={Styles.MarketRow__Arrow}
          rowContent={content}
          toggleContent={props.toggleContent || <div>info</div>}
        />
      )}
    </div>
  );
};

export default MarketRow;
