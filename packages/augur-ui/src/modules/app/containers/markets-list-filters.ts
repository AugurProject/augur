import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import {
  updateFilterSortOptions,
  MARKET_MAX_FEES,
  MARKET_MAX_SPREAD,
  MARKET_SHOW_INVALID,
} from 'modules/filter-sort/actions/update-filter-sort-options';
import MarketsListFilters from '../components/inner-nav/markets-list-filters';
import { TEMPLATE_FILTER } from 'modules/common/constants';
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
  } = filterSortOptions;
  return {
    maxFee,
    maxLiquiditySpread,
    includeInvalidMarkets,
    isSearching: marketsList.isSearching,
    allTemplateFilter: templateFilter,
    settings: loginAccount.settings || {},
    isMobile: appStatus.isMobile,
  };
};

const mapDispatchToProps = dispatch => ({
  updateMaxFee: maxFee => {
    dispatch(updateFilterSortOptions(MARKET_MAX_FEES, maxFee));
  },
  updateMaxSpread: maxLiquiditySpread => {
    dispatch(updateFilterSortOptions(MARKET_MAX_SPREAD, maxLiquiditySpread));
  },
  updateShowInvalid: showInvalid => {
    dispatch(updateFilterSortOptions(MARKET_SHOW_INVALID, showInvalid));
  },
  updateTemplateFilter: templateFilter => {
    dispatch(updateFilterSortOptions(TEMPLATE_FILTER, templateFilter));
  },
  updateLoginAccount: settings => {
    dispatch(updateLoginAccount({ settings }));
  },
  updateSelectedCategories: (category) => dispatch(updateSelectedCategories(category)),
});

const mergeProps = (sP, dP, oP) => {
  return {
    ...sP,
    ...oP,
    updateMaxFee: maxFee => {
      dP.updateMaxFee(maxFee);
      dP.updateLoginAccount(Object.assign({}, sP.settings, { maxFee }));
    },
    updateMaxSpread: maxLiquiditySpread => {
      dP.updateMaxSpread(maxLiquiditySpread);
      dP.updateLoginAccount(
        Object.assign({}, sP.settings, { spread: maxLiquiditySpread })
      );
    },
    updateShowInvalid: showInvalid => {
      dP.updateShowInvalid(showInvalid);
      dP.updateLoginAccount(Object.assign({}, sP.settings, { showInvalid }));
    },
    updateTemplateFilter: templateFilter => {
      dP.updateTemplateFilter(templateFilter);
      dP.updateLoginAccount(Object.assign({}, sP.settings, { templateFilter }));
    },
    updateSelectedCategories: (category) => dP.updateSelectedCategories(category);
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
