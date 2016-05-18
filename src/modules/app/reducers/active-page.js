import { SHOW_LINK } from '../../link/actions/show-link';
import { DEFAULT_PAGE } from '../../app/constants/pages';
import { PATHS_PAGES, PATHS_AUTH } from '../../link/constants/paths';

export default function(activePage = DEFAULT_PAGE, action) {
    switch (action.type) {
        case SHOW_LINK:
            return PATHS_PAGES[action.parsedURL.pathArray[0]] || DEFAULT_PAGE;

        default:
            return activePage;
    }
}
