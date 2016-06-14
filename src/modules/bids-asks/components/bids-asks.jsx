import React from 'react';

import OrderBook from './order-book';

const BidsAsks = React.createClass({
	propTypes: {
		market: React.PropTypes.object
	},

	render: function () {
		var p = this.props;
		return (
			<div className="bids-asks">
				{
					p.market.outcomes.map(outcome => {
						return (
							<OrderBook
								key={`order-book-${outcome.id}`}
								outcome={ outcome }
								updateTradeOrder={ outcome.trade.updateTradeOrder }
								bids={ outcome.orderBook.bids }
								asks={ outcome.orderBook.asks }
							/>
						)
					})
				}
			</div>
		);
	}
});

module.exports = BidsAsks;