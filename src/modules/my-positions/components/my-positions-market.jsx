import React, { Component, PropTypes } from 'react';

import ComponentNav from 'modules/common/components/component-nav';
import ValueDenomination from 'modules/common/components/value-denomination';

import MyPosition from 'modules/my-positions/components/my-position';
import MyPositionOverview from 'modules/my-positions/components/my-position-overview';
import MyOrders from 'modules/my-orders/container';

import { POSITIONS_POSITIONS, POSITIONS_ORDERS } from 'modules/my-positions/constants/internal-views';

import getValue from 'utils/get-value';

export default class PortfolioPositions extends Component {
  static propTypes = {
    markets: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);

    this.navItems = {
      [POSITIONS_POSITIONS]: {
        label: 'Positions'
      },
      [POSITIONS_ORDERS]: {
        label: 'Orders'
      }
    };

    this.state = {
      selectedNav: POSITIONS_POSITIONS
    };
  }

  render() {
    const p = this.props;
    const s = this.state;

    const myPositionOutcomes = getValue(p, 'market.myPositionOutcomes');
    const myPositionsSummary = getValue(p, 'market.myPositionsSummary');
    const marketLink = getValue(p, 'market.marketLink');

    return (
      <article className="my-positions-market" >
        <MyPositionOverview
          description={p.market.description}
          marketLink={marketLink}
        />
        <ComponentNav
          navItems={this.navItems}
          selectedNav={s.selectedNav}
          updateSelectedNav={selectedNav => this.setState({ selectedNav })}
        />
        {s.selectedNav === POSITIONS_POSITIONS &&
          <div>
            <div className="my-position">
              <div className="my-position-group main-group">
              </div>
              <div className="my-position-group">
              </div>
              <div className="my-position-group">
                <div className="my-position-pair realized-net">
                  <span className="title">total realized P/L</span>
                  <ValueDenomination {...myPositionsSummary.realizedNet} />
                </div>
                <div className="my-position-pair unrealized-net">
                  <span className="title">total unrealized P/L</span>
                  <ValueDenomination {...myPositionsSummary.unrealizedNet} />
                </div>
                <div className="my-position-pair total-net">
                  <span className="title">total P/L</span>
                  <ValueDenomination {...myPositionsSummary.totalNet} />
                </div>
              </div>
            </div>
            {(myPositionOutcomes || []).map(outcome =>
              <MyPosition
                {...outcome}
                {...outcome.position}
                key={`${p.market.id}-${outcome.id}`}
                type={p.market.type}
                closePositionStatus={p.closePositionStatus}
                isTradeCommitLocked={p.isTradeCommitLocked}
                scalarShareDenomination={p.scalarShareDenomination}
              />
            )}
          </div>
        }
        {s.selectedNav === POSITIONS_ORDERS &&
          <MyOrders />
        }
      </article>
    );
  }
}
