import { connect } from 'react-redux';
import { compose } from 'redux';
import BaseInnerNavPure from 'modules/app/components/inner-nav/base-inner-nav-pure';
import {
  updateSelectedCategories,
  updateMarketsListMeta,
} from 'modules/markets-list/actions/update-markets-list';
import {
  MARKET_SORT,
  MARKET_MAX_FEES,
  MARKET_MAX_SPREAD,
  MARKET_SHOW_INVALID,
  TEMPLATE_FILTER,
} from 'modules/app/store/constants';
import { AppStatus } from '../store/app-status';

const mapStateToProps = ({ marketsList }) => {
  return {
    selectedCategories: marketsList.selectedCategories,
    settings: AppStatus.get().loginAccount.settings,
  };
};

const mapDispatchToProps = dispatch => {
  const {
    updateFilterSortOptions,
    updateLoginAccount,
  } = AppStatus.actions;
  return {
    updateLoginAccount: settings => updateLoginAccount({ settings }),
    updateSelectedCategories: categories =>
      dispatch(updateSelectedCategories(categories)),
    updateMarketsListMeta: meta => dispatch(updateMarketsListMeta(meta)),
    updateMarketsSortBy: sortBy =>
      updateFilterSortOptions({ [MARKET_SORT]: sortBy }),
    updateMaxFee: maxFee =>
      updateFilterSortOptions({ [MARKET_MAX_FEES]: maxFee }),
    updateMaxSpread: maxLiquiditySpread =>
      updateFilterSortOptions({ [MARKET_MAX_SPREAD]: maxLiquiditySpread }),
    updateShowInvalid: showInvalid =>
      updateFilterSortOptions({ [MARKET_SHOW_INVALID]: showInvalid }),
    updateTemplateFilter: templateFilter =>
      updateFilterSortOptions({ [TEMPLATE_FILTER]: templateFilter }),
  };
};
const mergeProps = (sP, dP, oP) => {
  return {
    ...sP,
    ...dP,
    ...oP,
    updateLoginAccount: settings =>
      dP.updateLoginAccount(Object.assign({}, sP.settings, settings)),
  };
};

const MarketsInnerNavContainer = compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)(BaseInnerNavPure);

export default MarketsInnerNavContainer;
