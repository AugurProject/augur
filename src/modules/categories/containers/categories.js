import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import CategoriesView from "modules/categories/components/categories-view/categories-view";

import { selectCategories } from "modules/categories/selectors/categories";

const mapStateToProps = state => ({
  isMobile: state.appStatus.isMobile,
  categories: selectCategories(state)
});

const Categories = withRouter(connect(mapStateToProps)(CategoriesView));

export default Categories;
