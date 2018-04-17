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
    marketType: PropTypes.string,
    outcome: PropTypes.object,
    selectedShareDenomination: PropTypes.string,
    selectedTradeSide: PropTypes.object.isRequired,
    updateTradeFromSelectedOrder: PropTypes.func.isRequired,
  }

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
    const {
      marketType,
      outcome,
      selectedShareDenomination,
      selectedTradeSide,
      updateTradeFromSelectedOrder,
    } = this.props
    const s = this.state

    const name = getValue(this.props, 'outcome.name')
    const orderBookSeries = getValue(this.props, 'outcome.orderBookSeries')

    return (
      <article className="order-book">
        {outcome &&
          <div>
            {marketType !== SCALAR ?
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
                outcome={outcome}
                selectedTradeSide={selectedTradeSide}
                updateTradeFromSelectedOrder={updateTradeFromSelectedOrder}
                selectedShareDenomination={selectedShareDenomination}
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
