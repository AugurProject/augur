import React from "react";
import PropTypes from "prop-types";

import ModuleTabs from "modules/market/components/common/module-tabs/module-tabs";
import ModulePane from "modules/market/components/common/module-tabs/module-pane";
import OpenOrdersTable from "modules/market/components/market-orders-positions-table/open-orders-table";
import PositionsTable from "modules/market/containers/positions-table";
import FilledOrdersTable from "modules/market/components/market-orders-positions-table/filled-orders-table";
import { CancelTextButton } from "modules/common-elements/buttons";

import Styles from "modules/market/components/market-orders-positions-table/open-orders-table.style";

const MarketOrdersPositionsTable = ({
  hasPending,
  marketId,
  outcomes,
  market,
  openOrders,
  filledOrders,
  cancelAllOpenOrders
}) => (
  <ModuleTabs
    className={Styles.Table}
    selected={0}
    fillForOnlyMobile
    borderBetween
  >
    <ModulePane label="Open Orders">
      <OpenOrdersTable
        openOrders={openOrders}
        marketId={marketId}
        market={market}
      />
      <div className={Styles.MarketOrders__footer}>
        {openOrders.length > 0 && (
          <CancelTextButton
            action={() => cancelAllOpenOrders(openOrders)}
            text="Cancel All"
            disabled={hasPending}
          />
        )}
      </div>
    </ModulePane>
    <ModulePane label="My Fills">
      <FilledOrdersTable
        filledOrders={filledOrders}
        scalarDenomination={market.scalarDenomination}
      />
    </ModulePane>
    <ModulePane label="Positions">
      <PositionsTable marketId={marketId} extendedView />
    </ModulePane>
  </ModuleTabs>
);

MarketOrdersPositionsTable.propTypes = {
  hasPending: PropTypes.bool,
  marketId: PropTypes.string.isRequired,
  outcomes: PropTypes.array,
  openOrders: PropTypes.array,
  market: PropTypes.object.isRequired,
  filledOrders: PropTypes.array,
  cancelAllOpenOrders: PropTypes.func.isRequired
};

MarketOrdersPositionsTable.defaultProps = {
  hasPending: false,
  outcomes: [],
  openOrders: [],
  filledOrders: []
};

export default MarketOrdersPositionsTable;
