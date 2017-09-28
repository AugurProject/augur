import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import Styles from 'modules/app/components/inner-nav/inner-nav.styles'

import { concat, difference, map, flatMap, uniq, isEqual } from 'lodash'
import parseQuery from 'modules/routes/helpers/parse-query'
import parseStringToArray from 'modules/routes/helpers/parse-string-to-array'
import makeQuery from 'modules/routes/helpers/make-query'
import makePath from 'modules/routes/helpers/make-path'

import { QUERY_VALUE_DELIMITER } from 'modules/routes/constants/query-value-delimiter'
import { TOPIC_PARAM_NAME, TAGS_PARAM_NAME } from 'modules/filter-sort/constants/param-names'
import { MARKETS } from 'modules/routes/constants/views'

export default class MarketsInnerNav extends BaseInnerNav {
  static propTypes = {
    categories: PropTypes.array.isRequired,
    markets: PropTypes.array.isRequired,
    marketsFilteredSorted: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  constructor() {
    super()
    this.state = {
      actualCurrentKeywords: [],
      visibleKeywords: {},
      selectedKeywords: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      !isEqual(this.props.markets, nextProps.markets) ||
      !isEqual(this.props.marketsFilteredSorted, nextProps.marketsFilteredSorted) ||
      !isEqual(this.props.location.search, nextProps.location.search)
    ) {
      this.updateFilteredKeywords(nextProps.markets, nextProps.marketsFilteredSorted, nextProps.location)
    }
  }

  updateFilteredKeywords(markets, marketsFilteredSorted, location) {
    // make sure all selected tags are displayed, even if markets haven't loaded yet
    const selectedKeywords = parseStringToArray(decodeURIComponent(parseQuery(location.search)[TAGS_PARAM_NAME] || ''), QUERY_VALUE_DELIMITER)

    let filteredKeywords = flatMap(marketsFilteredSorted, index => (markets[index] ? [markets[index].tags[1] || '', markets[index].tags[2] || ''] : null))
    .filter(keyword => !!keyword)

    filteredKeywords = concat(filteredKeywords, selectedKeywords)
    // TODO: discuss uppercase/lowercase variant keywords and how they function differently
    // lowercasing all keywords will make some function improperly re: markets view expects
    // correct "original" capitalization
    filteredKeywords = uniq(filteredKeywords)
    .slice(0, 50)

    const newKeywords = difference(filteredKeywords, this.state.actualCurrentKeywords)
    const oldKeywords = difference(this.state.actualCurrentKeywords, filteredKeywords)
    if (newKeywords.length > 0) this.addKeywords(newKeywords)
    if (oldKeywords.length > 0) this.removeKeywords(oldKeywords)

    this.setState({ actualCurrentKeywords: filteredKeywords, selectedKeywords })
  }

  addKeywords(keywords) {
    const newKeywords = {}
    keywords.forEach((keyword) => {
      newKeywords[keyword] = { visible: false }
    })

    const visibleKeywords = { ...this.state.visibleKeywords, ...newKeywords }
    this.setState({ visibleKeywords })

    // animate keywords after mounting
    window.setTimeout(() => {
      const animKeywords = {}
      keywords.forEach((keyword) => {
        animKeywords[keyword] = { visible: true }
      })
      const visibleKeywords = { ...this.state.visibleKeywords, ...animKeywords }
      this.setState({ visibleKeywords })
    }, 50)
  }

  removeKeywords(keywords) {
    const oldKeywords = {}
    keywords.forEach((keyword) => {
      oldKeywords[keyword] = { visible: false }
    })
    const visibleKeywords = { ...this.state.visibleKeywords, ...oldKeywords }
    this.setState({ visibleKeywords })

    // TODO: consider removing keywords from state when transition ends?
    // main difficulty is grabbing the correct DOM element to bind events.
    // currently, the behavior works perfectly visually
    // plus the likelihood of keyword reuse is high, so removal likely
    // is useless because the keyword would be re-added soon
  }

  toggleKeyword(keyword) {
    let searchParams = parseQuery(this.props.location.search)

    if (searchParams[TAGS_PARAM_NAME] == null || !searchParams[TAGS_PARAM_NAME].length) {
      searchParams[TAGS_PARAM_NAME] = [encodeURIComponent(keyword)]
      searchParams = makeQuery(searchParams)

      return this.props.history.push({
        ...this.props.location,
        search: searchParams
      })
    }

    const keywords = parseStringToArray(decodeURIComponent(searchParams[TAGS_PARAM_NAME]), QUERY_VALUE_DELIMITER)

    if (keywords.indexOf(keyword) !== -1) { // Remove Tag
      keywords.splice(keywords.indexOf(keyword), 1)
    } else { // add tag
      keywords.push(keyword)
    }

    if (keywords.length) {
      searchParams[TAGS_PARAM_NAME] = keywords.join(QUERY_VALUE_DELIMITER)
    } else {
      delete searchParams[TAGS_PARAM_NAME]
    }

    searchParams = makeQuery(searchParams)

    this.props.history.push({
      ...this.props.location,
      search: searchParams
    })
  }

  getMainMenuData() {
    const searchParams = parseQuery(this.props.location.search)
    const selectedCategory = searchParams[TOPIC_PARAM_NAME]
    return this.props.categories.map((item) => ({
      label: item.topic,
      isSelected: item.topic === selectedCategory,
      link: {
        pathname: makePath(MARKETS),
        search: makeQuery({
          [TOPIC_PARAM_NAME]: item.topic
        })
      }
    }))
  }

  getSubMenuData() {
    return this.state.visibleKeywords.map((keywordState, keyword) => ({
      label: keyword,
      isSelected: (this.state.selectedKeywords.indexOf(keyword) > -1),
      onClick: () => this.toggleKeyword(keyword),
      visible: keywordState.visible
    }))
  }
}
