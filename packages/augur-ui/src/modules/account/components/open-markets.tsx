import React, { Component } from "react";

import FilterSwitchBox from "modules/portfolio/components/common/filter-switch-box";
import MarketRow from "modules/portfolio/containers/market-row";
import { MovementLabel } from "modules/common/labels";
import { SizeTypes, FormattedNumber } from "modules/types";

import Styles from "modules/account/components/open-markets.styles.less";

function filterComp(input: any, market: any) {
  return market && market.description ? market.description.toLowerCase().indexOf(input.toLowerCase()) >= 0 : true;
}

interface OpenMarketsProps {
  markets: Array<any>;
  marketsObj: object;
  totalPercentage: FormattedNumber;
  toggle: Function;
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
        addedClass={Styles.OpenMarketsRow}
        rightContent={
          <MovementLabel
            showBrackets
            useFull
            showIcon
            showPlusMinus
            value={
              marketsObj[market.id].myPositionsSummary.valueChange
            }
            size={SizeTypes.LARGE}
          />
        }
        toggleContent={
          <div className={Styles.ExpandedContent}>
            {marketsObj[market.id].userPositions.map((position: any) => (
              <div key={position.outcomeId}>
                <span>{position.outcomeName}</span>
                <MovementLabel
                  showBrackets
                  useFull
                  showIcon
                  showPlusMinus
                  value={position.unrealizedPercent}
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
    const { markets, totalPercentage, toggle} = this.props;

    return (
      <FilterSwitchBox
        filterLabel="markets"
        title="My Active Markets"
        showFilterSearch
        data={markets}
        customClass={Styles.OpenMarkets}
        filterComp={filterComp}
        noBackgroundBottom
        toggle={toggle}
        bottomBarContent={
          <div className={Styles.BottomBar}>
            <span>24hr</span>
            <MovementLabel
              showIcon
              showBrackets
              showPlusMinus
              value={totalPercentage}
              useFull
              size={SizeTypes.SMALL}
            />
          </div>
        }
        noSwitch
        renderRows={this.renderRows}
      />
    );
  }
}
