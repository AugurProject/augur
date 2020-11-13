import React from 'react';

import ModuleTabs from 'modules/market/components/common/module-tabs/module-tabs';
import ModulePane from 'modules/market/components/common/module-tabs/module-pane';
import OpenOrdersTable from 'modules/market/components/market-orders-positions-table/open-orders-table';
import PositionsTable from 'modules/market/containers/positions-table';
import FilledOrdersTable from 'modules/market/components/market-orders-positions-table/filled-orders-table';
import { CancelTextButton } from 'modules/common/buttons';

import Styles from 'modules/market/components/market-orders-positions-table/open-orders-table.styles.less';
import { MarketData, NodeStyleCallback, UIOrder, DefaultOrderProperties } from 'modules/types';

interface MarketOrdersPositionsTableProps {
  hasPending?: boolean,
  marketId?: string,
  outcomes?: UIOrder[],
  openOrders?: UIOrder[],
  market: MarketData,
  filledOrders?: UIOrder[],
  cancelAllOpenOrders: (orders: UIOrder[], cb?: NodeStyleCallback) => void,
  preview: boolean,
  toggle?: () => void,
  updateSelectedOrderProperties: (selectedOrderProperties: DefaultOrderProperties) => void
  selected?: number;
  positions?: any[],
}

const MarketOrdersPositionsTable: React.FC<MarketOrdersPositionsTableProps> = ({
  hasPending,
  marketId,
  market,
  openOrders,
  filledOrders,
  cancelAllOpenOrders,
  updateSelectedOrderProperties,
  toggle,
  selected,
  positions
}) => (
    <ModuleTabs
      className={Styles.Tabs}
      selected={selected ? selected : 0}
      fillForMobile
      showToggle
      toggle={toggle}
    >
      <ModulePane label="Open Orders">
        <OpenOrdersTable openOrders={openOrders} marketId={market.marketId} />
        {openOrders.length > 0 && (
          <div className={Styles.Footer}>
            <CancelTextButton
              action={() => cancelAllOpenOrders(openOrders)}
              text="Cancel All"
              disabled={hasPending}
            />
          </div>
        )}
      </ModulePane>
      <ModulePane label="My Fills">
        <FilledOrdersTable
          filledOrders={filledOrders}
          isArchived={market.isArchived}
          scalarDenomination={market.scalarDenomination}
        />
      </ModulePane>
      <ModulePane label="Positions">
        <PositionsTable
          marketId={marketId}
          extendedView
          updateSelectedOrderProperties={updateSelectedOrderProperties}
          positions={positions}
          showRawPositions={false}
        />
      </ModulePane>
      <ModulePane label="Raw Positions">
        <PositionsTable
          marketId={marketId}
          extendedView
          updateSelectedOrderProperties={updateSelectedOrderProperties}
          positions={positions}
          showRawPositions={true}
        />
      </ModulePane>
    </ModuleTabs>
  );

MarketOrdersPositionsTable.defaultProps = {
  hasPending: false,
  outcomes: [],
  openOrders: [],
  filledOrders: [],
  marketId: null,
};

export default MarketOrdersPositionsTable;
