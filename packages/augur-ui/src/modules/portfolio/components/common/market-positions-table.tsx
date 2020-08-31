import React, { useState } from 'react';

import PositionsHeader from 'modules/portfolio/components/common/positions-header';
import { PositionRow } from 'modules/common/table-rows';
import classNames from 'classnames';

import SharedStyles from 'modules/market/components/market-orders-positions-table/open-orders-table.styles.less';
import Styles from 'modules/portfolio/components/common/market-positions-table.styles.less';
import type { Getters } from '@augurproject/sdk';
import { selectUserMarketPositions } from 'modules/markets/selectors/select-user-market-positions';
import { MarketData } from 'modules/types';

export interface MarketPositionsTableProps {
  positions: Getters.Users.TradingPosition[];
  extendedView: boolean;
  marketId: string;
  market: MarketData;
}

export const PositionsTable = ({
  market,
  marketId,
  extendedView,
  positions
}: MarketPositionsTableProps) => {
  let marketIdSelected = marketId;
  if (!marketId) {
    marketIdSelected = market.id;
  }
  let positionsSelected = [];
  if (positions) {
    positionsSelected = positions;
  } else if (marketIdSelected) {
    positionsSelected = selectUserMarketPositions(marketIdSelected);
  }

  const [showPercent, setShowPercent] = useState(true);

  return (
    <div
      className={classNames(Styles.PositionsTable, {
        [SharedStyles.Table]: extendedView,
      })}
    >
      <PositionsHeader
        showPercent={showPercent}
        updateShowPercent={() => setShowPercent(!showPercent)}
        extendedView={extendedView}
      />
      <div>
        {positionsSelected.map((position: Position, index: number) => (
          <PositionRow
            key={'positionRow_' + position.marketId + position.outcomeId}
            position={position}
            showPercent={showPercent}
            extendedView={extendedView}
            isSingle={extendedView}
            showExpandedToggleOnMobile
            isFirst={index === 0}
          />
        ))}
      </div>
      {extendedView && positionsSelected.length === 0 && (
        <div className={SharedStyles.Empty}>no positions to show</div>
      )}
    </div>
  );
};
