import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class FilterTags extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    updateFilteredItems: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedTags: []
    };
  }

  componentWillMount() {
    // TODO -- handle url query tags
  }

  componentWillReceiveProps(nextProps) {
    // TODO -- handle market changes
  }

  render() {
    return (
      <article className="filter-tags">
        <span>BRAH</span>
      </article>
    );
  }
}
