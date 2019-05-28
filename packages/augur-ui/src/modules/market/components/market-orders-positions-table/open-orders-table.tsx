/* eslint react/no-array-index-key: 0 */

import React from "react";
import PropTypes from "prop-types";

import OpenOrder from "modules/portfolio/containers/open-order";
import OpenOrdersHeader from "modules/portfolio/components/common/headers/open-orders-header";

import Styles from "modules/market/components/market-orders-positions-table/open-orders-table.style";

const OpenOrdersTable = ({ openOrders }) => (
  <div>
    <div className={Styles.MarketOpenOrdersList__table}>
      <OpenOrdersHeader extendedView />
      <div className={Styles.MarketOpenOrdersList__scrollContainer}>
        {openOrders.length > 0 && (
          <div className={Styles["MarketOpenOrdersList__table-body"]}>
            {openOrders.map((order, i) => (
              <OpenOrder key={i} openOrder={order} extendedViewNotOnMobile />
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

OpenOrdersTable.propTypes = {
  openOrders: PropTypes.array
};

OpenOrdersTable.defaultProps = {
  openOrders: []
};

export default OpenOrdersTable;
