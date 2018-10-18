import PropTypes from "prop-types";
import React, { Component } from "react";

import TransactionMeta from "modules/portfolio/containers/transaction-meta";
import ChevronFlip from "modules/common/components/chevron-flip/chevron-flip";

import toggleHeight from "utils/toggle-height/toggle-height";

import Styles from "modules/portfolio/components/transaction-linked/transaction-linked.styles";
import ToggleHeightStyles from "utils/toggle-height/toggle-height.styles";

export default class LinkedTransaction extends Component {
  static propTypes = {
    transaction: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  render() {
    const { transaction } = this.props;
    const s = this.state;

    return (
      <div>
        <button
          className={Styles.LinkedTransaction__message}
          onClick={() => {
            toggleHeight(this.metaWrapper, s.isOpen, () => {
              this.setState({ isOpen: !s.isOpen });
            });
          }}
        >
          <div>
            {transaction.open && (
              <h5 className={Styles.LinkedTransaction__status}>Open Order</h5>
            )}
            <span className={Styles["LinkedTransaction__message-text"]}>
              {transaction.message}
              {transaction.meta &&
                transaction.meta.canceledTransactionHash && (
                  <span
                    className={Styles["LinkedTransaction__message-canceled"]}
                  >
                    Canceled
                  </span>
                )}
            </span>
          </div>
          <ChevronFlip big pointDown={!s.isOpen} />
        </button>
        <div
          ref={metaWrapper => {
            this.metaWrapper = metaWrapper;
          }}
          className={ToggleHeightStyles["toggle-height-target"]}
        >
          <TransactionMeta meta={transaction.meta} />
        </div>
      </div>
    );
  }
}
