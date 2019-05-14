import React from "react";
import Media from "react-media";

import PositionsHeader from "modules/portfolio/components/common/headers/positions-header";
import PositionRow from "modules/portfolio/containers/position-row";
import { Position } from "modules/portfolio/types";
import classNames from "classnames";
import CompleteSets from "modules/market/components/complete-sets/complete-sets";
import { SMALL_MOBILE } from "modules/common-elements/constants";

import SharedStyles from "modules/market/components/market-orders-positions-table/open-orders-table.style";
import Styles from "modules/portfolio/components/common/tables/market-positions-table.styles";

export interface MarketPositionsTableProps {
  positions: Array<Position>;
  numCompleteSets: any;
  transactionsStatus: any;
  sellCompleteSets: Function;
  extendedView: Boolean;
}

export interface MarketPositionsTableState {
  showPercent: boolean;
}

export class MarketPositionsTable extends React.Component<
  MarketPositionsTableProps,
  MarketPositionsTableState
> {
  state: MarketPositionsTableState = {
    showPercent: true
  };

  updateShowPercent = () => {
    this.setState({ showPercent: !this.state.showPercent });
  };

  render() {
    const {
      positions,
      numCompleteSets,
      transactionsStatus,
      sellCompleteSets,
      marketId,
      extendedView
    } = this.props;
    const { showPercent } = this.state;

    return (
      <div
        className={classNames(Styles.MarketPositionsTable, {
          [SharedStyles.MarketOpenOrdersList__table]: extendedView
        })}
      >
        <PositionsHeader
          showPercent={showPercent}
          updateShowPercent={this.updateShowPercent}
          extendedView={extendedView}
        />
        <div
          className={classNames({
            [SharedStyles.MarketOpenOrdersList__scrollContainer]: extendedView
          })}
        >
          {positions.map((position: Position, index: number) => (
            <Media query={SMALL_MOBILE}>
              {matches =>
                matches ? (
                <PositionRow
                  key={"positionRow_" + position.marketId + position.outcomeId}
                  position={position}
                  showPercent={showPercent}
                  extendedView={extendedView}
                  isSingle={extendedView}
                  showExpandedToggle
                  isFirst={index === 0}
                /> ) : (
                <PositionRow
                  key={"positionRow_" + position.marketId + position.outcomeId}
                  position={position}
                  showPercent={showPercent}
                  extendedView={extendedView}
                  isSingle={extendedView}
                  isFirst={index === 0}
                /> )
              }
            </Media>
          ))}
        </div>
        {extendedView &&
          positions.length === 0 && (
            <div className={SharedStyles.MarketOpenOrdersList__empty} />
          )}
        {extendedView && (
          <CompleteSets
            marketId={marketId}
            numCompleteSets={numCompleteSets}
            transactionsStatus={transactionsStatus}
            sellCompleteSets={sellCompleteSets}
          />
        )}
        {extendedView && <div className={SharedStyles.MarketOrders__footer} />}
      </div>
    );
  }
}
