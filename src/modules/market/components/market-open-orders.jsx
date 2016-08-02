import React from 'react';

import OpenOrdersGroup from '../../open-orders/components/open-orders-group';
import ValueDenomination from '../../common/components/value-denomination';

const OpenOrders = (p) => (
	<div className="market-open-orders">
		{!!p.userOpenOrdersSummary && !!p.userOpenOrdersSummary.openOrdersCount && p.userOpenOrdersSummary.openOrdersCount.value > 0 &&
			<div className="market-section-header">
				<ValueDenomination {...p.userOpenOrdersSummary.openOrdersCount} />
			</div>
		}

		<div className="open-orders-list">
			{
				p.outcomes.map(outcome => (
					<OpenOrdersGroup
						key={outcome.id}
						id={outcome.id}
						name={outcome.name}
						userOpenOrders={outcome.userOpenOrders}
						orderCancellation={p.orderCancellation}
					/>
				))
			}
		</div>
	</div>
);

OpenOrders.propTypes = {
	userOpenOrdersSummary: React.PropTypes.object,
	outcomes: React.PropTypes.array,
	orderCancellation: React.PropTypes.object.isRequired
};

export default OpenOrders;
