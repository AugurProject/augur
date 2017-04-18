import { createBigCacheSelector } from 'utils/big-cache-selector';
import store from 'src/store';
import { selectKeywordsState, selectSelectedFilterSortState, selectSelectedTagsState, selectSelectedTopicState, selectBranchReportPeriod } from 'src/select-state';
import selectAllMarkets from '../../markets/selectors/markets-all';
import { cleanKeywordsArray } from '../../../utils/clean-keywords';
import { FILTER_TYPE_OPEN, FILTER_TYPE_CLOSED, FILTER_TYPE_REPORTING } from '../../markets/constants/filter-sort';
import { isMarketDataOpen } from '../../../utils/is-market-data-open';

export default function () {
  return selectFilteredMarkets(store.getState());
}

export const selectFilteredMarkets = createBigCacheSelector(3)(
  selectAllMarkets,
  selectKeywordsState,
  selectSelectedTagsState,
  selectSelectedTopicState,
  selectSelectedFilterSortState,
  selectBranchReportPeriod,
  (markets, keywords, selectedTags, selectedTopic, selectedFilterSort, reportPeriod) => (
    markets.filter(market => isMarketFiltersMatch(
      market,
      keywords,
      selectedFilterSort,
      selectedTags,
      selectedTopic,
      reportPeriod
    ))
  )
);

export const isMarketFiltersMatch = (market, keywords, selectedFilterSort, selectedTags, selectedTopic, reportPeriod) => {

  const selectedTagsList = Object.keys(selectedTags);
  return isMatchKeywords(market, keywords) &&
    isMatchTags(market, selectedTagsList) &&
    isOfType(market, selectedFilterSort.type) &&
    isMatchTopic(market, selectedTopic) &&
    isDisplayable(market);

  function isMatchKeywords(market, keys) {
    const keywordsArray = cleanKeywordsArray(keys);
    if (!keywordsArray.length) {
      return true;
    }
    return keywordsArray.every(keyword => (
      market.description.toLowerCase().indexOf(keyword) >= 0 ||
      market.outcomes.some(outcome => outcome.name && outcome.name.indexOf(keyword) >= 0) ||
      market.tags.some(tag => tag.name.indexOf(keyword) >= 0)
    ));
  }

  function isOfType(market, type) {
    switch (type) {
      case (FILTER_TYPE_CLOSED):
        return !isMarketDataOpen(market);
      case (FILTER_TYPE_REPORTING):
        return market.tradingPeriod === reportPeriod;
      case (FILTER_TYPE_OPEN):
      default:
        return isMarketDataOpen(market);
    }
  }

  function isMatchTags(market, selectedTagsList) {
    if (!selectedTagsList.length) {
      return true;
    }
    return selectedTagsList.every(tag => market.tags.some(marketTag => marketTag.name === tag));
  }

  function isMatchTopic(market, selectedTopic) {
    if (!selectedTopic) {
      return true;
    }

    return market.tags.length && market.tags[0].name === selectedTopic;
  }

  function isDisplayable(market) {
    if (!market.isMalFormed && !market.isRequiredToReportByAccount) {
      return true;
    }
  }
};
