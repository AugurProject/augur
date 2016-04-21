import { SHOW_LINK } from '../../link/actions/show-link';
import { M } from '../../app/constants/pages';
import { PATHS_PAGES } from '../../link/constants/paths';

export default function(selectedMarketID = null, action) {
    switch (action.type) {
        case SHOW_LINK:
            if ([M].indexOf(PATHS_PAGES[action.parsedURL.pathArray[0]]) >= 0 && action.parsedURL.pathArray[1]) {
                return action.parsedURL.pathArray[1].substring(1).split('_').pop();
            }
            return selectedMarketID;

        default:
            return selectedMarketID;
    }
}