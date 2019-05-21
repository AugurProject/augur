/* eslint react/no-array-index-key: 0 */

import React from "react";
import PropTypes from "prop-types";
import Media from "react-media";

import OpenOrder from "modules/portfolio/containers/open-order";
import OpenOrdersHeader from "modules/portfolio/components/common/headers/open-orders-header";
import { SMALL_MOBILE } from "modules/common-elements/constants";

import Styles from "modules/market/components/market-orders-positions-table/open-orders-table.style";

const OpenOrdersTable = ({ openOrders }) => (
  <div>
    <div className={Styles.MarketOpenOrdersList__table}>
      <OpenOrdersHeader extendedView />
      <div className={Styles.MarketOpenOrdersList__scrollContainer}>
        {openOrders.length > 0 && (
          <div className={Styles["MarketOpenOrdersList__table-body"]}>
            {openOrders.map((order, i) => (
              <Media key={"openOrder_" + i} query={SMALL_MOBILE}>
                {matches =>
                  matches ? (
                    <OpenOrder openOrder={order} extendedView={false} />
                  ) : (
                    <OpenOrder openOrder={order} extendedView />
                  )
                }
              </Media>
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
