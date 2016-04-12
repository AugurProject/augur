import React from 'react';
import shouldComponentUpdatePure from '../../../utils/should-component-update-pure';

import SiteHeader from '../../app/components/site-header';
import ReportPanel from '../../reports/components/report-panel';

module.exports = React.createClass({
	propTypes: {
		className: React.PropTypes.string,
		siteHeader: React.PropTypes.object,
		market: React.PropTypes.object,
		report: React.PropTypes.object,
		numTotalReports: React.PropTypes.number,
		submitReportHandler: React.PropTypes.func
	},

	shouldComponentUpdate: shouldComponentUpdatePure,

	render: function() {
		var p = this.props;
		return (
	        <main className="page market-report">
	            <SiteHeader { ...p.siteHeader } />

				{/*
				<header className="page-header">
					<span className="big-line">Report results and earn fees</span>.
					When a market expires the final outcome needs to be recorded so
					that it can be liquidated and closed.
					<b><i>Users with REP</i></b>, have the privelage, and duty, to report on expired markets.
					The better they report, the more REP they will get, and the more fees they will earn.
				</header>
				*/}

	            <ReportPanel className="report-panel"
	            	{ ...p.market }
	            	{ ...p.report }
	            	numTotalReports={ p.numTotalReports }
	            	onClickSubmit={ p.submitReportHandler } />
	        </main>
		);
	}
});