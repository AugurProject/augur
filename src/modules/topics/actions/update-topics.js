import { augur } from '../../../services/augurjs';

export const UPDATE_TOPICS = 'UPDATE_TOPICS';
export const CLEAR_TOPICS = 'CLEAR_TOPICS';
export const UPDATE_TOPIC_POPULARITY = 'UPDATE_TOPIC_POPULARITY';

export const updateTopics = topics => ({ type: UPDATE_TOPICS, topics });
export const clearTopics = () => ({ type: CLEAR_TOPICS });
export const updateTopicPopularity = (topic, amount) => ({ type: UPDATE_TOPIC_POPULARITY, topic, amount });

export const updateMarketTopicPopularity = (marketID, amount) => (dispatch, getState) => {
  const market = getState().marketsData[marketID];
  if (market && market.tags && market.tags.length) {
    if (market.tags[0] !== null) dispatch(updateTopicPopularity(market.tags[0], Number(amount)));
  } else {
    augur.returnTags(marketID, (tags) => {
      if (tags && tags.constructor === Array && tags.length && tags[0] !== null) {
        dispatch(updateTopicPopularity(augur.decodeTag(tags[0]), Number(amount)));
      }
    });
  }
};
