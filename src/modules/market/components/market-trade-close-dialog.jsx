import React, { Component, PropTypes } from 'react';

import EmDash from 'modules/common/components/em-dash';

import { POSITION, ORDER } from 'modules/market/constants/trade-close-type';
import { CLOSE_DIALOG_CLOSING, CLOSE_DIALOG_FAILED, CLOSE_DIALOG_PARTIALLY_FAILED, CLOSE_DIALOG_SUCCESS } from 'modules/market/constants/trade-close-status';

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
  }

  render() {
    const p = this.props;
    const s = this.state;

    // Position -- No Available Actions
    if ((p.closeType === POSITION && !parseFloat(p.quantityOfShares, 10)) || !p.isClosable) {
      return <EmDash />;
    }

    if (s.isConfirming) {
      return (
        <span>
          <button
            className="unstyled no confirm"
            onClick={() => {
              this.setState({ isConfirming: false });
            }}
          >
            No
          </button>
          <button
            className="unstyled yes confirm"
            onClick={(event) => {
              if (p.closeType === POSITION) {
                p.closePosition(p.marketID, p.outcomeID);
              } else if (p.closeType === ORDER) {
                // TODO -- merge cancel order functionality in
              }
              this.setState({ isConfirming: false });
            }}
          >
            Yes
          </button>
        </span>
      );
    }

    switch (p.status) {
      case CLOSE_DIALOG_CLOSING:
        return (
          <span>closing</span>
        );
      case CLOSE_DIALOG_FAILED:
        return (
          <span>failed</span>
        );
      case CLOSE_DIALOG_PARTIALLY_FAILED:
        return (
          <span>partially failed</span>
        );
      case CLOSE_DIALOG_SUCCESS:
        return (
          <span>success</span>
        );
      default:
        return (
          <button
            className="unstyled cancel"
            onClick={() => {
              this.setState({ isConfirming: true });
            }}
          >
            {p.closeType === POSITION ?
              <span>{p.isFullyClosable ? 'close' : 'minimize'}</span>
              : 'cancel'
            }
          </button>
        );
    }
  }
}
