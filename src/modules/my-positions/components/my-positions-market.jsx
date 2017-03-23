import React, { Component, PropTypes } from 'react';

import ComponentNav from 'modules/common/components/component-nav';

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
    const marketLink = getValue(p, 'market.marketLink');

    return (
      <article className="my-positions-market" >
        <MyPositionOverview
          {...p.market.myPositionsSummary}
          description={p.market.description}
          marketLink={marketLink}
        />
        <ComponentNav
          navItems={this.navItems}
          selectedNav={s.selectedNav}
          updateSelectedNav={selectedNav => this.setState({ selectedNav })}
        />
        {s.selectedNav === POSITIONS_POSITIONS &&
          (myPositionOutcomes || []).map(outcome =>
            <MyPosition
              key={`${p.market.id}-${outcome.id}`}
              type={p.market.type}
              {...outcome}
              {...outcome.position}
            />
          )
        }
        {s.selectedNav === POSITIONS_ORDERS &&
          <MyOrders />
        }
      </article>
    );
  }
}
