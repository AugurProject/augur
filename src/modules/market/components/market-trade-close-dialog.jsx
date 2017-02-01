import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import EmDash from 'modules/common/components/em-dash';

import { POSITION, ORDER } from 'modules/market/constants/trade-close-type';
import { CLOSE_DIALOG_CLOSING, CLOSE_DIALOG_FAILED, CLOSE_DIALOG_PARTIALLY_FAILED, CLOSE_DIALOG_SUCCESS } from 'modules/market/constants/close-dialog-status';

export default class MarketTradeCloseDialog extends Component {
  static propTypes = {
    status: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      isConfirming: false,
      status: props.status
    };

    this.renderCloseDialogContent = this.renderCloseDialogContent.bind(this);
  }

  renderCloseDialogContent(marketID, orderID, closeType, isClosable, isFullyClosable, quantityOfShares, isConfirming, closePosition, status, orderType, cancelOrder, isTradeCommitLocked) {
    // Position -- No Available Actions
    if (closeType === POSITION && !status && (!parseFloat(quantityOfShares, 10) || !isClosable)) {
      return <EmDash />;
    }

    if (isConfirming) {
      return (
        <div className="confirming-dialog">
          <button
            className="unstyled confirming-no"
            onClick={() => {
              this.setState({ isConfirming: false });
            }}
          >
            No
          </button>
          <button
            className="unstyled confirming-yes"
            onClick={(event) => {
              if (closeType === POSITION) {
                closePosition(marketID, orderID);
              } else if (closeType === ORDER) {
                cancelOrder(orderID, marketID, orderType);
              }
              this.setState({ isConfirming: false });
            }}
          >
            Yes
          </button>
        </div>
      );
    }

    switch (status) {
      case CLOSE_DIALOG_CLOSING:
        return <span>closing</span>;
      case CLOSE_DIALOG_FAILED:
        return <span>failed</span>;
      case CLOSE_DIALOG_PARTIALLY_FAILED:
        return <span>partially failed</span>;
      case CLOSE_DIALOG_SUCCESS:
        return <span>success</span>;
      default:
        return (
          <button
            className="unstyled close-order-button"
            onClick={() => {
              if (!isTradeCommitLocked) {
                this.setState({ isConfirming: true });
              }
            }}
          >
            {closeType === POSITION ?
              <span>{isFullyClosable ? 'close' : 'minimize'}</span> :
              'cancel'
            }
          </button>
        );
    }
  }

  render() {
    const p = this.props;
    const s = this.state;

    const orderID = p.closeType === POSITION ? p.outcomeID : p.orderID;

    return (
      <article
        className={
          classNames(
            'close-dialog', {
              'action-disabled': p.isTradeCommitLocked && p.closeType === POSITION,
              'action-running': p.status === CLOSE_DIALOG_CLOSING,
              'action-failed': p.status === CLOSE_DIALOG_FAILED || p.status === CLOSE_DIALOG_PARTIALLY_FAILED,
              'action-succeeded': p.status === CLOSE_DIALOG_SUCCESS
            }
          )
        }
      >
        {
          this.renderCloseDialogContent(
            p.marketID,
            orderID,
            p.closeType,
            p.isClosable,
            p.isFullyClosable,
            p.quantityOfShares,
            s.isConfirming,
            p.closePosition,
            p.status,
            p.orderType,
            p.cancelOrder,
            p.isTradeCommitLocked
          )
        }
      </article>
    );
  }
}
