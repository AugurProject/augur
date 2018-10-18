/* eslint-disable jsx-a11y/no-static-element-interactions */ // needed because <button> cannot take the place <ul> in the table structure

import PropTypes from "prop-types";
import React, { Component } from "react";
import classNames from "classnames";

import getValue from "utils/get-value";
import { SELL } from "modules/trades/constants/types";

import Styles from "modules/market/components/market-positions-list--order/market-positions-list--order.styles";

export default class Order extends Component {
  static propTypes = {
    isExtendedDisplay: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    outcomeName: PropTypes.string.isRequired,
    order: PropTypes.shape({
      type: PropTypes.string.isRequired,
      orderCancellationStatus: PropTypes.string,
      avgPrice: PropTypes.object,
      unmatchedShares: PropTypes.object,
      tokensEscrowed: PropTypes.object,
      sharesEscrowed: PropTypes.object,
      cancelOrder: PropTypes.func.isRequired
    }).isRequired,
    pending: PropTypes.bool.isRequired,
    outcome: PropTypes.object
  };

  static defaultProps = {
    outcome: null
  };

  constructor(props) {
    super(props);

    this.state = {
      showConfirm: false,
      confirmHeight: "auto",
      confirmMargin: "0px"
    };

    this.orderStatusText = {
      CLOSE_DIALOG_CLOSING: "",
      CLOSE_DIALOG_FAILED: "Failed to Cancel Order",
      CLOSE_DIALOG_PENDING: "Cancellation Pending"
    };

    this.toggleConfirm = this.toggleConfirm.bind(this);
  }

  toggleConfirm() {
    let { confirmHeight, confirmMargin } = this.state;

    if (!this.state.showConfirm) {
      confirmHeight = `${this.order.clientHeight}px`;
    }

    if (this.order.offsetTop !== this.confirmMessage.offsetTop) {
      confirmMargin = `${this.order.offsetTop -
        this.confirmMessage.offsetTop}px`;
    }

    this.setState({
      confirmHeight,
      confirmMargin,
      showConfirm: !this.state.showConfirm
    });
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
    const s = this.state;
    const orderPrice = getValue(order, "avgPrice.formatted");
    const orderShares = getValue(order, "unmatchedShares.formatted");
    const orderType = getValue(order, "type");
    const confirmStyle = {
      height: s.confirmHeight,
      marginTop: s.confirmMargin
    };

    return (
      <ul
        ref={order => {
          this.order = order;
        }}
        className={
          !isMobile
            ? classNames(Styles.Order, {
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
          {orderType === SELL ? <span>-</span> : <span>+</span>} {orderShares}
        </li>
        <li>{orderPrice}</li>
        {isExtendedDisplay &&
          !isMobile &&
          outcome && <li>{getValue(outcome, "lastPrice.formatted")}</li>}
        {!isMobile && <li>{getValue(order, "tokensEscrowed.formatted")}</li>}
        {!isMobile && <li>{getValue(order, "sharesEscrowed.formatted")}</li>}
        {isExtendedDisplay && <li />}
        <li>
          {pending ? (
            <button className={Styles.Order__cancel} disabled>
              Cancel
            </button>
          ) : (
            <button
              className={Styles.Order__cancel}
              onClick={this.toggleConfirm}
            >
              Cancel
            </button>
          )}
        </li>
        <div
          ref={confirmMessage => {
            this.confirmMessage = confirmMessage;
          }}
          className={classNames(Styles.Order__confirm, {
            [`${Styles["is-open"]}`]: s.showConfirm
          })}
          style={confirmStyle}
        >
          {pending ? (
            <div className={Styles["Order__confirm-details"]}>
              <p>Orders cannot be closed while they are pending.</p>
              <div className={Styles["Order__confirm-options"]}>
                <button onClick={this.toggleConfirm}>Ok</button>
              </div>
            </div>
          ) : (
            <div className={Styles["Order__confirm-details"]}>
              <p>{`Cancel order to ${orderType} ${orderShares} shares ${
                outcomeName ? `of "${outcomeName}"` : ""
              } at ${orderPrice} ETH?`}</p>
              <div className={Styles["Order__confirm-options"]}>
                <button
                  onClick={e => {
                    order.cancelOrder(order);
                    this.toggleConfirm();
                  }}
                >
                  Yes
                </button>
                <button onClick={this.toggleConfirm}>No</button>
              </div>
            </div>
          )}
        </div>
      </ul>
    );
  }
}
