import selectMyReports from '../../../modules/my-reports/selectors/my-reports';
import selectMyReportsSummary from '../../../modules/my-reports/selectors/my-reports-summary';

export default function () {
	const reports = selectMyReports();
	const summary = selectMyReportsSummary();

	return {
		reports,
		summary
	};
}
