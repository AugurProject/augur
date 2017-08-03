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
    // Below are the optionsal filters available
    filterByKeyword: PropTypes.array
  }

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  // Filters First
  // Sorts Second

  render() {
    const p = this.props;

    return (
      <article>
        {!!getValue(p, 'filterBySearch.length') &&
          <FilterSearch
            location={p.location}
            history={p.history}
            items={p.items}
            keys={p.filterBySearch}
          />
        }
      </article>
    );
  }
}
