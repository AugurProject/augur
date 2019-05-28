import React, { Component } from "react";
import PropTypes from "prop-types";

import Styles from "modules/market/components/market-outstanding-returns/market-outstanding-returns.styles";

export default class MarketPreview extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    collectMarketCreatorFees: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      unclaimedCreatorFees: "0"
    };
  }

  componentWillMount() {
    const { id, collectMarketCreatorFees } = this.props;

    collectMarketCreatorFees(id, (err, fees) => {
      this.setState({
        unclaimedCreatorFees: fees
      });
    });
  }

  render() {
    const { id } = this.props;
    const { unclaimedCreatorFees } = this.state;

    return (
      <div className={Styles.MarketOutstandingReturns}>
        <div className={Styles.MarketOutstandingReturns__text}>
          Outstanding Returns
          <span
            className={Styles.MarketOutstandingReturns__value}
            data-testid={"unclaimedCreatorFees-" + id}
          >
            {unclaimedCreatorFees}
          </span>
        </div>
        <div className={Styles.MarketOutstandingReturns__actions}>
          <button
            className={Styles.MarketOutstandingReturns__collect}
            onClick={() => {
              // TODO: fees are auto claimed on market finalization
            }}
          >
            Claim
          </button>
        </div>
      </div>
    );
  }
}
