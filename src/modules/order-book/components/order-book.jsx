import React, { Component, PropTypes } from 'react';

import OrderBookTable from 'modules/order-book/components/order-book-table';
import OrderBookChart from 'modules/order-book/components/order-book-chart';

import EmDash from 'modules/common/components/em-dash';
import ComponentNav from 'modules/common/components/component-nav';

import { SCALAR } from 'modules/markets/constants/market-types';
import { ORDER_BOOK_TABLE, ORDER_BOOK_CHART } from 'modules/order-book/constants/order-book-internal-views';

import getValue from 'utils/get-value';

export default class OrderBook extends Component {
  static propTypes = {
    selectedShareDenomination: PropTypes.string,
    outcome: PropTypes.object.isRequired,
    selectedTradeSide: PropTypes.object.isRequired,
    updateTradeFromSelectedOrder: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.navItems = {
      [ORDER_BOOK_TABLE]: {
        label: 'Table'
      },
      [ORDER_BOOK_CHART]: {
        label: 'Chart'
      }
    };

    this.state = {
      selectedNav: ORDER_BOOK_TABLE
    };
  }

  render() {
    const p = this.props;
    const s = this.state;

    const name = getValue(p, 'outcome.name');

    return (
      <article className="order-book">
        {p.marketType !== SCALAR ?
          <h3>Order Book {name &&
            <span><EmDash /> {name}</span>
          }</h3> :
          <h3>Order Book</h3>
        }
        <ComponentNav
          fullWidth
          navItems={this.navItems}
          selectedNav={s.selectedNav}
          updateSelectedNav={selectedNav => this.setState({ selectedNav })}
        />
        {s.selectedNav === ORDER_BOOK_TABLE &&
          <OrderBookTable
            outcome={p.outcome}
            selectedTradeSide={p.selectedTradeSide}
            updateTradeFromSelectedOrder={p.updateTradeFromSelectedOrder}
            selectedShareDenomination={p.selectedShareDenomination}
          />
        }
        {s.selectedNav === ORDER_BOOK_CHART &&
          <OrderBookChart
            outcome={p.outcome}
          />
        }
      </article>
    );
  }
}
