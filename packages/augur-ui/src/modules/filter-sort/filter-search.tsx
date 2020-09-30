import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router';
import { Input } from 'modules/common/form';
import parseQuery from 'modules/routes/helpers/parse-query';
import makeQuery from 'modules/routes/helpers/make-query';

import { PAGINATION_PARAM_NAME } from 'modules/routes/constants/param-names';
import {
  FILTER_SEARCH_PARAM,
  SEARCH_FILTER_PLACHOLDER_MOBILE,
  SEARCH_FILTER_PLACHOLDER,
} from 'modules/common/constants';
import Styles from 'modules/filter-sort/filter-search.styles.less';
import { useAppStatusStore } from 'modules/app/store/app-status';

interface FilterSearchProps {
  placeholder?: string;
  search?: string;
  onChange?: Function;
}

// Show mobile placeholder on devices with 475px or lower screen width
const SEARCH_PLACEHOLDER =
  window.innerWidth > 475
    ? SEARCH_FILTER_PLACHOLDER
    : SEARCH_FILTER_PLACHOLDER_MOBILE;

export const FilterSearch = ({
  placeholder: placeholderProp = SEARCH_PLACEHOLDER,
  search: searchProp = '',
  onChange: onChangeProp = value => {},
}: FilterSearchProps) => {
  const { marketsList: { isSearching: isSearchingMarkets }} = useAppStatusStore();
  const timeout = useRef(null);
  const parent = useRef(null);
  const location = useLocation();
  const history = useHistory();
  const [search, setSearch] = useState(
    parseQuery(location.search)[FILTER_SEARCH_PARAM] || searchProp
  );
  const [placeholder, setPlaceholder] = useState(placeholderProp);
  
  const resetTimeout = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  }

  const resetSearch = () => {
    setPlaceholder(SEARCH_PLACEHOLDER);
    setSearch('');
  };

  const onChange = value => {
    onChangeProp(value);
    resetTimeout();
    timeout.current = setTimeout(() => {
      if (parent.current) {
        setSearch(value);
      }
    }, 500);
  };

  useEffect(() => {
    if (!location.search.includes(FILTER_SEARCH_PARAM)) {
      resetTimeout();
      resetSearch();
    }
  }, [location]);

  useEffect(() => {
    let updatedSearch = parseQuery(location.search);
    if (search === '') {
      delete updatedSearch[FILTER_SEARCH_PARAM];
    } else {
      delete updatedSearch[PAGINATION_PARAM_NAME];
      updatedSearch[FILTER_SEARCH_PARAM] = search;
    }
    updatedSearch = makeQuery(updatedSearch);
    history.push({
      ...location,
      search: updatedSearch,
    });
    resetTimeout();
  }, [search]);

  return (
    <FilterSearchPure
      forwardRef={parent}
      placeholder={placeholder}
      search={search}
      onChange={value => onChange(value)}
      onFocus={() => setPlaceholder('')}
      onBlur={() => setPlaceholder(placeholderProp)}
      isSearchingMarkets={isSearchingMarkets}
    />
  );
};

interface FilterSearchPureProps {
  placeholder?: string;
  search?: string;
  onChange: Function;
  onFocus?: Function;
  onBlur?: Function;
  isSearchingMarkets?: boolean;
}

export const FilterSearchPure = ({
  placeholder = SEARCH_PLACEHOLDER,
  search = '',
  onChange,
  onFocus,
  onBlur,
  isSearchingMarkets = false,
}: FilterSearchPureProps) => (
  <article className={Styles.FilterSearch}>
    <Input
      className={Styles.Search}
      isSearch
      isClearable
      noFocus
      placeholder={placeholder}
      value={search}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      isLoading={isSearchingMarkets}
    />
  </article>
);

export default FilterSearch;