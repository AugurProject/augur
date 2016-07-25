/*
 * Author: priecint
 */

import React from 'react';

const OpenOrdersSummary = (p) => {
	const hasOpenOrders = p.userOpenOrdersSummary != null && p.userOpenOrdersSummary.openOrdersCount > 0;
	return (
		<div className="market-section-header">
			{
				hasOpenOrders ? `${p.userOpenOrdersSummary.openOrdersCount} Open Orders` : 'No Open Orders'
			}
		</div>
	);
};

OpenOrdersSummary.propTypes = {
	userOpenOrdersSummary: React.PropTypes.object
};

export default OpenOrdersSummary;
