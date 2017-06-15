import { augur } from 'services/augurjs';
import { updateMarketTopic } from 'modules/markets/actions/update-markets-data';

export const UPDATE_TOPICS = 'UPDATE_TOPICS';
export const CLEAR_TOPICS = 'CLEAR_TOPICS';
export const UPDATE_TOPIC_POPULARITY = 'UPDATE_TOPIC_POPULARITY';

export const updateTopics = topics => ({ type: UPDATE_TOPICS, topics });
export const clearTopics = () => ({ type: CLEAR_TOPICS });
export const updateTopicPopularity = (topic, amount) => ({ type: UPDATE_TOPIC_POPULARITY, topic, amount });

export const updateMarketTopicPopularity = (marketID, amount) => (dispatch, getState) => {
  const market = getState().marketsData[marketID];
  if (market && market.topic !== undefined) {
    if (market.topic !== null) dispatch(updateTopicPopularity(market.topic, Number(amount)));
  } else {
    augur.api.Markets.returnTags({ market: marketID }, (tags) => {
      if (tags && tags.constructor === Array && tags.length && tags[0] !== null) {
        const topic = augur.format.tag.decodeTag(tags[0]);
        dispatch(updateTopicPopularity(topic, Number(amount)));
        dispatch(updateMarketTopic(marketID, topic));
      }
    });
  }
};
