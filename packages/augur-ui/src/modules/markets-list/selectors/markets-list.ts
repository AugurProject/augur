import { createSelector } from 'reselect';
import { selectMarketsListsState } from 'store/select-state';
import { POPULAR_CATEGORIES, REPORTING_STATE } from 'modules/common/constants';
import { selectMarkets } from 'modules/markets/selectors/markets-all';

export const selectPopularCategories = createSelector(
  selectMarketsListsState,
  marketLists => {
    if (!marketLists.isSearching && marketLists.meta) {
      const categories = Object.keys(marketLists.meta.categories).map(
        category => category.toLowerCase()
      );
      const mapObject = category => {
        const item = Object.keys(marketLists.meta.categories).find(
          c => c.toLowerCase() === category
        );
        return {
          category,
          count: marketLists.meta.categories[item].count,
          children: marketLists.meta.categories[item].children,
        };
      };

      const popularCategories = categories
        .filter(category => POPULAR_CATEGORIES.includes(category))
        .map(mapObject);

      return POPULAR_CATEGORIES.map(category => {
        const isCategoryWithResults = popularCategories.find(
          meta => meta.category === category
        );

        if (isCategoryWithResults) {
          return isCategoryWithResults;
        }

        return {
          category,
          count: 0,
          children: null,
        };
      }).sort((a, b) => (a.count > b.count ? -1 : 1));
    } else {
      return POPULAR_CATEGORIES.map(category => {
        return {
          category,
          count: null,
          children: null,
        };
      });
    }
  }
);

export const selectAllOtherCategories = createSelector(
  selectMarketsListsState,
  marketLists => {
    if (!marketLists || !marketLists.meta) return null;

    const categories = Object.keys(marketLists.meta.categories).map(category =>
      category.toLowerCase()
    );
    const mapObject = category => {
      return {
        category,
        count: marketLists.meta.categories[category].count,
        children: marketLists.meta.categories[category].children,
      };
    };

    if (categories && categories.length > 0) {
      const allOtherCategories = categories
        .filter(category => !POPULAR_CATEGORIES.includes(category))
        .map(mapObject)
        .sort((a, b) => (a.count > b.count ? -1 : 1));

      return allOtherCategories;
    }
    return null;
  }
);

export const selectMarketStats = createSelector(
  selectMarkets,
  selectMarketsListsState,
  (markets, marketsList) => {
    if (markets && marketsList.meta && !marketsList.isSearching) {
      const categories = marketsList.meta.categories;
      const categoryData = {};

      POPULAR_CATEGORIES.map(category => {
        if (categories && categories[category]) {
          // TODO temporary mock/workaround until #3924
          const OI = markets
            .filter(market => market.categories[0] === category)
            .filter(
              market => market.reportingState === REPORTING_STATE.PRE_REPORTING
            )
            .reduce(
              (acc, market) => (acc = acc + Number(market.openInterest)),
              0
            );

          categoryData[category] = {
            markets: categories[category].count,
            OI: `$${OI}`,
          };
        } else {
          categoryData[category] = {
            markets: 0,
            OI: '$0',
          };
        }
      });
      return categoryData;
    }
    return null;
  }
);
