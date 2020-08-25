import React from 'react';
import { useLocation } from 'react-router';
import ModuleTabs from 'modules/market/components/common/module-tabs/module-tabs';
import ModulePane from 'modules/market/components/common/module-tabs/module-pane';
import OpenOrdersTable from 'modules/market/components/market-orders-positions-table/open-orders-table';
import { PositionsTable } from "modules/portfolio/components/common/market-positions-table";
import FilledOrdersTable from 'modules/market/components/market-orders-positions-table/filled-orders-table';
import { CancelTextButton } from 'modules/common/buttons';

import Styles from 'modules/market/components/market-orders-positions-table/open-orders-table.styles.less';
import {
  MarketData,
  UIOrder,
  DefaultOrderProperties,
} from 'modules/types';
import {
  addCanceledOrder,
  addCanceledOrder,
} from 'modules/pending-queue/actions/pending-queue-management';
import { TXEventName } from '@augurproject/sdk-lite';
import { selectMarket } from 'modules/markets/selectors/market';
import { selectUserFilledOrders } from 'modules/orders/selectors/filled-orders';
import getUserOpenOrders from 'modules/orders/selectors/user-open-orders';
import { cancelAllOpenOrders } from 'modules/orders/actions/cancel-order';
import { getTutorialPreview } from 'modules/market/store/market-utils';

interface MarketOrdersPositionsTableProps {
  marketId: string;
  orders?: UIOrder[];
  market: MarketData;
  fills?: UIOrder[];
  toggle?: () => void;
  updateSelectedOrderProperties: (
    selectedOrderProperties: DefaultOrderProperties
  ) => void;
  selected?: number;
  positions?: any[];
}

const MarketOrdersPositionsTable: React.FC<MarketOrdersPositionsTableProps> = ({
  market,
  marketId,
  fills,
  orders,
  toggle,
  updateSelectedOrderProperties,
  selected,
  positions,
}: MarketOrdersPositionsTableProps) => {
  const location = useLocation();
  const {
    preview,
    isTutorial: tradingTutorial
  } = getTutorialPreview(marketId, location);
  const marketSelected = market || selectMarket(marketId);
  let openOrders = getUserOpenOrders(marketSelected.id);
  let filledOrders = marketSelected.id
    ? selectUserFilledOrders(marketSelected.id)
    : [];
  const hasPending = Boolean(openOrders.find(order => order.pending));

  if (preview && !tradingTutorial) {
    openOrders = [];
    Object.values(marketSelected.orderBook).map(outcome => {
      openOrders = openOrders.concat(outcome);
    });
  }

  if (tradingTutorial && orders) {
    openOrders = orders;
  }

  if (tradingTutorial && fills) {
    filledOrders = fills;
  }

  return (
    <ModuleTabs
      className={Styles.Tabs}
      selected={selected ? selected : 0}
      fillForMobile
      showToggle
      toggle={toggle}
    >
      <ModulePane label="Open Orders">
        <OpenOrdersTable
          openOrders={openOrders}
          marketId={marketSelected.marketId}
        />
        {openOrders.length > 0 && (
          <div className={Styles.Footer}>
            <CancelTextButton
              action={() => {
                cancelAllOpenOrders(openOrders);
                openOrders.forEach(order => {
                  addCanceledOrder(order.id, TXEventName.Pending, null);
                });
              }}
              text="Cancel All"
              disabled={hasPending}
            />
          </div>
        )}
      </ModulePane>
      <ModulePane label="My Fills">
        <FilledOrdersTable
          filledOrders={filledOrders}
          isArchived={marketSelected.isArchived}
          scalarDenomination={marketSelected.scalarDenomination}
        />
      </ModulePane>
      <ModulePane label="Positions">
        <PositionsTable
          marketId={marketId}
          market={market}
          extendedView
          updateSelectedOrderProperties={updateSelectedOrderProperties}
          positions={positions}
        />
      </ModulePane>
    </ModuleTabs>
  );
};

export default MarketOrdersPositionsTable;
