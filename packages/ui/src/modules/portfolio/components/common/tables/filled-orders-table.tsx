/* eslint react/no-array-index-key: 0 */

import React from "react";

import { formatShares } from "utils/format-number";
import { FilledOrder } from "modules/portfolio/types";
import MarketLink from "modules/market/components/market-link/market-link";
import {
  LinearPropertyLabel,
  LinearPropertyViewTransaction,
  ValueLabel
} from "modules/common-elements/labels";
import { ViewTransactionDetailsButton } from "modules/common-elements/buttons";

import Styles from "modules/portfolio/components/common/tables/filled-orders-table.styles";

export interface FilledOrdersTableProps {
  filledOrder: FilledOrder;
  showMarketInfo: Boolean;
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
        {filledOrder.trades.map((trade: FilledOrder, i: number) => (
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
        {filledOrder.trades.map((trade: FilledOrder, i: number) => (
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
