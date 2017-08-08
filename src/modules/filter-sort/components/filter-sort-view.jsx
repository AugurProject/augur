import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FilterSearch from 'modules/filter-sort/components/filter-search';

import getValue from 'utils/get-value';

export default class FilterSortView extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    updateFilteredItems: PropTypes.func.isRequired,
    searchPlaceholder: PropTypes.string,
    filterByKeyword: PropTypes.array
  }

  constructor(props) {
    super(props);

    this.state = {
      searchItems: null
    };
  }

  // Filters First
  // Sorts Second

  componentWillMount() {
    // TODO -- call aggregate update method
  }

  componentWillReceiveProps(nextProps) {
    // TODO -- conditionally call aggregate udpate method
  }

  componentWillUpdate(nextProps, nextState) {
    // TODO -- conditionally call aggregate update method

    if (this.state.searchItems !== nextState.searchItems) {
      console.log(nextState.searchItems);
      this.setState({ searchItems: nextState.searchItems });
    }
  }

  render() {
    const p = this.props;

    return (
      <article>
        {!!getValue(p, 'filterBySearch') &&
          <FilterSearch
            location={p.location}
            history={p.history}
            items={p.items}
            keys={p.filterBySearch}
            updateFilter={searchItems => this.setState({ searchItems })}
          />
        }
      </article>
    );
  }
}
