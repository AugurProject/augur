import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'modules/common/components/dropdown';

import parseQuery from 'modules/app/helpers/parse-query';
// import makeQuery from 'modules/app/helpers/make-query';
import getValue from 'utils/get-value';

import { SORT_MARKET_PARAM, SORT_MARKET_ORDER_PARAM } from 'modules/app/constants/param-names';

export default class SortMarketParam extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    combinedFiltered: PropTypes.array.isRequired,
    updateSort: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.defaultMarketParam = 'volume';
    this.defaultSort = true; // true = descending, false = ascending

    this.marketSortParams = [
      {
        label: 'Volume',
        value: 'volume'
      },
      {
        label: 'Newest',
        value: 'creationTime'
      },
      {
        label: 'Expiration',
        value: 'endDate'
      },
      {
        label: 'Taker Fee',
        value: 'takerFeePercent'
      },
      {
        label: 'Maker Fee',
        value: 'makerFeePercent'
      }
    ];

    this.state = {
      selectedMarketParam: this.defaultMarketParam,
      selectedSort: this.defaultSort
    };
  }

  componentWillMount() {
    const queryParams = parseQuery(this.props.location.search);

    const selectedMarketParam = queryParams[SORT_MARKET_PARAM];
    if (selectedMarketParam) this.setState({ selectedMarketParam });

    const selectedSort = queryParams[SORT_MARKET_ORDER_PARAM];
    if (selectedSort) this.setState({ selectedSort });
  }

  componentWillUpdate(nextProps, nextState) {
    // call respective methods
    if (
      this.state.selectedMarketParam !== nextState.selectedMarketParam ||
      this.state.selectedSort !== nextState.selectedSort ||
      this.props.items !== nextProps.items ||
      this.props.combinedFiltered !== nextProps.combinedFiltered
    ) {
      this.sortByMarketParam(nextState.selectedMarketParam, nextState.selectedSort, nextProps.items, nextProps.combinedFiltered, nextProps.location);
    }

    if (
      this.state.selectedMarketState !== nextState.selectedMarketState ||
      this.state.selectedSort !== nextState.selectedSort
    ) {
      this.updateQuery(nextState.selectedMarketState, nextState.selectedSort, nextProps.location);
    }
  }

  sortByMarketParam(selectedMarketParam, selectedSort, items, combinedFiltered, location) {
    const sortedItems = combinedFiltered.sort((a, b) => {
      // console.log('a value -- ', items[a][selectedMarketParam]);
      // console.log('b value -- ', items[b][selectedMarketParam]);

      switch (selectedMarketParam) {
        case 'creationTime':
        case 'endDate': {
          if (selectedSort) {
            return getValue(items, `${b}.${selectedMarketParam}.timestamp`) - getValue(items, `${a}.${selectedMarketParam}.timestamp`);
          }

          return getValue(items, `${a}.${selectedMarketParam}.timestamp`) - getValue(items, `${b}.${selectedMarketParam}.timestamp`);
        }
        case 'volume':
        case 'takerFeePercent':
        case 'makerFeePercent': {
          if (selectedSort) {
            return getValue(items, `${b}.${selectedMarketParam}.value`) - getValue(items, `${a}.${selectedMarketParam}.value`);
          }

          return getValue(items, `${a}.${selectedMarketParam}.value`) - getValue(items, `${b}.${selectedMarketParam}.value`);
        }
        default:
          return 0; // No sorting
      }
    });

    console.log('sortedItems -- ', sortedItems);
  }

  updateQuery(selectedMarketState, selectedSort, location) {
    //   let updatedSearch = parseQuery(location.search);
    //
    //   if (selectedMarketState === this.defaultMarketState) {
    //     delete updatedSearch[FILTER_MARKET_STATE_PARAM_NAME];
    //   } else {
    //     updatedSearch[FILTER_MARKET_STATE_PARAM_NAME] = selectedMarketState;
    //   }
    //
    //   updatedSearch = makeQuery(updatedSearch);
    //
    //   this.props.history.push({
    //     ...location,
    //     search: updatedSearch
    //   });
  }

  render() {
    const s = this.state;

    return (
      <article className="market-sort-param">
        <Dropdown
          className="companion-field"
          default={s.selectedMarketParam}
          options={this.marketSortParams}
          onChange={selectedMarketParam => this.setState({ selectedMarketParam })}
        />
        <button
          className="unstyled"
          onClick={() => this.setState({ selectedSort: !s.selectedSort })}
        >
          {s.selectedSort ? <i className="fa fa-sort-amount-desc" /> : <i className="fa fa-sort-amount-asc" />}
        </button>
      </article>
    );
  }
}

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
