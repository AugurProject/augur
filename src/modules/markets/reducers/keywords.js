import { UPDATE_KEYWORDS } from '../../markets/actions/update-keywords';

export default function(keywords = '', action) {
    switch (action.type) {
        case UPDATE_KEYWORDS:
            return action.keywords;

        default:
            return keywords;
    }
}