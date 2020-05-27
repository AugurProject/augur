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
import { AppStatus } from '../store/app-status';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => {
  const {
    updateFilterSortOptions,
    updateLoginAccount,
    updateMarketsList,
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
      updateMarketsList({
        selectedCategories: category || [],
        selectedCategory: category.length ? category[category.length - 1] : null,
      }),
  };
};
const mergeProps = (sP, dP, oP) => {
  const { loginAccount: { settings } } = AppStatus.get();
  return {
    ...sP,
    ...oP,
    updateMaxFee: maxFee => {
      dP.updateMaxFee(maxFee);
      // dP.updateLoginAccount({ ...settings, maxFee });
    },
    updateMaxSpread: maxLiquiditySpread => {
      dP.updateMaxSpread(maxLiquiditySpread);
      // dP.updateLoginAccount({ ...settings, spread: maxLiquiditySpread });
    },
    updateShowInvalid: showInvalid => {
      dP.updateShowInvalid(showInvalid);
      // dP.updateLoginAccount({ ...settings, showInvalid });
    },
    updateTemplateFilter: templateFilter => {
      dP.updateTemplateFilter(templateFilter);
      // dP.updateLoginAccount({ ...settings, templateFilter });
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
