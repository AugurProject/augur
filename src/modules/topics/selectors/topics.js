import memoizerific from 'memoizerific';

import store from 'src/store';

import { selectTopicLink } from 'modules/link/selectors/links';

export default function () {
  const { topics } = store.getState();
  return {
    topics: selectTopics(topics),
    selectTopic: (topic) => {
      selectTopicLink(topic, store.dispatch).onClick();
    }
  };
}

export const selectTopics = memoizerific(1)(topics => (
  Object.keys(topics || {}).map(topic => ({ topic, popularity: topics[topic] })).sort(popularityDifference)
));

export const popularityDifference = (topic1, topic2) => topic2.popularity - topic1.popularity;
