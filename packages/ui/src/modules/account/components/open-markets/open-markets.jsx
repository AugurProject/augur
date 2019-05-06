import React, { Component } from "react";
import PropTypes from "prop-types";

import FilterSwitchBox from "modules/portfolio/components/common/quads/filter-switch-box";
import MarketRow from "modules/portfolio/components/common/rows/market-row";
import { MovementLabel } from "modules/common-elements/labels";

import Styles from "modules/account/components/open-markets/open-markets.styles";

function filterComp(input, market) {
  return market.description.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

export default class OpenMarkets extends Component {
  static propTypes = {
    markets: PropTypes.array.isRequired,
    marketsObj: PropTypes.object.isRequired,
    totalPercentage: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.renderRows = this.renderRows.bind(this);
  }

  renderRows(market) {
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
            size="medium"
          />
        }
        toggleContent={
          <div className={Styles.OpenMarkets__expandedContent}>
            {marketsObj[market.id].userPositions.map(position => (
              <div key={position.outcomeId}>
                <span>{position.outcomeName}</span>
                <MovementLabel
                  showColors
                  showPercent
                  showBrackets
                  showIcon
                  showPlusMinus
                  value={position.valueChange.formatted}
                  size="small"
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
                value={totalPercentage}
                size="large"
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
