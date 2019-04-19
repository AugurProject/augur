import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { compose } from "redux";
import { QUERY_VALUE_DELIMITER } from "modules/routes/constants/query-value-delimiter";
import {
  CATEGORY_PARAM_NAME,
  TAGS_PARAM_NAME,
  FILTER_SEARCH_PARAM
} from "modules/common-elements/constants";
import { PAGINATION_PARAM_NAME } from "modules/routes/constants/param-names";
import { selectIsMobile, selectCategoriesState } from "src/select-state";

import { isEmpty } from "lodash/fp";
import { curriedToggleMemberOfArray } from "utils/toggle-member-of-array";
import makeQuery from "modules/routes/helpers/make-query";
import makePath from "modules/routes/helpers/make-path";
import { MARKETS } from "modules/routes/constants/views";
import BaseInnerNavPure from "modules/app/components/inner-nav/base-inner-nav-pure";
import { updateMobileMenuState } from "modules/app/actions/update-sidebar-status";
import { getSelectedTagsAndCategoriesFromLocation } from "modules/markets/helpers/get-selected-tags-and-categories-from-location";
import noop from "src/utils/noop";

const mapStateToProps = (
  state,
  { history, location = {}, openSubMenu = noop }
) => {
  const {
    selectedCategoryName,
    selectedTagNames,
    balanceOfSearchParams,
    keywords
  } = getSelectedTagsAndCategoriesFromLocation(location);

  const isMobile = selectIsMobile(state);
  const categories = selectCategoriesState(state);

  const toggleTagFn = curriedToggleMemberOfArray(selectedTagNames);

  const onClick = ((location, history, toggleTagFn) => tag => () => {
    const p = {
      ...balanceOfSearchParams,
      [CATEGORY_PARAM_NAME]: selectedCategoryName
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

  const makeCategoryLink = categoryClicked => {
    const link = {
      pathname: makePath(MARKETS)
    };
    if (
      categoryClicked !== selectedCategoryName ||
      !isEmpty(selectedTagNames)
    ) {
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

  const selectedCategoryMenuItems = categories.map(c => ({
    label: c.categoryName,
    isSelected: c.categoryName === selectedCategoryName,
    visible: true,
    onClick: () => {
      if (isMobile) openSubMenu();
    },
    link: makeCategoryLink(c.categoryName)
  }));

  const selectedCategoryTagMenuItems = (() => {
    const selectedCategory = categories.find(
      c => c.categoryName === selectedCategoryName
    );
    if (!selectedCategory) {
      return [];
    }
    return selectedCategory.tags.map(tagAggregation => ({
      label: tagAggregation.tagName,
      isSelected: selectedTagNames.includes(tagAggregation.tagName),
      onClick: onClick(tagAggregation.tagName),
      visible: true
    }));
  })();

  return {
    isMobile,
    menuItems: selectedCategoryMenuItems,
    submenuItems: selectedCategoryTagMenuItems
  };
};

const mapDispatchToProps = dispatch => ({
  updateMobileMenuState: data => dispatch(updateMobileMenuState(data))
});
const MarketsInnerNavContainer = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(BaseInnerNavPure);

export default MarketsInnerNavContainer;
