export const UPDATE_TOPICS = 'UPDATE_TOPICS';
export const CLEAR_TOPICS = 'CLEAR_TOPICS';
export const INCREASE_TOPIC_POPULARITY = 'INCREASE_TOPIC_POPULARITY';

export const updateTopics = topics => ({ type: UPDATE_TOPICS, topics });
export const clearTopics = () => ({ type: CLEAR_TOPICS });
export const increaseTopicPopularity = (topic, amount) => ({ type: INCREASE_TOPIC_POPULARITY, topic, amount });

export const increaseMarketTopicPopularity = (marketID, amount) => (dispatch, getState) => {
  const market = getState().marketsData[marketID];
  if (market && market.tags && market.tags.length) {
    dispatch(increaseTopicPopularity(market.tags[0], Number(amount)));
  }
};
