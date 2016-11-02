import React, { PropTypes } from 'react';
import { Line } from 'rc-progress';

const Branch = p => (
	<section className="branch-info">
		<Line
			percent={p.currentPeriodProgress}
			strokeWidth="1"
			strokeColor="#5c2634"
		/>
		<br />
		<span className="reporting-cycle-info">Reporting Cycle {p.reportPeriod} &middot; {Math.round(p.currentPeriodProgress)}% complete &middot; {p.phaseLabel} phase ends {p.phaseTimeRemaining}</span>
		<br />
		<span className="branch-description" title={p.id}>{p.description}</span> &middot; {p.periodLength} seconds per cycle
	</section>
);

Branch.propTypes = {
	className: PropTypes.string,
	description: PropTypes.string,
	id: PropTypes.string,
	periodLength: PropTypes.number,
	phaseLabel: PropTypes.string,
	phaseTimeRemaining: PropTypes.string,
	currentPeriodProgress: PropTypes.number
};

export default Branch;
