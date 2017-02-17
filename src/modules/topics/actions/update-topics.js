import { loadMarketsInfo } from '../../markets/actions/load-markets-info';

export const UPDATE_TOPICS = 'UPDATE_TOPICS';
export const CLEAR_TOPICS = 'CLEAR_TOPICS';
export const UPDATE_TOPIC_POPULARITY = 'UPDATE_TOPIC_POPULARITY';

export const updateTopics = topics => ({ type: UPDATE_TOPICS, topics });
export const clearTopics = () => ({ type: CLEAR_TOPICS });
export const updateTopicPopularity = (topic, amount) => ({ type: UPDATE_TOPIC_POPULARITY, topic, amount });

export const updateMarketTopicPopularity = (marketID, amount, isRetry) => (dispatch, getState) => {
  console.debug('updateMarketTopicPopularity:', marketID, amount, isRetry);
  const market = getState().marketsData[marketID];
  if (market && market.tags && market.tags.length) {
    if (market.tags[0] !== null) dispatch(updateTopicPopularity(market.tags[0], Number(amount)));
  } else {
    if (isRetry) return console.error('couldn\'t get topic for market', marketID);
    if (market && market.isLoading) {
      setTimeout(() => dispatch(updateMarketTopicPopularity(marketID, amount, true)), 3000); // eek ugly
    } else {
      dispatch(loadMarketsInfo([marketID], () => dispatch(updateMarketTopicPopularity(marketID, amount, true))));
    }
  }
};
