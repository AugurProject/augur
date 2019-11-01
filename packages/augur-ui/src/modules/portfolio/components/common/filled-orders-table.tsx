/* eslint react/no-array-index-key: 0 */

import React from 'react';

import { formatShares } from 'utils/format-number';
import { MarketData } from 'modules/types';
import {
  LinearPropertyLabel,
  LinearPropertyViewTransaction,
  ValueLabel,
} from 'modules/common/labels';
import { ViewTransactionDetailsButton } from 'modules/common/buttons';

import Styles from 'modules/portfolio/components/common/filled-orders-table.styles.less';
import MarketTitle from 'modules/market/containers/market-title';

export interface FilledOrdersTableProps {
  filledOrder: MarketData;
  showMarketInfo: boolean;
}

const FilledOrdersTable = (props: FilledOrdersTableProps) => {
  const { filledOrder, showMarketInfo } = props;
  return (
    <div className={Styles.FilledOrders}>
      <div>
        {showMarketInfo && (
          <MarketTitle id={filledOrder.marketId} />
        )}
        <ul>
          <li>Filled</li>
          <li>Time Stamp</li>
          <li>TX Details</li>
        </ul>
        {filledOrder.trades.map((trade: MarketData, i: number) => (
          <ul key={i}>
            <li>
              <ValueLabel value={formatShares(trade.amount)} />
            </li>
            <li>{trade.timestamp.formattedShort}</li>
            <li>
              <ViewTransactionDetailsButton
                label={'VIEW etherscan tx'}
                light
                transactionHash={trade.transactionHash}
              />
            </li>
          </ul>
        ))}
      </div>
      <div>
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
