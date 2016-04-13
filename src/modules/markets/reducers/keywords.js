import { UPDATE_KEYWORDS } from '../actions/markets-actions';

export default function(keywords = '', action) {
    switch (action.type) {
        case UPDATE_KEYWORDS:
            return action.keywords;

        default:
            return keywords;
    }
}