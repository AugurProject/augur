/*
 * Author: priecint
 */

import React from 'react';
import ValueDenomination from '../../common/components/value-denomination';

const OpenOrdersSummary = (p) => {
	const hasOpenOrders = p.userOpenOrdersSummary != null && p.userOpenOrdersSummary.openOrdersCount != null && p.userOpenOrdersSummary.openOrdersCount.value > 0;
	return (
		<div className="market-section-header">
			{
				hasOpenOrders ? (<ValueDenomination {...p.userOpenOrdersSummary.openOrdersCount} />) : 'No Open Orders'
			}
		</div>
	);
};

OpenOrdersSummary.propTypes = {
	userOpenOrdersSummary: React.PropTypes.object
};

export default OpenOrdersSummary;
