export const UPDATE_TOPICS = 'UPDATE_TOPICS';
export const CLEAR_TOPICS = 'CLEAR_TOPICS';

export const updateTopics = topics => ({ type: UPDATE_TOPICS, topics });
export const clearTopics = () => ({ type: CLEAR_TOPICS });
