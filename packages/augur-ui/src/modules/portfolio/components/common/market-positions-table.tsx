import type { Getters } from '@augurproject/sdk';
import classNames from 'classnames';

import SharedStyles
  from 'modules/market/components/market-orders-positions-table/open-orders-table.styles.less';
import Styles
  from 'modules/portfolio/components/common/market-positions-table.styles.less';

import PositionsHeader
  from 'modules/portfolio/components/common/positions-header';
import PositionRow from 'modules/portfolio/containers/position-row';
import React from 'react';

export interface MarketPositionsTableProps {
  positions: Getters.Users.TradingPosition[];
  extendedView: boolean;
  marketId: string;
  updateSelectedOrderProperties: Function;
  showRawPositions: boolean
}

export interface MarketPositionsTableState {
  showPercent: boolean;
}

export class MarketPositionsTable extends React.Component<
  MarketPositionsTableProps,
  MarketPositionsTableState
> {
  state: MarketPositionsTableState = {
    showPercent: true,
  };

  updateShowPercent = () => {
    this.setState({ showPercent: !this.state.showPercent });
  };

  render() {
    const {
      positions,
      marketId,
      extendedView,
      updateSelectedOrderProperties,
      showRawPositions
    } = this.props;
    const { showPercent } = this.state;

    return (
      <div
        className={classNames(Styles.PositionsTable, {
          [SharedStyles.Table]: extendedView,
        })}
      >
        <PositionsHeader
          showPercent={showPercent}
          updateShowPercent={this.updateShowPercent}
          extendedView={extendedView}
        />
        <div>
          {positions.map((position: Position, index: number) => (
            <PositionRow
              key={'positionRow_' + position.marketId + position.outcomeId}
              position={position}
              showPercent={showPercent}
              extendedView={extendedView}
              isSingle={extendedView}
              showExpandedToggleOnMobile
              isFirst={index === 0}
              showRawPositions={showRawPositions}
              updateSelectedOrderProperties={updateSelectedOrderProperties}
            />
          ))}
        </div>
        {extendedView && positions.length === 0 && (
          <div className={SharedStyles.Empty}>
            no positions to show
          </div>
        )}
      </div>
    );
  }
}
