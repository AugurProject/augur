import { UPDATE_PENDING_REPORTS, CLEAR_PENDING_REPORTS } from '../../reports/actions/update-pending-reports';

/*
Keys are eventID, values can be:
   - { reportHash: null }: user is required to report and has not yet reported
   - { reportHash: true }: report sent, but not yet confirmed
   - { reportHash: xyz... }: report submitted and confirmed
*/
export default function(pendingReports = {}, action) {
    switch (action.type) {
        case UPDATE_PENDING_REPORTS:
            return {
            	...pendingReports,
            	...Object.keys(action.pendingReports).reduce((p, eventID) => {
            		p[eventID] = {
            			...pendingReports[eventID],
            			...action.pendingReports[eventID]
            		};
            		return p;
            	}, {})
            };

        case CLEAR_PENDING_REPORTS:
            return {};

        default:
            return pendingReports;
    }
}