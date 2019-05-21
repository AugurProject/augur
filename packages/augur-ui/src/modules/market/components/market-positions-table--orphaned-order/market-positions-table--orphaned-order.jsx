import PropTypes from "prop-types";
import React, { Component } from "react";
import classNames from "classnames";
import Media from "react-media";

import OpenOrder from "modules/portfolio/containers/open-order";
import { darkBgExclamationCircle } from "modules/common/components/icons";
import { SMALL_MOBILE } from "modules/common-elements/constants";

import Styles from "modules/market/components/market-positions-table--orphaned-order/market-positions-table--orphaned-order.styles";

export default class OrphanedOrder extends Component {
  static propTypes = {
    order: PropTypes.object.isRequired,
    cancelOrphanedOrder: PropTypes.func.isRequired,
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
    const { order } = this.props;
    order.pending = this.state.disableCancel;
    order.cancelOrder = this.cancelOrder;

    return (
      <div
        ref={order => {
          this.order = order;
        }}
        className={Styles.OrphanedOrder}
      >
        <Media key={"orphanedOrder"} query={SMALL_MOBILE}>
          {matches =>
            matches ? (
              <OpenOrder openOrder={order} isSingle extendedView={false} />
            ) : (
              <OpenOrder openOrder={order} extendedView />
            )
          }
        </Media>
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
