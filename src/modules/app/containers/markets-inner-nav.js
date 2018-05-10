import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { compose } from 'redux'
import { QUERY_VALUE_DELIMITER } from 'src/modules/routes/constants/query-value-delimiter'
import { CATEGORY_PARAM_NAME, TAGS_PARAM_NAME } from 'src/modules/filter-sort/constants/param-names'
import { selectCategories } from 'src/modules/categories/selectors/categories'
import { selectIsMobile } from 'src/select-state'

import { isEmpty, map, getOr } from 'lodash/fp'
import { curriedToggleMemberOfArray } from 'src/utils/toggle-member-of-array'
import makeQuery from 'src/modules/routes/helpers/make-query'
import makePath from 'src/modules/routes/helpers/make-path'
import { MARKETS } from 'src/modules/routes/constants/views'
import BaseInnerNavPure from 'src/modules/app/components/inner-nav/base-inner-nav-pure'
import { selectAllCategories } from 'src/modules/app/selectors/select-all-categories'
import { getSelectedTagsAndCategoriesFromLocation } from 'src/modules/markets/helpers/get-selected-tags-and-categories-from-location'
import noop from 'src/utils/noop'

const mapStateToProps = (state, { history, location = {}, openSubMenu = noop }) => {
  const {
    category,
    tags,
    balanceOfSearchParams,
  } = getSelectedTagsAndCategoriesFromLocation(location)

  const isMobile = selectIsMobile(state)
  const categories = selectCategories(state)
  const allCategories = selectAllCategories(state)

  const toggleTagFn = curriedToggleMemberOfArray(tags)
  const onClick = ((location, history, toggleTagFn) => tag => () => {
    const p = {
      ...balanceOfSearchParams,
      [CATEGORY_PARAM_NAME]: category,
    }

    const tagArr = toggleTagFn(tag)
    if (!isEmpty(tagArr)) {
      p[TAGS_PARAM_NAME] = tagArr.join(QUERY_VALUE_DELIMITER)
    }

    history.push({
      ...location,
      search: makeQuery(p),
    })
  })(location, history, toggleTagFn)

  // Works bottom to top.
  const submenuItems = compose(
    map(tag => ({
      label: tag,
      isSelected: tags.includes(tag),
      onClick: onClick(tag),
      visible: true,
    })),
    getOr([], category),
  )(allCategories)

  const menuItems = categories.map(item => ({
    label: item.category,
    isSelected: item.category === category,
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

  return {
    isMobile,
    menuItems,
    submenuItems,
  }
}

const MarketsInnerNavContainer = compose(
  withRouter,
  connect(mapStateToProps),
)(BaseInnerNavPure)

export default MarketsInnerNavContainer
