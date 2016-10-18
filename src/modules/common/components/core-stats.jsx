import React, { PropTypes } from 'react';
import ValueDenomination from '../../common/components/value-denomination';

const CoreStats = p => (
	<article className={`core-stats ${p.className || ''}`}>
		{p.coreStats && p.coreStats.map((statGroup, i) => (
			<div
				key={i}
				className="core-stats-group"
			>
				{Object.keys(p.coreStats[i]).map(stat => (
					<div
						key={stat}
						className="core-stat"
					>
						<span className="core-stat-label">{p.coreStats[i][stat].label}:</span>
						<ValueDenomination {...p.coreStats[i][stat].value} />
					</div>
				))}
			</div>
		))}
	</article>
);

CoreStats.propTypes = {
	coreStats: PropTypes.array
};

export default CoreStats;
