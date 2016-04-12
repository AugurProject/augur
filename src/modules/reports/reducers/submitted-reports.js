import { SUBMIT_REPORTS } from '../../reports/actions/reports-actions';

export default function(submittedReports = {}, action) {
    switch (action.type) {
        case SUBMIT_REPORTS:
            return {
            	...submittedReports,
            	...action.submittedReports
            };

        default:
            return submittedReports;
    }
}