import React from 'react';
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
	className: React.PropTypes.string
};

export default PositionsSummary;
