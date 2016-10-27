import React, { PropTypes } from 'react';
import ValueDenomination from 'modules/common/components/value-denomination';

const CoreStats = p => (
	<article className="core-stats" >
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
						<span
							className="core-stat-label"
							data-tip={p.coreStats[i][stat].title}
						>
							{p.coreStats[i][stat].label}:
						</span>
						{p.coreStats[i][stat].value && p.coreStats[i][stat].value.value ?
							<ValueDenomination
								className={`${p.coreStats[i][stat].colorize ? 'colorize' : ''}`}
								{...p.coreStats[i][stat].value}
							/> :
							<span className="core-stat-value">—</span>
						}

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
