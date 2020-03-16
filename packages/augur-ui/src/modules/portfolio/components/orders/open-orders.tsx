import React, { Component } from 'react';
import FilterSwitchBox from 'modules/portfolio/containers/filter-switch-box';
import OpenOrder from 'modules/portfolio/containers/open-order';
import OpenOrdersHeader from 'modules/portfolio/components/common/open-orders-header';
import OrderMarketRow from 'modules/portfolio/components/common/order-market-row';
import { MarketData, UIOrder } from 'modules/types';

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

interface OpenOrdersProps {
  markets: MarketData[];
  openOrders: UIOrder[];
  marketsObj: { [marketId: string]: MarketData };
  ordersObj: { [orderId: string]: UIOrder };
  toggle?: () => void;
  extend?: boolean;
  hide?: boolean;
}

interface OpenOrdersState {
  viewByMarkets: boolean;
}

export default class OpenOrders extends Component<OpenOrdersProps, OpenOrdersState> {
  state = {
    viewByMarkets: true
  };

  constructor(props) {
    super(props);

    this.filterComp = this.filterComp.bind(this);
    this.switchView = this.switchView.bind(this);
    this.renderRows = this.renderRows.bind(this);
  }

  filterComp(input, data) {
    return data.description.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  switchView() {
    this.setState({
      viewByMarkets: !this.state.viewByMarkets,
    });
  }

  renderRows(data) {
    const { marketsObj, ordersObj } = this.props;
    const { viewByMarkets } = this.state;

    const marketView = marketsObj[data.id] && viewByMarkets;
    const orderView = ordersObj[data.id];
    if (!marketView && !orderView) return null;
    return marketView ? (
      <OrderMarketRow
        key={'openOrderMarket_' + data.id}
        market={marketsObj[data.id]}
      />
    ) : (
        <OpenOrder
          key={'openOrder_' + data.id}
          marketId={data.id}
          openOrder={ordersObj[data.id]}
          isSingle
        />
      );
  }

  render() {
    const { markets, openOrders, toggle, extend, hide } = this.props;
    const { viewByMarkets } = this.state;

    return (
      <FilterSwitchBox
        title="Open Orders"
        showFilterSearch
        filterLabel="open orders"
        sortByOptions={sortByOptions}
        sortByStyles={{ minWidth: '13.6875rem' }}
        data={viewByMarkets ? markets : openOrders}
        filterComp={this.filterComp}
        switchView={this.switchView}
        bottomBarContent={<OpenOrdersHeader />}
        renderRows={this.renderRows}
        toggle={toggle}
        extend={extend}
        hide={hide}
      />
    );
  }
}
