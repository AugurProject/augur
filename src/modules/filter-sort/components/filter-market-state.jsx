import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'modules/common/components/dropdown';

import parseQuery from 'modules/app/helpers/parse-query';
import makeQuery from 'modules/app/helpers/make-query';
import { isMarketDataOpen } from 'utils/is-market-data-open';

import { FILTER_MARKET_STATE_PARAM_NAME } from 'modules/app/constants/param-names';
import { FILTER_MARKET_STATE_OPEN, FILTER_MARKET_STATE_REPORTING, FILTER_MARKET_STATE_CLOSED } from 'modules/filter-sort/constants/filter-sort';

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
        value: FILTER_MARKET_STATE_OPEN
      },
      {
        label: 'Reporting',
        value: FILTER_MARKET_STATE_REPORTING
      },
      {
        label: 'Closed',
        value: FILTER_MARKET_STATE_CLOSED
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
        case FILTER_MARKET_STATE_OPEN:
          if (isMarketDataOpen(market)) return [...p, i];
          break;
        case FILTER_MARKET_STATE_REPORTING:
          if (market.tradingPeriod === currentReportingPeriod) return [...p, i];
          break;
        case FILTER_MARKET_STATE_CLOSED:
          if (!isMarketDataOpen(market)) return [...p, i];
          break;
        default:
          return p;
      }

      return p;
    }, []);

    console.log('matchedItems -- ', matchedItems);

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
          default={this.marketStateOptions[0].value}
          options={this.marketStateOptions}
          onChange={selectedMarketState => this.setState({ selectedMarketState })}
        />
      </article>
    );
  }
}


// // Filter/Sort Defaults
// export const FILTER_SORT_TYPE = 'open';
// export const FILTER_SORT_SORT = 'volume';
// export const FILTER_SORT_ISDESC = true;
//
// // Filter Types
// export const FILTER_TYPE_OPEN = 'open';
// export const FILTER_TYPE_REPORTING = 'reporting';
// export const FILTER_TYPE_CLOSED = 'closed';
//
// export const SELECT_TYPE_OPTIONS = [
//   {
//     label: 'Open',
//     value: FILTER_TYPE_OPEN
//   },
//   {
//     label: 'Reporting',
//     value: FILTER_TYPE_REPORTING
//   },
//   {
//     label: 'Closed',
//     value: FILTER_TYPE_CLOSED
//   }
// ];
//
// export const SELECT_SORT_OPTIONS = [
//   {
//     label: 'Volume',
//     value: 'volume'
//   },
//   {
//     label: 'Newest',
//     value: 'creationTime'
//   },
//   {
//     label: 'Expiration',
//     value: 'endDate'
//   },
//   {
//     label: 'Taker Fee',
//     value: 'takerFeePercent'
//   },
//   {
//     label: 'Maker Fee',
//     value: 'makerFeePercent'
//   }
// ];
//
// export const SELECT_ORDER_OPTIONS = {
//   isDesc: true
// };
