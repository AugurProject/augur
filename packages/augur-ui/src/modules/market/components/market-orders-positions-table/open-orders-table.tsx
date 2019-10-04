/* eslint react/no-array-index-key: 0 */

import React from "react";
import classNames from 'classnames';

import OpenOrder from "modules/portfolio/containers/open-order";
import OpenOrdersHeader from "modules/portfolio/components/common/open-orders-header";

import Styles from "modules/market/components/market-orders-positions-table/open-orders-table.styles";

interface OpenOrdersTableProps {
  openOrders?: any[];
}

const OpenOrdersTable: React.FC<OpenOrdersTableProps> = ({ openOrders }) => (
  <div className={classNames(Styles.Table, Styles.TableHeight)}>
    <OpenOrdersHeader extendedView />
    <div>
      {openOrders.length > 0 && openOrders.map((order, i) => (
        <OpenOrder key={i} openOrder={order} extendedViewNotOnMobile />
      ))}
    </div>
  </div>
);

OpenOrdersTable.defaultProps = {
  openOrders: []
};

export default OpenOrdersTable;
