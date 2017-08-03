import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from 'modules/common/components/input';

import parseQuery from 'modules/app/helpers/parse-query';
import debounce from 'utils/debounce';

import { SEARCH_PARAM_NAME } from 'modules/app/constants/param-names';

export default class FilterSearch extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,  // Raw items to filter against
    keys: PropTypes.array.isRequired    // Keys w/in each item's object to apply filter
  }

  constructor(props) {
    super(props);

    this.state = {
      keywords: ''
    };

    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.debouncedOnChangeSearch = debounce(this.onChangeSearch.bind(this));
  }

  componentWillMount() {
    const search = parseQuery(this.props.location.search)[SEARCH_PARAM_NAME];
    this.onChangeSearch(search);
  }

  onChangeSearch(search, debounce) {
    console.log('value -- ', !!searc, debounce);

    if (debounce) return this.debouncedOnChangeSearch(search);

    if (!!search) {
      const decodedSearch = decodeURIComponent(value)

      console.log('decodeURIComponent -- ', decodedSearch);
      // const formattedSearch = encodeURIComponent(value);


    } else {

    }
  }

  render() {
    const s = this.state;

    return (
      <article className="search-input" >
        <Input
          isSearch
          isClearable
          placeholder="Search Markets"
          value={s.keywords}
          onChange={value => this.onChangeSearch(value, true)}
        />
      </article>
    );
  }
}
