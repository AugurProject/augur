import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'modules/common/components/dropdown';

export default class SortMarketParam extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
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
