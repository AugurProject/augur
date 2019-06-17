import React, { Component } from "react";
import classNames from "classnames";

import { SCALAR } from "modules/common/constants";
import MarketOutcomesListOutcome from "modules/market/containers/market-outcome";
import MarketScalarOutcomeDisplay from "modules/market/components/market-scalar-outcome-display/market-scalar-outcome-display";

import Styles from "modules/market/components/market-outcomes-list/market-outcomes-list.styles.less";
import SharedStyles from "modules/market/components/market-orders-positions-table/open-orders-table.style.less";
import HeaderStyles from "modules/portfolio/components/common/data-table-header.styles.less";
import { MarketInfoOutcome } from "@augurproject/sdk/build/state/getter/Markets";

interface MarketOutcomesListProps {
  marketId: string,
  outcomes: Array<MarketInfoOutcome>,
  updateSelectedOutcome: Function,
  selectedOutcomeId?: string,
  scalarDenomination: string | undefined,
  marketType: string,
  minPrice: BigNumber,
  maxPrice: BigNumber,
  popUp: boolean,
};

export default class MarketOutcomesList extends Component<MarketOutcomesListProps> {
  static defaultProps = {
    selectedOutcomeId: "1",
    scalarDenomination: null,
    marketType: null,
    outcomes: [],
    minPrice: null,
    maxPrice: null,
    popUp: false
  };

  render() {
    const {
      marketId,
      outcomes,
      selectedOutcomeId,
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
              selectedOutcomeId={selectedOutcomeId}
              updateSelectedOutcome={updateSelectedOutcome}
              marketType={marketType}
              scalarDenomination={
                marketType === SCALAR && scalarDenomination
              }
            />
          ))
          }
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
