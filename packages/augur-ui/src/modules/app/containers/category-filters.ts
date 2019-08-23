import { connect } from 'react-redux';
import { compose } from 'redux';
import CategoryFilters from '../components/inner-nav/category-filters';
import { selectPopularCategories, selectAllOtherCategories } from 'modules/markets-list/selectors/markets-list';

const mapStateToProps = (state) => {
  return {
    isSearching: state.marketsList.isSearching,
    categoryMetaData: state.marketsList.meta,
    popularCategories: selectPopularCategories(state),
    allOtherCategories: selectAllOtherCategories(state),
  };
};

const mapDispatchToProps = () => ({ });

const CategoryFiltersContainer = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CategoryFilters);

export default CategoryFiltersContainer;
