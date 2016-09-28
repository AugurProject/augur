import React from 'react';

import OpenOrdersGroup from '../../open-orders/components/open-orders-group';
import ValueDenomination from '../../common/components/value-denomination';

const OpenOrders = (p) => (
	<div className="market-open-orders">
		<div className="market-section-header">
			<ValueDenomination {...p.userOpenOrdersSummary.openOrdersCount} />
		</div>

		<div className="open-orders-list">
			<table className="open-orders-group">
				{
					p.outcomes.map((outcome, index) => (
						<OpenOrdersGroup
							key={outcome.id}
							isFirst={index === 0}
							id={outcome.id}
							name={outcome.name}
							userOpenOrders={outcome.userOpenOrders}
							orderCancellation={p.orderCancellation}
						/>
					))
				}
			</table>
		</div>
	</div>
);

OpenOrders.propTypes = {
	userOpenOrdersSummary: React.PropTypes.object,
	outcomes: React.PropTypes.array,
	orderCancellation: React.PropTypes.object.isRequired
};

export default OpenOrders;
