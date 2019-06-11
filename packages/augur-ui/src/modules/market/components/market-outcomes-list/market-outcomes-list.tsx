import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import CustomPropTypes from "utils/custom-prop-types";
import { SCALAR } from "modules/common/constants";
import MarketOutcomesListOutcome from "modules/market/containers/market-outcome";
import MarketScalarOutcomeDisplay from "modules/market/components/market-scalar-outcome-display/market-scalar-outcome-display";

import Styles from "modules/market/components/market-outcomes-list/market-outcomes-list.styles";
import SharedStyles from "modules/market/components/market-orders-positions-table/open-orders-table.style";
import HeaderStyles from "modules/portfolio/components/common/data-table-header.styles";

export default class MarketOutcomesList extends Component {
  static propTypes = {
    marketId: PropTypes.string.isRequired,
    outcomes: PropTypes.array.isRequired,
    updateSelectedOutcome: PropTypes.func.isRequired,
    selectedOutcome: PropTypes.any,
    scalarDenomination: PropTypes.any,
    marketType: PropTypes.string,
    minPrice: CustomPropTypes.bigNumber,
    maxPrice: CustomPropTypes.bigNumber,
    popUp: PropTypes.bool
  };

  static defaultProps = {
    selectedOutcome: null,
    scalarDenomination: null,
    marketType: null,
    minPrice: null,
    maxPrice: null,
    popUp: false
  };

  render() {
    const {
      marketId,
      outcomes,
      selectedOutcome,
      updateSelectedOutcome,
      marketType,
      scalarDenomination,
      minPrice,
      maxPrice,
      popUp
    } = this.props;

    return (
      <section className={Styles.OutcomesList}>
        {!popUp && (
          <div className={Styles.Heading}>Outcomes</div>
        )}
        <div className={classNames(SharedStyles.Table, SharedStyles.Outcomes)}>
          <ul className={classNames(HeaderStyles.DataTableHeader, HeaderStyles.OutcomesHeader)}>
            <li>Outcome</li>
            <li>Bid Qty</li>
            <li>Best Bid</li>
            <li>Best Ask</li>
            <li>Ask Qty</li>
            <li>Last</li>
          </ul>
          {outcomes && outcomes.map(outcome => (
            <MarketOutcomesListOutcome
              key={outcome.id}
              outcome={outcome}
              marketId={marketId}
              selectedOutcome={selectedOutcome}
              updateSelectedOutcome={updateSelectedOutcome}
              marketType={marketType}
              scalarDenomination={
                marketType === SCALAR && scalarDenomination
              }
            />
          ))}
        </div>
        {marketType === SCALAR && (
          <MarketScalarOutcomeDisplay
            scalarDenomination={scalarDenomination}
            min={minPrice}
            max={maxPrice}
            outcomes={outcomes}
          />
        )}
      </section>
    );
  }
}
