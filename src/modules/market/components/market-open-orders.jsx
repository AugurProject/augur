import React from 'react';

import MarketOpenOrdersGroup from 'modules/market/components/market-open-orders-group';
import NullStateMessage from 'modules/common/components/null-state-message';

import { SCALAR } from 'modules/markets/constants/market-types';

import getValue from 'utils/get-value';

const MarketOpenOrders = (p) => {
	const userOpenOrders = getValue(p, 'outcomes.outcome.userOpenOrders');
	const nullMessage = 'No Current Open Orders';

	return (
		<article className="market-open-orders">
			{!userOpenOrders ?
				<NullStateMessage message={nullMessage} /> :
				<div>
					<div className="market-open-orders-header">
						<span>{!p.marketType === SCALAR ? 'Outcomes' : 'Outcome'}</span>
						<span>Type</span>
						<span>Shares</span>
						<span>Price</span>
						<span>Action</span>
					</div>
					{
						(p.outcomes || []).map((outcome, index) => {
							const lastPricePercent = getValue(outcome, 'lastPricePercent.rounded');

							return (
								<MarketOpenOrdersGroup
									key={outcome.name}
									id={outcome.id}
									name={outcome.name}
									marketType={p.marketType}
									lastPricePercent={lastPricePercent}
									userOpenOrders={outcome.userOpenOrders}
									orderCancellation={p.orderCancellation}
									selectedShareDenomination={p.selectedShareDenomination}
								/>
							);
						})
					}
				</div>
			}
		</article>
	);
};

// TODO -- Prop Validations
// OpenOrders.propTypes = {
// 	userOpenOrdersSummary: React.PropTypes.object,
// 	outcomes: React.PropTypes.array,
// 	orderCancellation: React.PropTypes.object.isRequired
// };

export default MarketOpenOrders;
