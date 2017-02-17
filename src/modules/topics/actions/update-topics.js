export const UPDATE_TOPICS = 'UPDATE_TOPICS';
export const CLEAR_TOPICS = 'CLEAR_TOPICS';
export const UPDATE_TOPIC_POPULARITY = 'UPDATE_TOPIC_POPULARITY';

export const updateTopics = topics => ({ type: UPDATE_TOPICS, topics });
export const clearTopics = () => ({ type: CLEAR_TOPICS });
export const updateTopicPopularity = (topic, amount) => ({ type: UPDATE_TOPIC_POPULARITY, topic, amount });

export const updateMarketTopicPopularity = (marketID, amount) => (dispatch, getState) => {
  const market = getState().marketsData[marketID];
  if (market && market.tags && market.tags.length) {
    dispatch(updateTopicPopularity(market.tags[0], Number(amount)));
  }
};
