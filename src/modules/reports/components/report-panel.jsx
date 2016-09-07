import React from 'react';
import classnames from 'classnames';
import ReportForm from '../../reports/components/report-form';

const ReportPanel = (p) => (
	<section className={classnames('report-panel', p.className)}>
		<span className="num-total-reports">{p.numPendingReports}</span>
		<ReportForm
			{...p}
			isReported={p.isReported || p.isReportSubmitted}
			onClickSubmit={p.onSubmitReport}
		/>
	</section>
);

ReportPanel.propTypes = {
	type: React.PropTypes.string,
	minValue: React.PropTypes.string,
	maxValue: React.PropTypes.string,
	className: React.PropTypes.string,
	numPendingReports: React.PropTypes.number,
	outcomes: React.PropTypes.array,
	reportedOutcomeID: React.PropTypes.any,
	isIndeterminate: React.PropTypes.bool,
	isUnethical: React.PropTypes.bool,
	isReported: React.PropTypes.bool,
	isReportSubmitted: React.PropTypes.bool,
	onSubmitReport: React.PropTypes.func
};

export default ReportPanel;
