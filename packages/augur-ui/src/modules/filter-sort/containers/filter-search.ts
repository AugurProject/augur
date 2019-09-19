import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import FilterSearch from "modules/filter-sort/components/filter-search";
import { getSelectedTagsAndCategoriesFromLocation } from "modules/markets/helpers/get-selected-tags-and-categories-from-location";

const mapStateToProps = (state, { location }) => {
  const {
    selectedCategoryName,
    keywords,
  } = getSelectedTagsAndCategoriesFromLocation(location);

  return {
    category: selectedCategoryName,
    keywords,
  };
};

const FilterSearchContainer = withRouter(
  connect(mapStateToProps)(FilterSearch)
) as any;

export default FilterSearchContainer;
