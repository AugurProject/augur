import React, { Component } from "react";
import classNames from "classnames";

import { SCALAR } from "modules/common/constants";
import MarketOutcomesListOutcome from "modules/market/containers/market-outcome";
import MarketScalarOutcomeDisplay from "modules/market/components/market-scalar-outcome-display/market-scalar-outcome-display";

import Styles from "modules/market/components/market-outcomes-list/market-outcomes-list.styles.less";
import SharedStyles from "modules/market/components/market-orders-positions-table/open-orders-table.style.less";
import HeaderStyles from "modules/portfolio/components/common/data-table-header.styles.less";
import { OutcomeFormatted } from "modules/types";

interface MarketOutcomesListProps {
  outcomesFormatted: OutcomeFormatted[];
  updateSelectedOutcome: Function;
  selectedOutcomeId: number;
  scalarDenomination: string | undefined;
  marketType: string;
  marketId: string;
  minPriceBigNumber: BigNumber;
  maxPriceBigNumber: BigNumber;
  popUp: boolean;
}

export default class MarketOutcomesList extends Component<MarketOutcomesListProps> {
  static defaultProps = {
    selectedOutcomeId: 2,
    scalarDenomination: null,
    marketType: null,
    outcomesFormatted: [],
    popUp: false,
  };

  render() {
    const {
      outcomesFormatted,
      selectedOutcomeId,
      updateSelectedOutcome,
      marketType,
      scalarDenomination,
      minPriceBigNumber,
      maxPriceBigNumber,
      popUp,
      marketId,
    } = this.props;

    return (
      <section className={Styles.OutcomesList}>
        {!popUp && (
          <h3 className={Styles.Heading}>Outcomes</h3>
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
          {outcomesFormatted.filter(o => o.isTradable).map(outcome => (
            <MarketOutcomesListOutcome
              key={outcome.id}
              marketId={marketId}
              outcome={outcome}
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
            outcomes={outcomesFormatted}
          />
        )}
      </section>
    );
  }
}
