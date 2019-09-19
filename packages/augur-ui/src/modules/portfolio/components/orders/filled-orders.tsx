import React, { Component } from 'react';

import FilterSwitchBox from 'modules/portfolio/containers/filter-switch-box';
import OrderMarketRow from 'modules/portfolio/components/common/order-market-row';
import FilledOrder from 'modules/portfolio/containers/filled-order';

import FilledOrdersHeader from 'modules/portfolio/components/common/filled-orders-header';
import { MarketData, Order } from 'modules/types';

const sortByOptions = [
  {
    label: 'Most Recently Traded Market',
    value: 'tradedMarket',
    comp: null,
  },
  {
    label: 'Most Recently Traded Outcome',
    value: 'tradedOutcome',
    comp: null,
  },
];

interface FilledOrdersProps {
  markets: Array<MarketData>;
  filledOrders: Array<Order>;
  marketsObj: MarketData;
  ordersObj: Order;
  toggle: Function;
  extend: boolean;
  hide: boolean;
}

interface FilledOrdersState {
  viewByMarkets: boolean;
}

export default class FilledOrders extends Component<
  FilledOrdersProps,
  FilledOrdersState
> {
  constructor(props) {
    super(props);

    this.state = {
      viewByMarkets: true,
    };

    this.filterComp = this.filterComp.bind(this);
    this.switchView = this.switchView.bind(this);
    this.renderRows = this.renderRows.bind(this);
  }

  filterComp(input, data) {
    if (this.state.viewByMarkets) {
      return data.description.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
    return (
      data.outcome &&
      data.outcome.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  }

  switchView() {
    this.setState({
      viewByMarkets: !this.state.viewByMarkets,
    });
  }

  renderRows(data) {
    const { ordersObj, marketsObj } = this.props;
    const { viewByMarkets } = this.state;
    const marketView = marketsObj[data.id] && viewByMarkets;
    const orderView = ordersObj[data.id];

    if (!marketView && !orderView) return null;
    return marketView ? (
      <OrderMarketRow
        key={'filledOrderMarket_' + data.id}
        market={marketsObj[data.id]}
        filledOrders
      />
    ) : (
      // @ts-ignore
      <FilledOrder
        key={'filledOrder_' + data.id}
        filledOrder={ordersObj[data.id]}
        isSingle
      />
    );
  }

  render() {
    const { markets, filledOrders, toggle, extend, hide } = this.props;
    const { viewByMarkets } = this.state;

    return (
      // @ts-ignore
      <FilterSwitchBox
        title="Filled Orders"
        filterLabel="filled orders"
        showFilterSearch
        sortByOptions={sortByOptions}
        sortByStyles={{ minWidth: '13.6875rem' }}
        data={viewByMarkets ? markets : filledOrders}
        filterComp={this.filterComp}
        switchView={this.switchView}
        bottomBarContent={<FilledOrdersHeader />}
        renderRows={this.renderRows}
        toggle={toggle}
        extend={extend}
        hide={hide}
      />
    );
  }
}
