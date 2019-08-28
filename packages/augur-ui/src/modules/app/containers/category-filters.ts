import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import CategoryFilters from '../components/inner-nav/category-filters';
import { selectPopularCategories, selectAllOtherCategories } from 'modules/markets-list/selectors/markets-list';
import { updateSelectedCategories, updateMarketsListMeta } from 'modules/markets-list/actions/update-markets-list';

const mapStateToProps = (state) => {
  return {
    isSearching: state.marketsList.isSearching,
    categoryMetaData: state.marketsList.meta,
    selectedCategories: state.marketsList.selectedCategories,
    popularCategories: selectPopularCategories(state),
    allOtherCategories: selectAllOtherCategories(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateSelectedCategories: (categories) => dispatch(updateSelectedCategories(categories)),
  updateMarketsListMeta: (meta) => dispatch(updateMarketsListMeta(meta)),
});

const CategoryFiltersContainer = withRouter(
compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CategoryFilters));

export default CategoryFiltersContainer;
