export const UPDATE_HAS_LOADED_TOPIC = 'UPDATE_HAS_LOADED_TOPIC';

export function updateHasLoadedTopic(hasLoadedTopic) {
  return ({ type: UPDATE_HAS_LOADED_TOPIC, hasLoadedTopic });
}
