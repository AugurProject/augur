/* eslint-disable jsx-a11y/no-static-element-interactions */ // needed because <button> cannot take the place <ul> in the table structure

import PropTypes from "prop-types";
import React, { Component } from "react";
import classNames from "classnames";

import getValue from "utils/get-value";
import { SELL } from "modules/trades/constants/types";

import OrphanedStyles from "modules/market/components/market-positions-list--orphaned-order/market-positions-list--orphaned-order.styles";
import Styles from "modules/market/components/market-positions-list--order/market-positions-list--order.styles";
import { formatEther, formatShares } from "utils/format-number";

export default class OrphanedOrder extends Component {
  static propTypes = {
    isExtendedDisplay: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool,
    outcomeName: PropTypes.string,
    order: PropTypes.object.isRequired,
    pending: PropTypes.bool.isRequired,
    outcome: PropTypes.object.isRequired,
    cancelOrphanedOrder: PropTypes.func.isRequired
  };

  static defaultProps = {
    outcomeName: null,
    isMobile: false
  };

  constructor(props) {
    super(props);

    this.cancelOrder = this.cancelOrder.bind(this);
  }

  cancelOrder() {
    this.props.cancelOrphanedOrder(this.props.order);
  }

  render() {
    const {
      isExtendedDisplay,
      isMobile,
      outcomeName,
      order,
      pending,
      outcome
    } = this.props;
    const { orderCancellationStatus } = order;
    const orderPrice = formatEther(getValue(order, "fullPrecisionPrice"))
      .formatted;
    const orderShares = formatShares(getValue(order, "amount")).formatted;

    return (
      <ul
        ref={order => {
          this.order = order;
        }}
        className={
          !isMobile
            ? classNames(Styles.Order, OrphanedStyles.Order, {
                [Styles["Order-not_extended"]]: isExtendedDisplay
              })
            : Styles.PortMobile
        }
      >
        <li>
          {outcomeName || orderPrice}
          {pending && (
            <span className={Styles.Order__pending}>
              <span>{`${this.orderStatusText[orderCancellationStatus]}`}</span>
            </span>
          )}
        </li>
        <li />
        <li>
          {order.type === SELL ? <span>-</span> : <span>+</span>} {orderShares}
        </li>
        <li>{orderPrice}</li>
        {isExtendedDisplay && !isMobile && outcome && <li />}
        {!isMobile && <li />}
        {!isMobile && <li />}
        {isExtendedDisplay && <li />}
        <li>
          {pending ? (
            <span className={Styles.NotActive}>Cancel</span>
          ) : (
            <button
              className={OrphanedStyles.Order__cancel}
              onClick={this.cancelOrder}
            >
              Cancel
            </button>
          )}
        </li>
        <div
          className={classNames(OrphanedStyles.Order__learnMore, {
            [OrphanedStyles["Order__learnMore-extended"]]: !isExtendedDisplay
          })}
        >
          This is an orphaned order. Please cancel it.{" "}
          <span className={OrphanedStyles.Order__link}>
            <a
              href="http://docs.augur.net/#orphaned-order"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More
            </a>
          </span>
        </div>
      </ul>
    );
  }
}
