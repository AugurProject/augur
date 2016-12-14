import { UPDATE_URL } from '../../link/actions/update-url';
import { TOGGLE_TAG } from '../../markets/actions/toggle-tag';
import { TAGS_PARAM_NAME } from '../../link/constants/param-names';

export default function (selectedTags = {}, action) {
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

		case UPDATE_URL:
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
