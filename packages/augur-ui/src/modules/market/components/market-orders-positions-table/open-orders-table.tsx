/* eslint react/no-array-index-key: 0 */

import React from "react";
import PropTypes from "prop-types";

import OpenOrder from "modules/portfolio/containers/open-order";
import OpenOrdersHeader from "modules/portfolio/components/common/headers/open-orders-header";

import Styles from "modules/market/components/market-orders-positions-table/open-orders-table.style";

const OpenOrdersTable = ({ openOrders }) => (
  <div className={Styles.Table}>
    <OpenOrdersHeader extendedView />
    <div>
      {openOrders.length > 0 && openOrders.map((order, i) => (
        <OpenOrder key={i} openOrder={order} extendedViewNotOnMobile />
      ))}
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
