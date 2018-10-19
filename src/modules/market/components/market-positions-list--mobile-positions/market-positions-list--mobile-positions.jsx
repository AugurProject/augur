import React, { Component } from "react";
import PropTypes from "prop-types";
import { createBigNumber } from "utils/create-big-number";

import getValue from "utils/get-value";

import Styles from "modules/market/components/market-positions-list--mobile-positions/market-positions-list--mobile-positions.styles";
import CommonStyles from "modules/market/components/market-positions-list--mobile/market-positions-list--mobile.styles";

export default class MobilePositions extends Component {
  static propTypes = {
    position: PropTypes.shape({
      qtyShares: PropTypes.object,
      avgPrice: PropTypes.object,
      unrealizedNet: PropTypes.object,
      realizedNet: PropTypes.object,
      purchasePrice: PropTypes.object
    }),
    pendingOrders: PropTypes.arrayOf(
      PropTypes.shape({
        purchasePrice: PropTypes.object,
        qtyShares: PropTypes.object
      })
    )
  };

  static defaultProps = {
    position: {},
    pendingOrders: []
  };

  static calcAvgDiff(position, orders) {
    const currentAvg = createBigNumber(
      getValue(position, "purchasePrice.formattedValue") || 0
    );
    const currentShares = createBigNumber(
      getValue(position, "qtyShares.formattedValue") || 0
    );

    const newAvg = currentAvg.times(currentShares);
    const totalShares = currentShares;

    orders.forEach(order => {
      const thisPrice = createBigNumber(
        getValue(order, "purchasePrice.formattedValue") || 0
      );
      const thisShares = createBigNumber(
        getValue(order, "qtyShares.formattedValue") || 0
      );

      newAvg.plus(thisPrice.times(thisShares));
      totalShares.plus(thisShares);
    });

    newAvg.dividedBy(totalShares);
    const avgDiff = newAvg.minus(currentAvg).toFixed(4);

    return avgDiff < 0 ? avgDiff : `+${avgDiff}`;
  }

  render() {
    const { pendingOrders, position } = this.props;
    const orderText = pendingOrders.length > 1 ? "Orders" : "Order";

    return (
      <div className={CommonStyles.MarketPositionsListMobile__wrapper}>
        <div className={Styles.MobilePositions__header}>
          <h2 className={CommonStyles.MarketPositionsListMobile__heading}>
            My Position
            {pendingOrders.length > 0 && (
              <span className={Styles.MobilePositions__pending}>
                {pendingOrders.length} Pending {orderText}
              </span>
            )}
          </h2>
        </div>
        <div className={Styles.MobilePositions__positions}>
          <ul className={Styles.MobilePositions__position}>
            <li>
              <span>
                QTY
                {pendingOrders.length > 0 && (
                  <span className={Styles.MobilePositions__pending}>
                    +
                    {pendingOrders.reduce(
                      (sum, order) => sum + +order.qtyShares.formatted,
                      0
                    )}
                  </span>
                )}
              </span>
              {getValue(position, "qtyShares.formatted")}
            </li>
            <li>
              <span>
                AVG Price
                {pendingOrders.length > 0 && (
                  <span className={Styles.MobilePositions__pending}>
                    {MobilePositions.calcAvgDiff(position, pendingOrders)}
                  </span>
                )}
              </span>
              {getValue(position, "avgPrice.formatted")} ETH
            </li>
            <li>
              <span>Unrealized P/L</span>
              {getValue(position, "unrealizedNet.formatted")} ETH
            </li>
            <li>
              <span>Realized P/L</span>
              {getValue(position, "realizedNet.formatted")} ETH
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
