/* eslint react/no-array-index-key: 0 */

import React from "react";

import { formatShares } from "utils/format-number";
import { MarketData } from "modules/types";
import MarketLink from "modules/market/components/market-link/market-link";
import {
  LinearPropertyLabel,
  LinearPropertyViewTransaction,
  ValueLabel
} from "modules/common/labels";
import { ViewTransactionDetailsButton } from "modules/common/buttons";

import Styles from "modules/portfolio/components/common/tables/filled-orders-table.styles.less";

export interface FilledOrdersTableProps {
  filledOrder: MarketData;
  showMarketInfo: boolean;
}

const FilledOrdersTable = (props: FilledOrdersTableProps) => {
  const { filledOrder, showMarketInfo } = props;
  return (
    <div className={Styles.FilledOrdersTable}>
      <div className={Styles.FilledOrdersTable__inner}>
        {showMarketInfo && (
          <MarketLink id={filledOrder.marketId}>
            {filledOrder.marketDescription}
          </MarketLink>
        )}
        <ul className={Styles.FilledOrdersTable__header}>
          <li>Filled</li>
          <li>Time Stamp</li>
          <li>TX Details</li>
        </ul>
        {filledOrder.trades.map((trade: MarketData, i: number) => (
          <ul key={i} className={Styles.FilledOrdersTable__trade}>
            <li>
              <ValueLabel value={formatShares(trade.amount)} />
            </li>
            <li>{trade.timestamp.formattedShort}</li>
            <li>
              <ViewTransactionDetailsButton
                transactionHash={trade.transactionHash}
              />
            </li>
          </ul>
        ))}
      </div>
      <div className={Styles.FilledOrdersTable__innerMobile}>
        {showMarketInfo && (
          <MarketLink id={filledOrder.marketId}>
            <span>Market:</span> {filledOrder.marketDescription}
          </MarketLink>
        )}
        {filledOrder.trades.map((trade: MarketData, i: number) => (
          <div key={i}>
            <LinearPropertyLabel
              highlightFirst
              label="Filled"
              value={formatShares(trade.amount).formatted}
            />
            <LinearPropertyLabel
              highlightFirst
              label="Timestamp"
              value={trade.timestamp.formattedShort}
            />
            <LinearPropertyViewTransaction
              highlightFirst
              transactionHash={trade.transactionHash}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilledOrdersTable;
