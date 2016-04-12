import React from 'react';
import classnames from 'classnames';

import Basics from '../../markets/components/basics';
import ReportForm from '../../reports/components/report-form';

module.exports = React.createClass({
	propTypes: {
		className: React.PropTypes.string,
		report: React.PropTypes.object,
		numTotalReports: React.PropTypes.number,
		isReported: React.PropTypes.bool,
		isReportSubmitted: React.PropTypes.bool,
		onClickSubmit: React.PropTypes.func
	},

	render: function() {
		var p = this.props;
		return (
			<article className={ p.className }>
				<header className="page-header">
					<Basics { ...p } />
					<span className="num-total-reports">{ p.numTotalReports }</span>
				</header>

				<ReportForm
					{...p }
					isReported={ p.isReported || p.isReportSubmitted }
					onClickSubmit={ p.onClickSubmit } />
			</article>
		);
	}
});