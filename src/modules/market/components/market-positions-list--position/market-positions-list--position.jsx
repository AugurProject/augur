/* eslint-disable jsx-a11y/no-static-element-interactions */ // needed because <button> cannot take the place <ul> in the table structure
/* eslint-disable react/no-array-index-key */

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import getValue from "utils/get-value";
import Styles from "modules/market/components/market-positions-list--position/market-positions-list--position.styles";
import MarketOutcomeTradingIndicator from "modules/market/containers/market-outcome-trading-indicator";

export default class MarketPositionsListPosition extends Component {
  static propTypes = {
    outcomeName: PropTypes.string.isRequired,
    position: PropTypes.shape({
      netPosition: PropTypes.object,
      qtyShares: PropTypes.object,
      purchasePrice: PropTypes.object,
      unrealizedNet: PropTypes.object,
      realizedNet: PropTypes.object,
      totalNet: PropTypes.object
    }).isRequired,
    isExtendedDisplay: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    outcome: PropTypes.object,
    hasOrders: PropTypes.bool
  };

  static defaultProps = {
    hasOrders: false,
    outcome: null
  };

  static calcAvgDiff(position, order) {
    const positionAvg = getValue(position, "avgPrice.formattedValue") || 0;
    const positionShares = getValue(position, "qtyShares.formattedValue") || 0;

    const orderPrice = getValue(order, "purchasePrice.formattedValue") || 0;
    const orderShares = getValue(order, "qtyShares.formattedValue") || 0;

    const newAvg =
      (positionAvg * positionShares + orderPrice * orderShares) /
      (positionShares + orderShares);
    const avgDiff = (newAvg - positionAvg).toFixed(4);

    return avgDiff < 0 ? avgDiff : `+${avgDiff}`;
  }

  render() {
    const {
      isExtendedDisplay,
      isMobile,
      outcomeName,
      position,
      outcome,
      hasOrders
    } = this.props;

    const netPositionShares = getValue(position, "netPosition.formatted");
    const positionShares = getValue(position, "qtyShares.formatted");

    return (
      <ul
        ref={position => {
          this.position = position;
        }}
        className={
          !isMobile
            ? classNames(Styles.Position, {
                [Styles["Position-not_extended"]]: isExtendedDisplay
              })
            : Styles.PortMobile
        }
      >
        <li>{outcomeName || getValue(position, "purchasePrice.formatted")}</li>
        {hasOrders && <li />}
        <li>{netPositionShares}</li>
        <li>{positionShares}</li>
        <li>{getValue(position, "purchasePrice.formatted")}</li>
        {!isMobile &&
          isExtendedDisplay && (
            <li>
              {getValue(outcome, "lastPrice.formatted")}
              <MarketOutcomeTradingIndicator
                outcome={outcome}
                location="positions"
              />
            </li>
          )}
        {!isMobile && <li>{getValue(position, "unrealizedNet.formatted")} </li>}
        {!isMobile && <li>{getValue(position, "realizedNet.formatted")} </li>}
        {isExtendedDisplay && (
          <li>{getValue(position, "totalNet.formatted")}</li>
        )}
      </ul>
    );
  }
}
