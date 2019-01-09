import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import FilterSearch from "modules/filter-sort/components/filter-search/filter-search";
import { getSelectedTagsAndCategoriesFromLocation } from "src/modules/markets/helpers/get-selected-tags-and-categories-from-location";

const mapStateToProps = (state, { location }) => {
  const {
    selectedCategoryName,
    selectedTagNames,
    keywords
  } = getSelectedTagsAndCategoriesFromLocation(location);
  const { isMobileSmall } = state.appStatus;

  return {
    isMobileSmall,
    category: selectedCategoryName,
    tags: selectedTagNames,
    keywords,
    hasLoadedMarkets: state.appStatus.hasLoadedMarkets
  };
};

const FilterSearchContainer = withRouter(
  connect(mapStateToProps)(FilterSearch)
);

export default FilterSearchContainer;
