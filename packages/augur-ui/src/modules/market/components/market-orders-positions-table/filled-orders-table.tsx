/* eslint react/no-array-index-key: 0 */

import React from "react";
import PropTypes from "prop-types";

import FilledOrder from "modules/portfolio/containers/filled-order";
import FilledOrdersHeader from "modules/portfolio/components/common/filled-orders-header";

import Styles from "modules/market/components/market-orders-positions-table/open-orders-table.style";

const FilledOrdersTable = ({ filledOrders, scalarDenomination }) => (
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
    <div className={Styles.Footer} />
  </>
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
