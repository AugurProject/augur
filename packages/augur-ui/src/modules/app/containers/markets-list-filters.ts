import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import {
  updateFilterSortOptions,
} from 'modules/filter-sort/actions/update-filter-sort-options';
import MarketsListFilters from '../components/inner-nav/markets-list-filters';
import { AppState } from 'appStore';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import { updateSelectedCategories } from "modules/markets-list/actions/update-markets-list";

const mapStateToProps = ({
  filterSortOptions,
  marketsList,
  loginAccount,
  appStatus,
}: AppState) => {
  const {
    maxFee,
    maxLiquiditySpread,
    includeInvalidMarkets,
    templateFilter,
    marketTypeFilter,
  } = filterSortOptions;
  return {
    maxFee,
    maxLiquiditySpread,
    includeInvalidMarkets,
    isSearching: marketsList.isSearching,
    allTemplateFilter: templateFilter,
    marketTypeFilter: marketTypeFilter,
    settings: loginAccount.settings || {},
    isMobile: appStatus.isMobile,
  };
};

const mapDispatchToProps = dispatch => ({
  updateLoginAccount: settings => {
    dispatch(updateLoginAccount({ settings }));
  },
  updateSelectedCategories: (category) => dispatch(updateSelectedCategories(category)),
  updateFilterSortOptions: (name, value) =>
    dispatch(updateFilterSortOptions(name, value)),
});

const mergeProps = (sP, dP, oP) => {
  return {
    ...sP,
    ...oP,
    updateSelectedCategories: (category) => dP.updateSelectedCategories(category),
    updateFilterSortOptions: (name, value) => {
      dP.updateFilterSortOptions(name, value);
      dP.updateLoginAccount(Object.assign({}, sP.settings, { [name]: value }));
    }
  };
};

const MarketsListFiltersContainer = withRouter(
  compose(
    connect(
      mapStateToProps,
      mapDispatchToProps,
      mergeProps
    )
  )(MarketsListFilters)
);

export default MarketsListFiltersContainer;
