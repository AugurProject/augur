import { connect } from 'react-redux';
import { compose } from 'redux';
import BaseInnerNavPure from 'modules/app/components/inner-nav/base-inner-nav-pure';
import {
  MARKET_SORT,
  MARKET_MAX_FEES,
  MARKET_MAX_SPREAD,
  MARKET_SHOW_INVALID,
  TEMPLATE_FILTER,
} from 'modules/app/store/constants';
import { AppStatus } from '../store/app-status';

const mapStateToProps = () => {
  const {
    marketsList: { selectedCategories },
    loginAccount: { settings },
  } = AppStatus.get();
  return {
    selectedCategories,
    settings,
  };
};

const mapDispatchToProps = dispatch => {
  const {
    updateFilterSortOptions,
    updateLoginAccount,
    updateMarketsList,
  } = AppStatus.actions;
  return {
    updateLoginAccount: settings => updateLoginAccount({ settings }),
    updateMarketsListMeta: meta => updateMarketsList({ meta }),
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
    updateLoginAccount: settings => console.log('would have updated settings for account', settings),
      // dP.updateLoginAccount({
      //   ...AppStatus.get().loginAccount.settings,
      //   ...settings,
      // }),
  };
};

const MarketsInnerNavContainer = compose(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)
)(BaseInnerNavPure);

export default MarketsInnerNavContainer;
