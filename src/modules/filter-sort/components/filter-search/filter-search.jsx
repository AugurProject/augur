import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Input from 'modules/common/components/input/input'

import parseQuery from 'modules/routes/helpers/parse-query'
import makeQuery from 'modules/routes/helpers/make-query'
import parseStringToArray from 'modules/routes/helpers/parse-string-to-array'
import debounce from 'utils/debounce'
import getValue from 'utils/get-value'
import isEqual from 'lodash/isEqual'

import { FILTER_SEARCH_PARAM } from 'modules/routes/constants/param-names'

import Styles from 'modules/filter-sort/components/filter-search/filter-search.styles'

// NOTE --  Currently the searchKeys can accomodate target's of type string and array
export default class FilterSearch extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    searchPlaceholder: PropTypes.string
  }

  constructor(props) {
    super(props)

    this.state = {
      search: ''
    }

    this.onChangeSearch = this.onChangeSearch.bind(this)
    this.debouncedOnChangeSearch = debounce(this.onChangeSearch.bind(this))
    this.filterBySearch = this.filterBySearch.bind(this)
  }

  componentWillMount() {
    const search = parseQuery(this.props.location.search)[FILTER_SEARCH_PARAM]
    this.setState({ search })
    // this.onChangeSearch(search, this.props.items)
  }

  // componentWillReceiveProps(nextProps) {
  //   if (!isEqual(this.props.items, nextProps.items)) this.onChangeSearch(this.state.search, nextProps.items)
  // }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.search !== nextState.search) this.updateQuery(nextState.search, nextProps.location)
  }

  // onChangeSearch(search, items, debounce) {
  //   this.setState({ search })
  //
  //   if (debounce) return this.debouncedOnChangeSearch(search, items)
  //
  //   if (search && search.length && items && items.length) {
  //     this.filterBySearch(search, items)
  //   } else {
  //     this.props.updateFilter(null)
  //   }
  // }
  //
  // filterBySearch(search, items) { // If ANY match is found, the item is included in the returned array
  //   const searchArray = parseStringToArray(decodeURIComponent(search))
  //
  //   const checkStringMatch = (value, search) => value.toLowerCase().indexOf(search) !== -1
  //
  //   const checkArrayMatch = (item, keys, search) => { // Accomodates n-1 key's value of either array or object && final key's value of type string or array
  //     const parentValue = getValue(item, keys.reduce((p, key, i) => i + 1 !== keys.length ? `${p}${i !== 0 ? '.' : ''}${key}` : p, '')) // eslint-disable-line no-confusing-arrow
  //
  //     if (parentValue === null) return false
  //
  //     if (Array.isArray(parentValue) && parentValue.length) {
  //       return parentValue.some(value => (value[keys[keys.length - 1]] || '').toLowerCase().indexOf(search) !== -1)
  //     } else if (typeof parentValue === 'object' && Object.keys(parentValue).length) {
  //       return (parentValue[keys[keys.length - 1]] || '').toLowerCase().indexOf(search) !== -1
  //     }
  //
  //     return false // Just in case
  //   }
  //
  //   const matchedItems = items.reduce((p, item, i) => {
  //     const matchedSearch = searchArray.some(search =>
  //       this.props.keys.some((key) => {
  //         if (typeof key === 'string') return checkStringMatch((item[key] || ''), search)
  //
  //         return checkArrayMatch(item, key, search)
  //       }
  //     ))
  //
  //     if (matchedSearch) {
  //       return [...p, i]
  //     }
  //
  //     return p
  //   }, [])
  //
  //   this.props.updateFilter(matchedItems)
  // }

  updateQuery(search, location) {
    let updatedSearch = parseQuery(location.search)

    if (search === '') {
      delete updatedSearch[FILTER_SEARCH_PARAM]
    } else {
      updatedSearch[FILTER_SEARCH_PARAM] = search
    }

    updatedSearch = makeQuery(updatedSearch)

    this.props.history.push({
      ...location,
      search: updatedSearch
    })
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <article className={Styles.FilterSearch}>
        <Input
          className={Styles.FilterSearch__input}
          isSearch
          isClearable
          placeholder={p.searchPlaceholder || 'Search'}
          value={s.search}
          onChange={search => this.setState({ search })}
        />
      </article>
    )
  }
}
