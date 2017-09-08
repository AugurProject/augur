import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { mobileMenuStates } from 'modules/app/components/app/app'

import Styles from 'modules/app/components/inner-nav/inner-nav.styles'

import _, { isEqual } from 'lodash'
import parseQuery from 'modules/app/helpers/parse-query'
import parseStringToArray from 'modules/app/helpers/parse-string-to-array'
import makeQuery from 'modules/app/helpers/make-query'
import makePath from 'modules/app/helpers/make-path'

import { TOPIC_PARAM_NAME, TAGS_PARAM_NAME } from 'modules/app/constants/param-names'
import { MARKETS } from 'modules/app/constants/views'

import MenuItem from 'modules/app/components/inner-nav/menu-item'

export default class InnerNav extends Component {
  static propTypes = {
    categories: PropTypes.array.isRequired,
    markets: PropTypes.array.isRequired,
    marketsFilteredSorted: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired,
    mobileMenuState: PropTypes.number.isRequired,
    subMenuScalar: PropTypes.number.isRequired
  }

  constructor() {
    super()
    this.state = {
      filteredKeywords: []
    }
  }

  componentWillReceiveProps(nextProps) {
    const searchChanged = !isEqual(this.props.location.search, nextProps.location.search)
    if (
      !isEqual(this.props.markets, nextProps.markets) ||
      !isEqual(this.props.marketsFilteredSorted, nextProps.marketsFilteredSorted) ||
      searchChanged
    ) {
      this.updateFilteredKeywords(nextProps.markets, nextProps.marketsFilteredSorted, nextProps.location)
    }
  }

  updateFilteredKeywords(markets, marketsFilteredSorted, location) {
    // make sure all selected tags are displayed, even if markets haven't loaded yet
    const selectedKeywords = parseStringToArray(decodeURIComponent(parseQuery(location.search)[TAGS_PARAM_NAME] || ''), '+')
    const selectedCategory = parseQuery(location.search)[TOPIC_PARAM_NAME]

    let catFilteredMarkets = markets
    if (selectedCategory) catFilteredMarkets = _.filter(markets, market => market.topic === selectedCategory)

    const filteredKeywords = _(marketsFilteredSorted)
    .intersection(catFilteredMarkets)
    .map(index => (markets[index] ? markets[index].tags : null))
    .flatten()
    .filter(keyword => Boolean(keyword))
    .concat(selectedKeywords)
    .uniq()
    .slice(0, 50)
    .map(keyword => ({
      name: keyword,
      isSelected: (selectedKeywords || []).indexOf(keyword) !== -1
    }))
    .value()

    this.setState({ filteredKeywords })
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

    const keywords = parseStringToArray(decodeURIComponent(searchParams[TAGS_PARAM_NAME]), '+')

    if (keywords.indexOf(keyword) !== -1) { // Remove Tag
      keywords.splice(keywords.indexOf(keyword), 1)
    } else { // add tag
      keywords.push(keyword)
    }

    if (keywords.length) {
      searchParams[TAGS_PARAM_NAME] = keywords.join('+')
    } else {
      delete searchParams[TAGS_PARAM_NAME]
    }

    searchParams = makeQuery(searchParams)

    this.props.history.push({
      ...this.props.location,
      search: searchParams
    })
  }

  renderCategoriesList() {
    const searchParams = parseQuery(this.props.location.search)
    const selectedCategory = searchParams[TOPIC_PARAM_NAME]

    return (
      <ul className={classNames(Styles.InnerNav__menu, Styles['InnerNav__menu--main'])}>
        <MenuItem isSelected={(!selectedCategory || selectedCategory === '')}>
          <Link to={{ pathname: makePath(MARKETS) }}>
            All Markets
          </Link>
        </MenuItem>

        {this.props.categories.map((item, index) => {
          const isSelected = item.topic === selectedCategory
          return (
            <MenuItem
              isSelected={isSelected}
              key={item.topic}
            >
              <Link
                to={{
                  pathname: makePath(MARKETS),
                  search: makeQuery({
                    [TOPIC_PARAM_NAME]: item.topic
                  })
                }}
              >
                {item.topic}
              </Link>
            </MenuItem>
          )
        })}
      </ul>
    )
  }

  renderSubMenu() {
    const showKeywords = this.props.mobileMenuState === mobileMenuStates.KEYWORDS_OPEN
    let animatedStyle
    if (!this.props.isMobile) {
      animatedStyle = { left: (110 * this.props.subMenuScalar) }
    }

    return (
      <ul
        className={classNames({
          [Styles.InnerNav__menu]: true,
          [Styles['InnerNav__menu--submenu']]: true,
          [Styles['InnerNav__menu--submenu--mobileshow']]: showKeywords })}
        style={animatedStyle}
      >
        {this.state.filteredKeywords.map((item, index) => (
          <MenuItem
            isSelected={item.isSelected}
            key={item.name}
          >
            <button onClick={() => this.toggleKeyword(item.name)}>
              {item.name}
            </button>
          </MenuItem>
        ))}
      </ul>
    )
  }

  render() {
    const showCategories = this.props.mobileMenuState >= mobileMenuStates.CATEGORIES_OPEN
    return (
      <aside className={classNames(Styles.InnerNav, { [Styles.mobileShow]: showCategories })}>
        {this.renderSubMenu()}
        {this.renderCategoriesList()}
      </aside>
    )
  }
}
