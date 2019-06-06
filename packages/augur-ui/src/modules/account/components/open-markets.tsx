import React, { Component } from "react";

import FilterSwitchBox from "modules/portfolio/components/common/quads/filter-switch-box";
import MarketRow from "modules/portfolio/components/common/rows/market-row";
import { MovementLabel } from "modules/common/labels";
import { SizeTypes } from "modules/types";

import Styles from "modules/account/components/open-markets.styles.less";

function filterComp(input: any, market: any) {
  return market.description.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

interface OpenMarketsProps {
  markets: Array<any>;
  marketsObj: object;
  totalPercentage: string;
}

export default class OpenMarkets extends Component<OpenMarketsProps> {
  constructor(props: OpenMarketsProps) {
    super(props);

    this.renderRows = this.renderRows.bind(this);
  }

  renderRows(market: any) {
    const { marketsObj } = this.props;

    return (
      <MarketRow
        key={"position_" + market.id}
        market={marketsObj[market.id]}
        showState={false}
        rightContent={
          <MovementLabel
            showColors
            showBrackets
            showPercent
            showIcon
            showPlusMinus
            value={
              marketsObj[market.id].myPositionsSummary.valueChange.formatted
            }
            size={SizeTypes.NORMAL}
          />
        }
        toggleContent={
          <div className={Styles.OpenMarkets__expandedContent}>
            {marketsObj[market.id].userPositions.map((position: any) => (
              <div key={position.outcomeId}>
                <span>{position.outcomeName}</span>
                <MovementLabel
                  showColors
                  showPercent
                  showBrackets
                  showIcon
                  showPlusMinus
                  value={position.valueChange.formatted}
                  size={SizeTypes.SMALL}
                />
              </div>
            ))}
          </div>
        }
      />
    );
  }

  render() {
    const { markets, totalPercentage } = this.props;

    return (
      <FilterSwitchBox
        filterLabel="markets"
        title="My Active Markets"
        showFilterSearch
        data={markets}
        filterComp={filterComp}
        noBackgroundBottom
        bottomBarContent={
          <div className={Styles.OpenMarkets__bottomBar}>
            <div>
              <span>24hr</span>
              <MovementLabel
                showColors
                showPercent
                showIcon
                showPlusMinus
                value={Number(totalPercentage)}
                size={SizeTypes.LARGE}
              />
            </div>
          </div>
        }
        noSwitch
        renderRows={this.renderRows}
      />
    );
  }
}
