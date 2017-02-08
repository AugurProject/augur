import memoizerific from 'memoizerific';
import store from '../../../store';

export default function () {
  const { topics } = store.getState();
  return selectTopics(topics);
}

export const selectTopics = memoizerific(1)(topics => (
  Object.keys(topics || {}).map(topic => ({ topic, popularity: topics[topic] })).sort(popularityDifference)
));

export const popularityDifference = (topic1, topic2) => topic2.popularity - topic1.popularity;
