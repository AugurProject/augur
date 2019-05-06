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

  return {
    category: selectedCategoryName,
    tags: selectedTagNames,
    keywords
  };
};

const FilterSearchContainer = withRouter(
  connect(mapStateToProps)(FilterSearch)
);

export default FilterSearchContainer;
