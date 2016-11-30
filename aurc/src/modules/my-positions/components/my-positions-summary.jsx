import React from 'react';
import classnames from 'classnames';

const PositionsSummary = p => (
	<div className={classnames('positions-summary', p.className)}>
		{!!p.numPositions &&
			<span className="num-positions">Positions</span>
		}
	</div>
);

PositionsSummary.propTypes = {
	className: React.PropTypes.string
};

export default PositionsSummary;
