import { UPDATE_RECENTLY_EXPIRED_EVENTS } from '../../reports/actions/reports-actions';

export default function(recentlyExpiredEvents = {}, action) {
    switch (action.type) {
        case UPDATE_RECENTLY_EXPIRED_EVENTS:
            return {
            	...recentlyExpiredEvents,
            	...action.recentlyExpiredEvents
            };

        default:
            return recentlyExpiredEvents;
    }
}