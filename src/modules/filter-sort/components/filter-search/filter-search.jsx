import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Input from 'modules/common/components/input/input'

import parseQuery from 'modules/routes/helpers/parse-query'
import makeQuery from 'modules/routes/helpers/make-query'

import { FILTER_SEARCH_PARAM } from 'modules/filter-sort/constants/param-names'

import Styles from 'modules/filter-sort/components/filter-search/filter-search.styles'

export default class FilterSearch extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    searchPlaceholder: PropTypes.string,
  }

  constructor(props) {
    super(props)

    this.state = {
      search: '',
    }

    this.updateQuery = this.updateQuery.bind(this)
  }

  componentWillMount() {
    const { location } = this.props
    const search = parseQuery(location.search)[FILTER_SEARCH_PARAM]
    if (search) this.setState({ search })
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.search !== nextState.search) {
      this.updateQuery(nextState.search, nextProps.location)
    }
  }

  updateQuery(search, location) {
    const { history } = this.props
    let updatedSearch = parseQuery(location.search)

    if (search === '') {
      delete updatedSearch[FILTER_SEARCH_PARAM]
    } else {
      updatedSearch[FILTER_SEARCH_PARAM] = search
    }

    updatedSearch = makeQuery(updatedSearch)

    history.push({
      ...location,
      search: updatedSearch,
    })
  }

  render() {
    const { searchPlaceholder } = this.props
    const s = this.state

    return (
      <article className={Styles.FilterSearch}>
        <Input
          className={Styles.FilterSearch__input}
          isSearch
          isClearable
          noFocus
          placeholder={searchPlaceholder || 'Search'}
          value={s.search}
          onChange={search => this.setState({ search })}
        />
      </article>
    )
  }
}
