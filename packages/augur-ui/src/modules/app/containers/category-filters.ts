import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import CategoryFilters from '../components/inner-nav/category-filters';
import { selectPopularCategories, selectAllOtherCategories } from 'modules/markets-list/selectors/markets-list';

const mapStateToProps = (state) => {
  return {
    isSearching: state.marketsList.isSearching,
    categoryMetaData: state.marketsList.meta,
    selectedCategories: state.marketsList.selectedCategories,
    selectedCategory: state.marketsList.selectedCategory,
    popularCategories: selectPopularCategories(state),
    allOtherCategories: selectAllOtherCategories(state),
    isMobile: state.appStatus.isMobile,
  };
};

const mapDispatchToProps = (dispatch) => ({
});

const CategoryFiltersContainer = withRouter(
compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CategoryFilters));

export default CategoryFiltersContainer;
