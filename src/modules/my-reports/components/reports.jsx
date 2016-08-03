import React from 'react';

const MyReports = (p) => (
	<table className="full-width-table">
		<thead>
			<tr className="cells-bordered solid dark">
				<th className="no-cell-border"></th>
				<th>Outcome</th>
				<th>My Report</th>
				<th>Fees Earned</th>
				<th>Rep Earned</th>
				<th>Ended</th>
				<th className="no-cell-border"></th>
			</tr>
		</thead>
		{p.reports && p.reports.map((report, id) => (
			<tbody key={id} >
				<tr className="cells-bordered solid dark">
					<th className="cell-left-aligned">{report.description}</th>
					<td>{report.outcome}{report.outcomePercentage.full}</td>
					<td>{report.reported}{report.isReportEqual}</td>
					<td>{report.feesEarned.full}</td>
					<td>{report.repEarned.full}</td>
					<td>{report.endDate.formatted}</td>
					<td className="no-cell-border">{report.isChallengeable}</td>
				</tr>
			</tbody>
		))}
	</table>
);

MyReports.propTypes = {
	reports: React.PropTypes.array.isRequired
};

export default MyReports;
