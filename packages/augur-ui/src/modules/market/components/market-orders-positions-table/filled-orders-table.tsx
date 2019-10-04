/* eslint react/no-array-index-key: 0 */

import React from "react";

import FilledOrder from "modules/portfolio/containers/filled-order";
import FilledOrdersHeader from "modules/portfolio/components/common/filled-orders-header";

import Styles from "modules/market/components/market-orders-positions-table/open-orders-table.styles";

interface FilledOrdersTableProps {
  filledOrders?: any[];
  scalarDenomination?: string;
};

const FilledOrdersTable: React.FC<FilledOrdersTableProps> = ({ filledOrders, scalarDenomination }) => (
  <>
    <div className={Styles.Table}>
      <FilledOrdersHeader extendedView />
      {filledOrders.length === 0 && (
        <div className={Styles.Empty} />
      )}
      <div>
        {filledOrders.length > 0 && filledOrders.map((order, i) => (
          <FilledOrder key={i} filledOrder={order} extendedViewNotOnMobile />
        ))}
      </div>
    </div>
  </>
);

FilledOrdersTable.defaultProps = {
  filledOrders: [],
  scalarDenomination: ""
};

export default FilledOrdersTable;
