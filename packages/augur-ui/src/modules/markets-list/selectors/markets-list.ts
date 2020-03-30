import { createSelector } from 'reselect';
import { selectMarketsListsState } from 'appStore/select-state';
import {
  POPULAR_CATEGORIES,
  POPULAR_CATEGORIES_ICONS,
  REPORTING_STATE,
} from 'modules/common/constants';
import { selectMarkets } from 'modules/markets/selectors/markets-all';
import marketsList from '../reducers/markets-list';

export const selectPopularCategories = createSelector(
  selectMarketsListsState,
  marketLists => {
    if (!marketLists.isSearching && marketLists.meta) {
      const categories = Object.keys(marketLists.meta.categories).map(
        category => category.toLowerCase()
      );

      const mapObject = (category, idx) => {
        const item = Object.keys(marketLists.meta.categories).find(
          c => c.toLowerCase() === category
        );
        return {
          category,
          icon: POPULAR_CATEGORIES_ICONS[idx],
          count: marketLists.meta.categories[item].count,
          children: marketLists.meta.categories[item].children,
        };
      };

      const popularCategories = categories
        .filter(category => POPULAR_CATEGORIES.includes(category))
        .map(mapObject);

      return POPULAR_CATEGORIES.filter(category =>
        marketLists.isSearchInPlace ? categories.includes(category) : true
      )
        .map((category, idx) => {
          const isCategoryWithResults = popularCategories.find(
            meta => meta.category === category
          );

          if (isCategoryWithResults) {
            return isCategoryWithResults;
          }

          return {
            category,
            icon: POPULAR_CATEGORIES_ICONS[idx],
            count: 0,
            children: null,
          };
        })
        .sort((a, b) => (a.count > b.count ? -1 : 1));
    } else {
      return POPULAR_CATEGORIES.map((category, idx) => {
        return {
          category,
          icon: POPULAR_CATEGORIES_ICONS[idx],
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
