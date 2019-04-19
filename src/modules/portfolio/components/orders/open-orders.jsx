import React, { Component } from "react";
import PropTypes from "prop-types";

import FilterSwitchBox from "modules/portfolio/containers/filter-switch-box";
import OpenOrder from "modules/portfolio/containers/open-order";
import OpenOrdersHeader from "modules/portfolio/components/common/headers/open-orders-header";
import OrderMarketRow from "modules/portfolio/components/common/rows/order-market-row";

const sortByOptions = [
  {
    label: "View by Most Recently Traded Market",
    value: "creationTime",
    comp: null
  },
  {
    label: "View by Most Recently Traded Outcome",
    value: "endTime",
    comp: null
  }
];

export default class OpenOrders extends Component {
  static propTypes = {
    markets: PropTypes.array.isRequired,
    openOrders: PropTypes.array.isRequired,
    marketsObj: PropTypes.object.isRequired,
    ordersObj: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      viewByMarkets: true
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
      data.name && data.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  }

  switchView() {
    this.setState({
      viewByMarkets: !this.state.viewByMarkets
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
        key={"openOrderMarket_" + data.id}
        market={marketsObj[data.id]}
      />
    ) : (
      <OpenOrder
        key={"openOrder_" + data.id}
        openOrder={ordersObj[data.id]}
        isSingle
      />
    );
  }

  render() {
    const { markets, openOrders } = this.props;
    const { viewByMarkets } = this.state;

    return (
      <FilterSwitchBox
        title="Open Orders"
        showFilterSearch
        filterLabel="open orders"
        sortByOptions={sortByOptions}
        sortByStyles={{ minWidth: "13.6875rem" }}
        data={viewByMarkets ? markets : openOrders}
        filterComp={this.filterComp}
        switchView={this.switchView}
        bottomBarContent={<OpenOrdersHeader />}
        renderRows={this.renderRows}
      />
    );
  }
}
