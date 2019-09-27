import React, { Component } from 'react';
import { Input } from 'modules/common/form';
import parseQuery from 'modules/routes/helpers/parse-query';
import makeQuery from 'modules/routes/helpers/make-query';

import { PAGINATION_PARAM_NAME } from 'modules/routes/constants/param-names';
import { FILTER_SEARCH_PARAM, SEARCH_FILTER_PLACHOLDER_MOBILE, SEARCH_FILTER_PLACHOLDER } from 'modules/common/constants';
import Styles from 'modules/filter-sort/components/filter-search.styles.less';

interface FilterSearchProps {
  location: Location;
  history: History;
  isSearchingMarkets?: boolean;
}

interface FilterSearchState {
  search: string;
  placeholder: string;
}

// Show mobile placeholder on devices with 475px or lower screen width
const SERACH_PLACEHOLDER = window.innerWidth > 475 ? SEARCH_FILTER_PLACHOLDER : SEARCH_FILTER_PLACHOLDER_MOBILE

export default class FilterSearch extends Component<
  FilterSearchProps,
  FilterSearchState
> {
  static defaultProps = {
    isSearchingMarkets: false,
  };

  timeout;
  parent;

  constructor(props) {
    super(props);

    this.state = {
      search: '',
      placeholder: SERACH_PLACEHOLDER,
    };

    this.updateQuery = this.updateQuery.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.timeout = null;
  }

  UNSAFE_componentWillMount() {
    const { location } = this.props;
    const search = parseQuery(location.search)[FILTER_SEARCH_PARAM];
    if (search) this.setState({ search });
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (
      nextProps.location !== this.props.location &&
      !nextProps.location.search.includes(FILTER_SEARCH_PARAM)
    ) {
      clearTimeout(this.timeout);
      this.resetSearch();
    }
    if (this.state.search !== nextState.search) {
      this.updateQuery(nextState.search, nextProps.location);
    }
  }

  onFocus() {
    this.setState({ placeholder: '' });
  }

  onBlur() {
    this.setState({ placeholder: SERACH_PLACEHOLDER });
  }

  onChange(search) {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      if (this.parent) {
        this.setState({ search });
      }
    }, 500);
  }

  resetSearch() {
    this.setState({ search: '', placeholder: SERACH_PLACEHOLDER });
  }

  updateQuery(search, location) {
    const { history } = this.props;
    let updatedSearch = parseQuery(location.search);

    if (search === '') {
      delete updatedSearch[FILTER_SEARCH_PARAM];
    } else {
      delete updatedSearch[PAGINATION_PARAM_NAME];
      updatedSearch[FILTER_SEARCH_PARAM] = search;
    }

    updatedSearch = makeQuery(updatedSearch);
    // @ts-ignore
    history.push({
      ...location,
      search: updatedSearch,
    });
  }

  render() {
    const { isSearchingMarkets } = this.props;
    const { placeholder, search } = this.state;

    return (
      <article
        className={Styles.FilterSearch}
        ref={parent => {
          this.parent = parent;
        }}
      >
        <Input
          className={Styles.Search}
          isSearch
          isClearable
          noFocus
          placeholder={placeholder}
          value={search}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          isLoading={Boolean(isSearchingMarkets || (isSearchingMarkets && search && search !== ''))}
        />
      </article>
    );
  }
}
