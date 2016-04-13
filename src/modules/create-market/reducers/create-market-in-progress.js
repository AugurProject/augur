import { UPDATE_MAKE_IN_PROGRESS, CLEAR_MAKE_IN_PROGRESS } from '../actions/create-market-actions';

export default function(createMarketInProgress = {}, action) {
    switch (action.type) {
        case UPDATE_MAKE_IN_PROGRESS:
            return {
                ...createMarketInProgress,
                ...action.data
            };

        case CLEAR_MAKE_IN_PROGRESS:
            return {};

        default:
            return createMarketInProgress;
    }
}