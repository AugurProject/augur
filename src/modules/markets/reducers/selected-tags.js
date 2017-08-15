import { TOGGLE_TAG } from 'modules/markets/actions/toggle-tag';

export default function (selectedTags = {}, action) {
  // console.log('action -- ', action);
  let newSelectedTags;
  switch (action.type) {
    case TOGGLE_TAG:
      newSelectedTags = {
        ...selectedTags
      };
      if (newSelectedTags[action.filterID]) {
        delete newSelectedTags[action.filterID];
      } else {
        newSelectedTags[action.filterID] = true;
      }
      return newSelectedTags;
    default:
      return selectedTags;
  }
}
