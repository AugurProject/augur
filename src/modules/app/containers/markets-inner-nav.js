import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { compose } from "redux";
import { QUERY_VALUE_DELIMITER } from "modules/routes/constants/query-value-delimiter";
import {
  CATEGORY_PARAM_NAME,
  TAGS_PARAM_NAME,
  FILTER_SEARCH_PARAM
} from "modules/filter-sort/constants/param-names";
import { PAGINATION_PARAM_NAME } from "modules/routes/constants/param-names";
import { selectCategories } from "modules/categories/selectors/categories";
import { selectIsMobile } from "src/select-state";

import { isEmpty, map, getOr } from "lodash/fp";
import { curriedToggleMemberOfArray } from "utils/toggle-member-of-array";
import makeQuery from "modules/routes/helpers/make-query";
import makePath from "modules/routes/helpers/make-path";
import { MARKETS } from "modules/routes/constants/views";
import BaseInnerNavPure from "modules/app/components/inner-nav/base-inner-nav-pure";
import { selectAllCategories } from "modules/categories/selectors/select-all-categories";
import { getSelectedTagsAndCategoriesFromLocation } from "modules/markets/helpers/get-selected-tags-and-categories-from-location";
import noop from "src/utils/noop";

const mapStateToProps = (
  state,
  { history, location = {}, openSubMenu = noop }
) => {
  const {
    category,
    tags,
    balanceOfSearchParams,
    keywords
  } = getSelectedTagsAndCategoriesFromLocation(location);

  const isMobile = selectIsMobile(state);
  const categories = selectCategories(state);
  const allCategories = selectAllCategories(state);

  const toggleTagFn = curriedToggleMemberOfArray(tags);
  const categoryU = category && category.toUpperCase();

  const onClick = ((location, history, toggleTagFn) => tag => () => {
    const p = {
      ...balanceOfSearchParams,
      [CATEGORY_PARAM_NAME]: categoryU
    };

    if (keywords) {
      p[FILTER_SEARCH_PARAM] = keywords;
    }

    const tagArr = toggleTagFn(tag);
    if (!isEmpty(tagArr)) {
      p[TAGS_PARAM_NAME] = tagArr.join(QUERY_VALUE_DELIMITER);
    }

    delete p[PAGINATION_PARAM_NAME];

    history.push({
      ...location,
      search: makeQuery(p)
    });
  })(location, history, toggleTagFn);

  // Works bottom to top.
  const submenuItems = compose(
    map(tag => ({
      label: tag,
      isSelected: tags.includes(tag),
      onClick: onClick(tag),
      visible: true
    })),
    getOr([], categoryU)
  )(allCategories);

  const makeCategoryLink = categoryClicked => {
    const link = {
      pathname: makePath(MARKETS)
    };
    if (categoryClicked !== category || !isEmpty(tags)) {
      const query = {
        [CATEGORY_PARAM_NAME]: categoryClicked
      };
      if (keywords) {
        query[FILTER_SEARCH_PARAM] = keywords;
      }
      link.search = makeQuery(query);
    }
    return link;
  };

  const menuItems = categories.map(item => ({
    label: item.category,
    isSelected: item.category === category,
    visible: true,
    onClick: () => {
      if (isMobile) openSubMenu();
    },
    link: makeCategoryLink(item.category)
  }));

  return {
    isMobile,
    menuItems,
    submenuItems
  };
};

const MarketsInnerNavContainer = compose(
  withRouter,
  connect(mapStateToProps)
)(BaseInnerNavPure);

export default MarketsInnerNavContainer;
