import { createSelector } from 'reselect';
import { selectMarketsListsState } from 'store/select-state';
import { POPULAR_CATEGORIES } from 'modules/common/constants';

export const selectPopularCategories = createSelector(
  selectMarketsListsState,
  (marketLists) => {
    if (!marketLists.isSearching && marketLists.meta) {

      const categories = Object.keys(marketLists.meta.categories).map(category => category.toUpperCase());
      const mapObject = (category) => {
        const item = Object.keys(marketLists.meta.categories).find(c => c.toUpperCase() === category)
        return {
          category,
          count: marketLists.meta.categories[item].count,
          children: marketLists.meta.categories[item].children,
        };
      };

      const popularCategories = categories
        .filter(category => POPULAR_CATEGORIES
        .includes(category))
        .map(mapObject);

      return POPULAR_CATEGORIES.map(category => {
        const isCategoryWithResults = popularCategories.find(meta => meta.category === category);

        if (isCategoryWithResults) {
          return isCategoryWithResults;
        }

        return {
          category,
          count: 0,
          children: null,
        };
      })
      .sort((a, b) => a.count > b.count ? -1 : 1);
    }
    else {
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
  (marketLists) => {
    if (!marketLists || !marketLists.meta) return null;

    const categories = Object.keys(marketLists.meta.categories).map(category => category.toUpperCase());
    const mapObject = (category) => {
      return {
        category,
        count: marketLists.meta.categories[category].count,
        children: marketLists.meta.categories[category].children,
      };
    };

    if (categories && categories.length > 0) {
      const allOtherCategories = categories
        .filter(category => !POPULAR_CATEGORIES
        .includes(category))
        .map(mapObject)
        .sort((a, b) => a.count > b.count ? -1 : 1);

      return allOtherCategories;
    }
    return null;
  }
);
