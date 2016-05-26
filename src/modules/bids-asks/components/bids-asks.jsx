import React from 'react';
import classnames from 'classnames';

import OrderBook from './order-book';

const OrderBooks = React.createClass({
	propTypes: {
		className: React.PropTypes.string,
		market: React.PropTypes.array
	},

	render: function () {
		var p = this.props;
		return (
			<div className={ p.className }>
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

module.exports = OrderBooks;