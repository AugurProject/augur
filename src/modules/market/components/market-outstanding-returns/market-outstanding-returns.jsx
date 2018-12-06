import React, { Component } from "react";
import PropTypes from "prop-types";

import Styles from "modules/market/components/market-outstanding-returns/market-outstanding-returns.styles";

export default class MarketPreview extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    unclaimedCreatorFees: PropTypes.object.isRequired,
    collectMarketCreatorFees: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      disableClaim: false
    };
  }

  render() {
    const { id, unclaimedCreatorFees, collectMarketCreatorFees } = this.props;

    return (
      <div className={Styles.MarketOutstandingReturns}>
        <div className={Styles.MarketOutstandingReturns__text}>
          Outstanding Returns
          <span
            className={Styles.MarketOutstandingReturns__value}
            data-testid={"unclaimedCreatorFees-" + id}
          >
            {unclaimedCreatorFees.full}
          </span>
        </div>
        <div className={Styles.MarketOutstandingReturns__actions}>
          <button
            className={Styles.MarketOutstandingReturns__collect}
            data-testid={"collectMarketCreatorFees-" + id}
            disabled={this.state.disableClaim}
            onClick={() => {
              this.setState({ disableClaim: true });
              collectMarketCreatorFees(false, id, err => {
                if (err) {
                  this.setState({ disableClaim: false });
                }
              });
            }}
          >
            Claim
          </button>
        </div>
      </div>
    );
  }
}
