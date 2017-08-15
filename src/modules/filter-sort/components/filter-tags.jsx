import React, { Component } from 'react';
import PropTypes from 'prop-types';

import parseQuery from 'modules/app/helpers/parse-query';
import parseStringToArray from 'modules/app/helpers/parse-string-to-array';
import isEqual from 'lodash/isEqual';

import { TAGS_PARAM_NAME } from 'modules/app/constants/param-names';

export default class FilterTags extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    updateFilter: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.filterByTags = this.filterByTags.bind(this);
  }

  componentWillMount() {
    this.filterByTags(this.props.location, this.props.items);
  }

  componentWillReceiveProps(nextProps) {
    if (
      !isEqual(this.props.items, nextProps.items) ||
      !isEqual(this.props.location.search, nextProps.location.search)
    ) {
      this.filterByTags(nextProps.location, nextProps.items);
    }
  }

  filterByTags(location, items) {
    const selectedTags = parseQuery(this.props.location.search)[TAGS_PARAM_NAME];

    if (selectedTags == null || !selectedTags.length) return this.props.updateFilter(null);

    const tagsArray = parseStringToArray(decodeURIComponent(selectedTags));

    const filteredItems = items.reduce((p, item, i) => {
      if (
        tagsArray.every(filterTag =>
          item.tags.some(tag => tag.toLowerCase().indexOf(filterTag.toLowerCase()) !== -1)
        )
      ) {
        return [...p, i];
      }

      return p;
    }, []);

    this.props.updateFilter(filteredItems);
  }

  render() {
    return null; // This is stricting a filtering component, tag selection is handled via the SideBar
  }
}
