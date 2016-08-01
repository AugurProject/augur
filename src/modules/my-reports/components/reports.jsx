import React from 'react';

const MyReports = (p) => (
	<table className="full-width-table">
		<thead>
			<tr className="cells-bordered solid dark">
				<th className="no-cell-border"></th>
				<th>Outcome</th>
				<th>My Report</th>
				<th>Fees Earned</th>
				<th>Ended</th>
			</tr>
		</thead>
		{p.reports && p.reports.map((market, id) => (
			<tbody key={id} >
				<tr className="cells-bordered solid dark">
					<th className="cell-left-aligned">{market.description}</th>
					<td>{market.endDate.formatted}</td>
					<td>{market.fees.full}</td>
					<td>{market.volume.formatted}</td>
					<td>{market.numberOfTrades.formatted}</td>
				</tr>
			</tbody>
		))}
	</table>
);

MyReports.propTypes = {
	reports: React.PropTypes.array.isRequired
};

export default MyReports;
