import React, { Component } from "react";
import PropTypes from "prop-types";

import FilterSwitchBox from "modules/portfolio/containers/filter-switch-box";
import OrderMarketRow from "modules/portfolio/components/common/rows/order-market-row";
import FilledOrder from "modules/portfolio/components/common/rows/filled-order";
import FilledOrdersHeader from "modules/portfolio/components/common/headers/filled-orders-header";

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

export default class FilledOrders extends Component {
  static propTypes = {
    markets: PropTypes.array.isRequired,
    filledOrders: PropTypes.array.isRequired,
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
      data.outcome &&
      data.outcome.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  }

  switchView() {
    this.setState({
      viewByMarkets: !this.state.viewByMarkets
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
        key={"filledOrderMarket_" + data.id}
        market={marketsObj[data.id]}
        filledOrders
      />
    ) : (
      <FilledOrder
        key={"filledOrder_" + data.id}
        filledOrder={ordersObj[data.id]}
        isSingle
      />
    );
  }

  render() {
    const { markets, filledOrders } = this.props;
    const { viewByMarkets } = this.state;

    return (
      <FilterSwitchBox
        title="Filled Orders"
        filterLabel="filled orders"
        showFilterSearch
        sortByOptions={sortByOptions}
        sortByStyles={{ minWidth: "13.6875rem" }}
        data={viewByMarkets ? markets : filledOrders}
        filterComp={this.filterComp}
        switchView={this.switchView}
        bottomBarContent={<FilledOrdersHeader />}
        renderRows={this.renderRows}
      />
    );
  }
}
