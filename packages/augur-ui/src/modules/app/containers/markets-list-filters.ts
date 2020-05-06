import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import {
  MARKET_MAX_FEES,
  MARKET_MAX_SPREAD,
  MARKET_SHOW_INVALID,
} from 'modules/app/store/constants';
import MarketsListFilters from '../components/inner-nav/markets-list-filters';
import { TEMPLATE_FILTER } from 'modules/common/constants';
import { AppState } from 'appStore';
import { AppStatus } from '../store/app-status';
import { updateSelectedCategories } from 'modules/markets-list/actions/update-markets-list';

const mapStateToProps = ({ marketsList, loginAccount }: AppState) => {
  const {
    loginAccount: { settings },
    filterSortOptions: {
      maxFee,
      maxLiquiditySpread,
      includeInvalidMarkets,
      templateFilter,
    },
  } = AppStatus.get();
  return {
    maxFee,
    maxLiquiditySpread,
    includeInvalidMarkets,
    isSearching: marketsList.isSearching,
    allTemplateFilter: templateFilter,
    settings,
  };
};

const mapDispatchToProps = dispatch => {
  const {
    updateFilterSortOptions,
    updateLoginAccount,
  } = AppStatus.actions;
  return {
    updateMaxFee: maxFee =>
      updateFilterSortOptions({ [MARKET_MAX_FEES]: maxFee }),
    updateMaxSpread: maxLiquiditySpread =>
      updateFilterSortOptions({ [MARKET_MAX_SPREAD]: maxLiquiditySpread }),
    updateShowInvalid: showInvalid =>
      updateFilterSortOptions({ [MARKET_SHOW_INVALID]: showInvalid }),
    updateTemplateFilter: templateFilter =>
      updateFilterSortOptions({ [TEMPLATE_FILTER]: templateFilter }),
    updateLoginAccount: settings => updateLoginAccount({ settings }),
    updateSelectedCategories: category =>
      dispatch(updateSelectedCategories(category)),
  };
};
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
    updateSelectedCategories: category => dP.updateSelectedCategories(category),
  };
};

const MarketsListFiltersContainer = withRouter(
  compose(connect(mapStateToProps, mapDispatchToProps, mergeProps))(
    MarketsListFilters
  )
);

export default MarketsListFiltersContainer;
