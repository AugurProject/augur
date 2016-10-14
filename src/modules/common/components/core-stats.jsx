import React, { PropTypes } from 'react';

const CoreStats = p => (
	<div className="core-stats">
		<div className="core-stats-content">
			<span>{p.coreStats.rep}</span>
			<span>{p.coreStats.eth}</span>
		</div>
	</div>
);

CoreStats.propTypes = {
	coreStats: PropTypes.shape({
		rep: PropTypes.number,
		eth: PropTypes.number
	})
};

export default CoreStats;
