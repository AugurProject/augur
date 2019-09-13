import React, { Component } from 'react';
import { Input } from 'modules/common/form';
import classNames from 'classnames';
import parseQuery from 'modules/routes/helpers/parse-query';
import makeQuery from 'modules/routes/helpers/make-query';

import { PAGINATION_PARAM_NAME } from 'modules/routes/constants/param-names';
import { FILTER_SEARCH_PARAM } from 'modules/common/constants';
import { Hint } from 'modules/common/icons';
import Styles from 'modules/filter-sort/components/filter-search.styles.less';
import ReactTooltip from 'react-tooltip';
import TooltipStyles from 'modules/common/tooltip.styles.less';

interface FilterSearchProps {
  location: Location;
  history: History;
  isSearchingMarkets?: boolean;
}

interface FilterSearchState {
  search: string;
  placeholder: string;
}

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
      placeholder: 'Search',
    };

    this.updateQuery = this.updateQuery.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.timeout = null;
  }

  componentWillMount() {
    const { location } = this.props;
    const search = parseQuery(location.search)[FILTER_SEARCH_PARAM];
    if (search) this.setState({ search });
  }

  componentWillUpdate(nextProps, nextState) {
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
    this.setState({ placeholder: 'Search markets and categories' });
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
    this.setState({ search: '', placeholder: 'Search markets and categories' });
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
