import React, { PropTypes } from 'react';
import ValueDenomination from '../../common/components/value-denomination';

const MyMarketsSummary = p => (
	<div className={p.className}>
		<span>My Markets</span>
		{!!p.fees &&
			<ValueDenomination {...p.fees} />
		}
	</div>
);

MyMarketsSummary.propTypes = {
	className: PropTypes.string.isRequired,
	fees: PropTypes.object.isRequired
};

export default MyMarketsSummary;
