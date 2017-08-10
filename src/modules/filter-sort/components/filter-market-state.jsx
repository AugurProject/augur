import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'modules/common/components/dropdown';

import parseQuery from 'modules/app/helpers/parse-query';
import makeQuery from 'modules/app/helpers/make-query';
import { isMarketDataOpen } from 'utils/is-market-data-open';

import { FILTER_MARKET_STATE_PARAM_NAME } from 'modules/app/constants/param-names';

export default class FilterMarketState extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    currentReportingPeriod: PropTypes.number.isRequired,
    updateFilter: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.marketStateOptions = [
      {
        label: 'Open',
        value: 'open'
      },
      {
        label: 'Reporting',
        value: 'reporting'
      },
      {
        label: 'Closed',
        value: 'closed'
      }
    ];

    this.defaultMarketState = this.marketStateOptions[0].value;

    this.state = {
      selectedMarketState: this.defaultMarketState
    };

    this.filterByMarketState = this.filterByMarketState.bind(this);
    this.updateQuery = this.updateQuery.bind(this);
  }

  componentWillMount() {
    const selectedMarketState = parseQuery(this.props.location.search)[FILTER_MARKET_STATE_PARAM_NAME];
    console.log('selectedMarketState -- ', selectedMarketState);
    if (selectedMarketState) this.setState({ selectedMarketState });
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.selectedMarketState !== nextState.selectedMarketState ||
      this.props.items !== nextProps.items
    ) {
      this.filterByMarketState(nextState.selectedMarketState, nextProps.currentReportingPeriod, nextProps.items, nextProps.location);
    }

    if (this.state.selectedMarketState !== nextState.selectedMarketState) {
      this.updateQuery(nextState.selectedMarketState, nextProps.location);
    }
  }

  filterByMarketState(selectedMarketState, currentReportingPeriod, items, location) {
    const matchedItems = items.reduce((p, market, i) => {
      switch (selectedMarketState) {
        case 'open':
          if (isMarketDataOpen(market)) return [...p, i];
          break;
        case 'reporting':
          if (market.tradingPeriod === currentReportingPeriod) return [...p, i];
          break;
        case 'closed':
          if (!isMarketDataOpen(market)) return [...p, i];
          break;
        default:
          return p;
      }

      return p;
    }, []);

    this.props.updateFilter(matchedItems);
  }

  updateQuery(selectedMarketState, location) {
    let updatedSearch = parseQuery(location.search);

    if (selectedMarketState === this.defaultMarketState) {
      delete updatedSearch[FILTER_MARKET_STATE_PARAM_NAME];
    } else {
      updatedSearch[FILTER_MARKET_STATE_PARAM_NAME] = selectedMarketState;
    }

    updatedSearch = makeQuery(updatedSearch);

    this.props.history.push({
      ...location,
      search: updatedSearch
    });
  }

  render() {
    return (
      <article className="filter-market-state">
        <Dropdown
          default={this.state.selectedMarketState}
          options={this.marketStateOptions}
          onChange={selectedMarketState => this.setState({ selectedMarketState })}
        />
      </article>
    );
  }
}
