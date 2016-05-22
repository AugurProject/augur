import { SHOW_LINK } from '../../link/actions/show-link';
import { TOGGLE_TAG } from '../../markets/actions/toggle-tag';
import { TAGS_PARAM_NAME } from '../../link/constants/param-names';

export default function(selectedTags = {}, action) {
    switch (action.type) {
        case TOGGLE_TAG:
            let newSelectedTags = {
                ...selectedTags
            };
            if (newSelectedTags[action.filterID]) {
                delete newSelectedTags[action.filterID];
            }
            else {
                newSelectedTags[action.filterID] = true;
            }
            return newSelectedTags;

        case SHOW_LINK:
            if (!action.parsedURL.searchParams[TAGS_PARAM_NAME]) {
                return {};
            }
            return action.parsedURL.searchParams[TAGS_PARAM_NAME].split(',').reduce((p, param) => {
                p[param] = true;
                return p;
            }, { ...selectedTags });

        default:
            return selectedTags;
    }
}