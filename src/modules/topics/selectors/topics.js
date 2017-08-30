import { createSelector } from 'reselect'
import store from 'src/store'
import { selectTopicsState } from 'src/select-state'

export default function () {
  return selectTopics(store.getState())
}

export const selectTopics = createSelector(
  selectTopicsState,
  topics => Object.keys(topics || {})
    .map(topic => ({ topic, popularity: topics[topic] }))
    .sort(popularityDifference)
)

const popularityDifference = (topic1, topic2) => topic2.popularity - topic1.popularity
