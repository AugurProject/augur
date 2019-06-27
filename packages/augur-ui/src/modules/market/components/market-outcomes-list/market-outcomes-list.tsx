import React, { Component } from "react";
import classNames from "classnames";

import { SCALAR } from "modules/common/constants";
import MarketOutcomesListOutcome from "modules/market/containers/market-outcome";
import MarketScalarOutcomeDisplay from "modules/market/components/market-scalar-outcome-display/market-scalar-outcome-display";

import Styles from "modules/market/components/market-outcomes-list/market-outcomes-list.styles.less";
import SharedStyles from "modules/market/components/market-orders-positions-table/open-orders-table.style.less";
import HeaderStyles from "modules/portfolio/components/common/data-table-header.styles.less";
import { MarketOutcome } from "modules/types";

interface MarketOutcomesListProps {
  marketId: string,
  marketOutcomes: Array<MarketOutcome>,
  updateSelectedOutcome: Function,
  selectedOutcomeId: number,
  scalarDenomination: string | undefined,
  marketType: string,
  minPriceBigNumber: BigNumber,
  maxPriceBigNumber: BigNumber,
  popUp: boolean,
};

export default class MarketOutcomesList extends Component<MarketOutcomesListProps> {
  static defaultProps = {
    selectedOutcomeId: 2,
    scalarDenomination: null,
    marketType: null,
    marketOutcomes: [],
    popUp: false
  };

  render() {
    const {
      marketId,
      marketOutcomes,
      selectedOutcomeId,
      updateSelectedOutcome,
      marketType,
      scalarDenomination,
      minPriceBigNumber,
      maxPriceBigNumber,
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
          {marketOutcomes.filter(o => o.isTradable).map(outcome => (
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
            min={minPriceBigNumber}
            max={maxPriceBigNumber}
            outcomes={marketOutcomes}
          />
        )}
      </section>
    );
  }
}
