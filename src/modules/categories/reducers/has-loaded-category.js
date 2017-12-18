import { UPDATE_HAS_LOADED_TOPIC } from 'modules/categories/actions/update-has-loaded-category'

export default function (hasLoadedTopic = {}, action) {
  switch (action.type) {
    case UPDATE_HAS_LOADED_TOPIC:
      return ({
        ...hasLoadedTopic,
        ...action.hasLoadedTopic
      })
    default:
      return hasLoadedTopic
  }
}
