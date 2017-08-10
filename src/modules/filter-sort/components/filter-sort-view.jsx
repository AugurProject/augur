import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FilterMarketState from 'modules/filter-sort/components/filter-market-state';
import SortMarketParam from 'modules/filter-sort/components/sort-market-param';
import FilterSearch from 'modules/filter-sort/components/filter-search';

export default class FilterSortView extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    updateFilteredItems: PropTypes.func.isRequired,
    // Optional Filters + Sorts
    filterByMarketState: PropTypes.bool,
    sortByMarketParam: PropTypes.bool,
    currentReportingPeriod: PropTypes.number,
    searchPlaceholder: PropTypes.string,
    filterByKeyword: PropTypes.array
  }

  constructor(props) {
    super(props);

    this.state = {
      filters: {
        searchItems: null,
        marketStateItems: null
      },
      sorts: {
        marketParamItems: null
      },
      combinedFiltered: null
    };
  }

  componentWillMount() {
    this.updateCombinedFilters(this.state.filters, this.props.items);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.filters !== nextState.filters) {
      this.updateCombinedFilters(nextState.filters, nextProps.items);
    }

    if (
      this.state.sorts !== nextState.sorts ||
      this.state.combinedFiltered !== nextState.combinedFiltered
    ) {
      this.updateSortedFiltered(nextState.sorts, nextState.combinedFiltered);
    }
  }

  updateCombinedFilters(filters, items) {
    const combinedFiltered = Object.keys(filters).reduce((p, filterType) => {
      if (p.length === 0 || (filters[filterType] !== null && filters[filterType].length === 0)) return [];
      if (filters[filterType] === null) return p;

      return filters[filterType].filter(item => p.includes(item));
    }, items.map((_, i) => i));

    this.setState({ combinedFiltered });
  }

  updateSortedFiltered(sorts, combinedFiltered) { // If we want to accomodate more than one sorting mechanism across a filtered list, we'll need to re-architect things a bit
    this.props.updateFilteredItems(sorts.marketParamItems !== null ? sorts.marketParameter : combinedFiltered);
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <article className="filter-sort">
        {!!p.filterByMarketState && !!p.currentReportingPeriod &&
          <FilterMarketState
            location={p.location}
            history={p.history}
            items={p.items}
            currentReportingPeriod={p.currentReportingPeriod}
            updateFilter={marketStateItems => this.setState({ filters: { ...s.filters, marketStateItems } })}
          />
        }
        {!!p.sortByMarketParam &&
          <SortMarketParam
            location={p.location}
            history={p.history}
            items={p.items}
            combinedFiltered={s.combinedFiltered}
            updateSort={marketParamItems => this.setState({ sorts: { ...s.sorts, marketParamItems } })}
          />
        }
        {!!p.filterBySearch &&
          <FilterSearch
            location={p.location}
            history={p.history}
            items={p.items}
            keys={p.filterBySearch}
            searchPlaceholder={p.searchPlaceholder}
            updateFilter={searchItems => this.setState({ filters: { ...s.filters, searchItems } })}
          />
        }
      </article>
    );
  }
}
