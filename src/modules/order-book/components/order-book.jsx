import React, { Component } from 'react'
import PropTypes from 'prop-types'

import OrderBookTable from 'modules/order-book/components/order-book-table'
import OrderBookChart from 'modules/order-book/components/order-book-chart'

import ComponentNav from 'modules/common/components/component-nav'

import { SCALAR } from 'modules/markets/constants/market-types'
import { ORDER_BOOK_TABLE, ORDER_BOOK_CHART } from 'modules/order-book/constants/order-book-internal-views'

import getValue from 'utils/get-value'

export default class OrderBook extends Component {
  static propTypes = {
    selectedShareDenomination: PropTypes.string,
    selectedTradeSide: PropTypes.object.isRequired,
    updateTradeFromSelectedOrder: PropTypes.func.isRequired,
    outcome: PropTypes.object,
  };

  constructor(props) {
    super(props)

    this.navItems = {
      [ORDER_BOOK_TABLE]: {
        label: 'Table',
      },
      [ORDER_BOOK_CHART]: {
        label: 'Chart',
      },
    }

    this.state = {
      selectedNav: ORDER_BOOK_TABLE,
    }
  }

  render() {
    const p = this.props
    const s = this.state

    const name = getValue(p, 'outcome.name')
    const orderBookSeries = getValue(p, 'outcome.orderBookSeries')

    return (
      <article className="order-book">
        {p.outcome &&
          <div>
            {p.marketType !== SCALAR ?
              <h3>Order Book {name &&
                <span>&mdash; {name}</span>
              }
              </h3> :
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
                orderBookSeries={orderBookSeries}
              />
            }
          </div>
        }
      </article>
    )
  }
}
