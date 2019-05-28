/* eslint react/no-array-index-key: 0 */

import React from "react";
import PropTypes from "prop-types";

import FilledOrder from "modules/portfolio/containers/filled-order";
import FilledOrdersHeader from "modules/portfolio/components/common/headers/filled-orders-header";

import Styles from "modules/market/components/market-orders-positions-table/open-orders-table.style";

const FilledOrdersTable = ({ filledOrders, scalarDenomination }) => (
  <div>
    <div className={Styles.MarketOpenOrdersList__table}>
      <FilledOrdersHeader extendedView />
      {filledOrders.length === 0 && (
        <div className={Styles.MarketOpenOrdersList__empty} />
      )}
      <div className={Styles.MarketOpenOrdersList__scrollContainer}>
        {filledOrders.length > 0 && (
          <div className={Styles["MarketOpenOrdersList__table-body"]}>
            {filledOrders.map((order, i) => (
              <FilledOrder key={i} filledOrder={order} extendedViewNotOnMobile />
            ))}
          </div>
        )}
      </div>
    </div>
    <div className={Styles.MarketOrders__footer} />
  </div>
);

FilledOrdersTable.propTypes = {
  filledOrders: PropTypes.array,
  scalarDenomination: PropTypes.string
};

FilledOrdersTable.defaultProps = {
  filledOrders: [],
  scalarDenomination: ""
};

export default FilledOrdersTable;
