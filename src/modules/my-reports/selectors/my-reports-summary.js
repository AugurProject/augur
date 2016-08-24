import selectMyReports from '../../my-reports/selectors/my-reports';

export default function () {
	const reports = selectMyReports();

	const numReports = reports.length;
	const netRep = reports.reduce((prevNet, report) => prevNet + report.repEarned.value, 0);

	return {
		numReports,
		netRep
	};
}
