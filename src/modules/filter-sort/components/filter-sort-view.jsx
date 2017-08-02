import React, { Component } from 'react';
import PropTypes from 'prop-types';

// TODO -- refactored reusable structure
//  props:
//    Full List
//    Location (full obj)
//    History
//    {...filter types desired (bools)}
//    update method

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
        {p.filterByKeyword &&
          <FilterKeywords
            items={p.items}
            keys={p.filterByKeyword}
          />
        }
      </article>
    );
  }
}
