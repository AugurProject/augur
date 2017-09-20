import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Input from 'modules/common/components/input/input'

import parseQuery from 'modules/routes/helpers/parse-query'
import makeQuery from 'modules/routes/helpers/make-query'
import debounce from 'utils/debounce'

import { FILTER_SEARCH_PARAM } from 'modules/filter-sort/constants/param-names'

import Styles from 'modules/filter-sort/components/filter-search/filter-search.styles'

export default class FilterSearch extends Component { // NOTE -- intentionally excluded `default` for enforced function name comparison
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    updateIndices: PropTypes.func.isRequired,
    searchPlaceholder: PropTypes.string
  }

  constructor(props) {
    super(props)

    this.state = {
      search: ''
    }

    this.updateQuery = debounce(this.updateQuery.bind(this))
  }

  componentWillMount() {
    const search = parseQuery(this.props.location.search)[FILTER_SEARCH_PARAM]
    this.setState({ search })
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.search !== nextState.search) this.updateQuery(nextState.search, nextProps.location)
  }

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
      <article className={Styles.FilterSearch} isFilterSort>
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
