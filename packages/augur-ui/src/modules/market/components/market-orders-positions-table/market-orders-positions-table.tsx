import React from "react";
import PropTypes from "prop-types";

import ModuleTabs from "modules/market/components/common/module-tabs/module-tabs";
import ModulePane from "modules/market/components/common/module-tabs/module-pane";
import OpenOrdersTable from "modules/market/components/market-orders-positions-table/open-orders-table";
import PositionsTable from "modules/market/containers/positions-table";
import FilledOrdersTable from "modules/market/components/market-orders-positions-table/filled-orders-table";
import { CancelTextButton } from "modules/common/buttons";

import Styles from "modules/market/components/market-orders-positions-table/open-orders-table.styles";

const MarketOrdersPositionsTable = ({
  hasPending,
  marketId,
  market,
  openOrders,
  filledOrders,
  cancelAllOpenOrders,
  updateSelectedOrderProperties
}) => (
  <ModuleTabs
    className={Styles.Tabs}
    selected={0}
    fillForOnlyMobile
    borderBetween
  >
    <ModulePane label="Open Orders">
      <OpenOrdersTable
        openOrders={openOrders}
        market={market}
      />
      <div className={Styles.Footer}>
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
      <PositionsTable marketId={marketId} extendedView updateSelectedOrderProperties={updateSelectedOrderProperties} />
    </ModulePane>
  </ModuleTabs>
);

MarketOrdersPositionsTable.propTypes = {
  hasPending: PropTypes.bool,
  marketId: PropTypes.string,
  outcomes: PropTypes.array,
  openOrders: PropTypes.array,
  market: PropTypes.object.isRequired,
  filledOrders: PropTypes.array,
  cancelAllOpenOrders: PropTypes.func.isRequired,
};

MarketOrdersPositionsTable.defaultProps = {
  hasPending: false,
  outcomes: [],
  openOrders: [],
  filledOrders: [],
  marketId: null,
};

export default MarketOrdersPositionsTable;
