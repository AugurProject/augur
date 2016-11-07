import React, { PropTypes } from 'react';
import ReactTooltip from 'react-tooltip';
import { Line } from 'rc-progress';

const Branch = p => (
	<article className="branch-info">
		<Line
			percent={p.currentPeriodProgress}
			strokeWidth="1"
			strokeColor="#5c2634"
		/>
		<br />
		<span className="reporting-cycle-info">
			Reporting Cycle {p.reportPeriod} &middot; {Math.round(p.currentPeriodProgress)}% complete &middot; {p.phaseLabel} phase ends {p.phaseTimeRemaining}
		</span>
		<br />
		<span
			data-tip
			data-for="branch-id-tooltip"
			data-event="click focus"
			className="branch-description pointer"
		>
			{p.description}
		</span> &middot; {p.periodLength / 3600} hours per cycle
		<ReactTooltip
			id="branch-id-tooltip"
			type="light"
			effect="solid"
			place="top"
			globalEventOff="click"
		>
			<span className="tooltip-text">
				Branch ID: {p.id}
			</span>
		</ReactTooltip>
	</article>
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
