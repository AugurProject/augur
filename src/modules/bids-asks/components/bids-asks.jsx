import React from 'react';
import OrderBook from 'modules/bids-asks/components/order-book';

const BidsAsks = p => (
	<div className="bids-asks">
		{
			p.market.outcomes.map(outcome =>
				(
					<OrderBook
						key={`order-book-${outcome.id}`}
						outcome={outcome}
						bids={outcome.orderBook.bids}
						asks={outcome.orderBook.asks}
					/>
				)
			)
		}
	</div>
);

// TODO -- Prop Validations
// BidsAsks.propTypes = {
// 	market: PropTypes.object
// };

export default BidsAsks;
