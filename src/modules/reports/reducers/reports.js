import { UPDATE_REPORTS, CLEAR_REPORTS } from '../../reports/actions/update-reports';

/*
Keys are eventID, values can be:
   - { reportHash: null }: user is required to report and has not yet reported
   - { reportHash: true }: report sent, but not yet confirmed
   - { reportHash: xyz... }: report submitted and confirmed
*/
export default function (reports = {}, action) {
	switch (action.type) {
	case UPDATE_REPORTS:
		return {
			...reports,
			...Object.keys(action.reports).reduce((p, eventID) => {
				p[eventID] = {
					...reports[eventID],
					...action.reports[eventID]
				};
				return p;
			}, {})
		};

	case CLEAR_REPORTS:
		return {};

	default:
		return reports;
	}
}
