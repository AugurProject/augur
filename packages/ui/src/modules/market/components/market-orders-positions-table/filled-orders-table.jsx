/* eslint react/no-array-index-key: 0 */

import React from "react";
import PropTypes from "prop-types";
import Media from "react-media";

import FilledOrder from "modules/portfolio/components/common/rows/filled-order";
import FilledOrdersHeader from "modules/portfolio/components/common/headers/filled-orders-header";
import { SMALL_MOBILE } from "modules/common-elements/constants";

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
              <Media key={i} query={SMALL_MOBILE}>
                {matches =>
                  matches ? (
                    <FilledOrder filledOrder={order} extendedView={false} />
                  ) : (
                    <FilledOrder filledOrder={order} extendedView />
                  )
                }
              </Media>
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
