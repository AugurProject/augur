import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from 'modules/common/components/input';

import debounce from 'utils/debounce';

export default class FilterKeywords extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,  // Raw items to filter against
    keys: PropTypes.array.isRequired    // Keys w/in each item's object to apply filter
  }

  constructor(props) {
    super(props);

    this.state = {};

    this.onChangeKeywords = debounce(this.onChangeKeywords.bind(this));
  }

  onChangeKeywords() {
    // TODO
  }

  render() {
    return (
      <article className={`search-input ${p.className}`} >
        <Input
          isSearch
          isClearable
          placeholder="Search Markets"
          value={p.keywords}
          onChange={p.onChangeKeywords}
        />
      </article>
    );
  }
}
