import PropTypes from "prop-types";
import React, { Component } from "react";
import classNames from "classnames";

import OpenOrder from "modules/portfolio/containers/open-order";
import { darkBgExclamationCircle } from "modules/common/components/icons";

import Styles from "modules/market/components/market-positions-table--orphaned-order/market-positions-table--orphaned-order.styles";

export default class OrphanedOrder extends Component {
  static propTypes = {
    order: PropTypes.object.isRequired,
    cancelOrphanedOrder: PropTypes.func.isRequired,
    isMobile: PropTypes.bool
  };

  static defaultProps = {
    isMobile: false
  };

  constructor(props) {
    super(props);

    this.state = {
      disableCancel: false
    };

    this.cancelOrder = this.cancelOrder.bind(this);
  }

  cancelOrder() {
    this.setState({ disableCancel: true });
    this.props.cancelOrphanedOrder(this.props.order, () => {
      this.setState({ disableCancel: false });
    });
  }

  render() {
    const { order, isMobile } = this.props;
    order.pending = this.state.disableCancel;
    order.cancelOrder = this.cancelOrder;

    return (
      <div
        ref={order => {
          this.order = order;
        }}
        className={Styles.OrphanedOrder}
      >
        <OpenOrder
          openOrder={order}
          extendedView={!isMobile}
          isSingle={isMobile}
        />
        <div className={classNames(Styles.Order__learnMore)}>
          <div>
            {darkBgExclamationCircle}
            <span>This is an orphaned order. Please cancel it. </span>
          </div>
          <span className={Styles.Order__link}>
            <a
              href="http://docs.augur.net/#orphaned-order"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn More
            </a>
          </span>
        </div>
      </div>
    );
  }
}
