import PropTypes from 'prop-types'

import BaseInnerNav from 'modules/app/components/inner-nav/base-inner-nav'

import { concat, difference, map, flatMap, uniq, isEqual } from 'lodash'
import parseQuery from 'modules/routes/helpers/parse-query'
import parseStringToArray from 'modules/routes/helpers/parse-string-to-array'
import makeQuery from 'modules/routes/helpers/make-query'
import makePath from 'modules/routes/helpers/make-path'

import { QUERY_VALUE_DELIMITER } from 'modules/routes/constants/query-value-delimiter'
import { CATEGORY_PARAM_NAME, TAGS_PARAM_NAME } from 'modules/filter-sort/constants/param-names'
import { MARKETS } from 'modules/routes/constants/views'

export default class MarketsInnerNav extends BaseInnerNav {
  static propTypes = {
    ...BaseInnerNav.propTypes,
    categories: PropTypes.array.isRequired,
    markets: PropTypes.array.isRequired,
    marketsFilteredSorted: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  constructor() {
    super()
    this.state = {
      actualCurrentTags: [],
      visibleTags: {},
      selectedTags: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      location,
      markets,
      marketsFilteredSorted,
    } = this.props
    if (
      !isEqual(markets, nextProps.markets) ||
      !isEqual(marketsFilteredSorted, nextProps.marketsFilteredSorted) ||
      !isEqual(location.search, nextProps.location.search)
    ) {
      this.updateFilteredTags(nextProps.markets, nextProps.marketsFilteredSorted, nextProps.location)
    }
  }

  updateFilteredTags(markets, marketsFilteredSorted, location) {
    // make sure all selected tags are displayed, even if markets haven't loaded yet
    const selectedTags = parseStringToArray(decodeURIComponent(parseQuery(location.search)[TAGS_PARAM_NAME] || ''), QUERY_VALUE_DELIMITER)

    let filteredTags = flatMap(marketsFilteredSorted, (index) => {
      const market = markets.find(market => market.id === index)
      return (market ? [market.tags[0] || '', market.tags[1] || ''] : null)
    }).filter(tag => !!tag)

    filteredTags = concat(filteredTags, selectedTags)
    // TODO: discuss uppercase/lowercase variant tags and how they function differently
    // lowercasing all tags will make some function improperly re: markets view expects
    // correct "original" capitalization
    filteredTags = uniq(filteredTags)
      .slice(0, 50)

    const newTags = difference(filteredTags, this.state.actualCurrentTags)
    const oldTags = difference(this.state.actualCurrentTags, filteredTags)
    if (newTags.length > 0) this.addTags(newTags)
    if (oldTags.length > 0) this.removeTags(oldTags)

    this.setState({ actualCurrentTags: filteredTags, selectedTags })
  }

  addTags(tags) {
    const newTags = {}
    // NOTE: changed this to just display true since we aren't going to show in 50 milliseconds anymore.
    tags.forEach((tag) => {
      newTags[tag] = { visible: true }
    })

    const visibleTags = { ...this.state.visibleTags, ...newTags }
    this.setState({ visibleTags })
    // NOTE: Removed this for now, we shoudl find a better way to animate as this will re-show things tags that should be hidden.
    // animate tags after mounting
    // window.setTimeout(() => {
    //   const animTags = {}
    //   tags.forEach((tag) => {
    //     animTags[tag] = { visible: true }
    //   })
    //   const visibleTags = { ...this.state.visibleTags, ...animTags }
    //   console.log('new tags 3', visibleTags);
    //   this.setState({ visibleTags })
    // }, 50)
  }

  removeTags(tags) {
    const oldTags = {}
    tags.forEach((tag) => {
      oldTags[tag] = { visible: false }
    })
    const visibleTags = { ...this.state.visibleTags, ...oldTags }
    this.setState({ visibleTags })

    // TODO: consider removing tags from state when transition ends?
    // main difficulty is grabbing the correct DOM element to bind events.
    // currently, the behavior works perfectly visually
    // plus the likelihood of tag reuse is high, so removal likely
    // is useless because the tag would be re-added soon
  }

  toggleTag(tag) {
    const {
      history,
      location,
    } = this.props
    let searchParams = parseQuery(location.search)

    if (searchParams[TAGS_PARAM_NAME] == null || !searchParams[TAGS_PARAM_NAME].length) {
      searchParams[TAGS_PARAM_NAME] = [encodeURIComponent(tag)]
      searchParams = makeQuery(searchParams)

      return history.push({
        ...location,
        search: searchParams,
      })
    }

    const tags = parseStringToArray(decodeURIComponent(searchParams[TAGS_PARAM_NAME]), QUERY_VALUE_DELIMITER)

    if (tags.indexOf(tag) !== -1) { // Remove Tag
      tags.splice(tags.indexOf(tag), 1)
    } else { // add tag
      tags.push(tag)
    }

    if (tags.length) {
      searchParams[TAGS_PARAM_NAME] = tags.join(QUERY_VALUE_DELIMITER)
    } else {
      delete searchParams[TAGS_PARAM_NAME]
    }

    searchParams = makeQuery(searchParams)

    history.push({
      ...location,
      search: searchParams,
    })
  }

  getMainMenuData() {
    const {
      categories,
      isMobile,
      location,
      openSubMenu,
    } = this.props
    const searchParams = parseQuery(location.search)
    const selectedCategory = searchParams[CATEGORY_PARAM_NAME]
    return categories.map(item => ({
      label: item.category,
      isSelected: item.category === selectedCategory,
      visible: true,
      onClick: () => {
        if (isMobile) openSubMenu()
      },
      link: {
        pathname: makePath(MARKETS),
        search: makeQuery({
          [CATEGORY_PARAM_NAME]: item.category,
        }),
      },
    }))
  }

  getSubMenuData() {
    return map(this.state.visibleTags, (tagState, tag) => ({
      label: tag,
      isSelected: (this.state.selectedTags.indexOf(tag) > -1),
      onClick: () => this.toggleTag(tag),
      visible: tagState.visible,
    }))
  }
}
