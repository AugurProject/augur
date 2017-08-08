import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from 'modules/common/components/input';

import parseQuery from 'modules/app/helpers/parse-query';
import debounce from 'utils/debounce';
import getValue from 'utils/get-value';

import { SEARCH_PARAM_NAME } from 'modules/app/constants/param-names';

// NOTE --  Currently the searchKeys can accomodate target string, object, and arrays.
export default class FilterSearch extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,  // Raw items to filter against, assumes array of objects
    keys: PropTypes.array.isRequired,    // Keys w/in each item's object to apply filter
    updateFilter: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      keywords: ''
    };

    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.debouncedOnChangeSearch = debounce(this.onChangeSearch.bind(this));
    this.filterBySearch = this.filterBySearch.bind(this);
  }

  componentWillMount() {
    const search = parseQuery(this.props.location.search)[SEARCH_PARAM_NAME];
    this.onChangeSearch(search);
  }

  onChangeSearch(search, debounce) {
    if (debounce) return this.debouncedOnChangeSearch(search);

    if (search.length) {
      this.filterBySearch(search);
    } else {
      this.props.updateFilter(null);
    }
  }

  filterBySearch(search) {
    // If ANY match is found, the item is included in the returned array
    // Iterate over each 'keys' sub array and accumulate matching results

    const searchArray = cleanKeywordsArray(decodeURIComponent(search));

    console.log('searchArray -- ', searchArray);

    // Iterate over:
    //    Each item
    //      Each search
    //        Each key

    const checkStringMatch = (value, search) => value.toLowerCase().indexOf(search) !== 0;

    const checkArrayMatch = (item, keys, search) => { // Accomodates n-1 key's value of either array or object && final key of type string or array
      const parentValue = getValue(item, keys.reduce((p, key, i) => i + 1 !== keys.length && `${p}.${key}`, ''));
      if (parentValue !== null && typeof parentValue === 'object') {
        return parentValue[keys[keys.length - 1]].toLowerCase().indexOf(search) !== 0;
      } else if (parentValue.isArray()) {
        return parentValue.some(value => value[keys[keys.length - 1]].toLowerCase().indexOf(search) !== 0);
      }

      return false; // Issue with traversal
    };

    const matchedItems = this.props.items.reduce((p, item, i) => {
      const matchedSearch = searchArray.some(search =>
        this.props.keys.some((key) => {
          // Check if key is string or array

          // Traverse down full array of keys

          if (typeof key === 'string') {
            return checkStringMatch((item.key || ''), search);
          }

          return checkArrayMatch(item, key, search);
        }
      ));

      if (matchedSearch) {
        return [...p, i];
      }

      return p;
    }, []);

    this.props.updateFilter(matchedItems);

    // function isMatchKeywords(market, keys) {
    //   const keywordsArray = cleanKeywordsArray(keys);
    //   if (!keywordsArray.length) {
    //     return true;
    //   }
    //   return keywordsArray.every(keyword => (
    //     market.description.toLowerCase().indexOf(keyword) >= 0 ||
    //     market.outcomes.some(outcome => outcome.name && outcome.name.indexOf(keyword) >= 0) ||
    //     market.tags.some(tag => tag.name.indexOf(keyword) >= 0)
    //   ));
    // }
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


function cleanKeywords(keywords) {
  return (keywords || '').replace(/\s+/g, ' ').trim();
}

function cleanKeywordsArray(keywords) {
  const CleanKeywords = cleanKeywords(keywords).toLowerCase();
  return CleanKeywords ? CleanKeywords.split(' ').sort() : [];
}
