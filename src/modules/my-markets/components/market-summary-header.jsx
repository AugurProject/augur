import React, { PropTypes } from 'react';
import ValueDenomination from '../../common/components/value-denomination';

const PositionsSummary = (p) => (
	<div className={p.className}>
		<span>Summary</span>
		{!!p.fees &&
			<ValueDenomination {...p.fees} />
		}
	</div>
);

PositionsSummary.propTypes = {
	className: PropTypes.string.isRequired,
	fees: PropTypes.object.isRequired
};

export default PositionsSummary;
