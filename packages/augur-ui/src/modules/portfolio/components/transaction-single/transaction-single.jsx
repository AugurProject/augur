import React, { Component } from "react";
import PropTypes from "prop-types";

import TransactionHeader from "modules/portfolio/components/transaction-header/transaction-header";
import TransactionMeta from "modules/portfolio/containers/transaction-meta";
import ChevronFlip from "modules/common/components/chevron-flip/chevron-flip";

import toggleHeight from "utils/toggle-height/toggle-height";

import CommonStyles from "modules/portfolio/components/transactions/transactions.styles";
import ToggleHeightStyles from "utils/toggle-height/toggle-height.styles";

export default class TransactionSingle extends Component {
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
    const s = this.state;
    const { transaction } = this.props;

    return (
      <div className={CommonStyles.Transaction__item}>
        <button
          className={CommonStyles.Transaction__body}
          onClick={() => {
            toggleHeight(this.singleTransactionMeta, s.isOpen, () => {
              this.setState({ isOpen: !s.isOpen });
            });
          }}
        >
          <TransactionHeader transaction={transaction} />
          <ChevronFlip big pointDown={!s.isOpen} />
        </button>
        <div
          ref={singleTransactionMeta => {
            this.singleTransactionMeta = singleTransactionMeta;
          }}
          className={ToggleHeightStyles["toggle-height-target"]}
        >
          {transaction.transactions && (
            <TransactionMeta meta={transaction.transactions[0].meta} />
          )}
        </div>
      </div>
    );
  }
}
