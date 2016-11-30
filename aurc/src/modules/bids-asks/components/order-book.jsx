import React from 'react';
import ValueDenomination from 'modules/common/components/value-denomination';

const OrderBook = p => (
	<div className="order-book">
		<div className="bids">
			{p.bids.map((bid, i) => {
				if (i !== 0) {
					return (
						<article key={bid.price.full} className="bid-ask bid">
							<ValueDenomination className="shares clickable" {...bid.shares} />
							<ValueDenomination className="price clickable" {...bid.price} />
						</article>
					);
				}
				return null;
			})}
			{!p.bids.length &&
				<article className="bid-ask ask">
					<ValueDenomination className="price" />
					<ValueDenomination className="shares" formatted="-" />
				</article>
			}
		</div>
		<div className="asks">
			{p.asks.map((ask, i) => {
				if (i !== 0) {
					return (
						<article key={ask.price.full} className="bid-ask ask">
							<ValueDenomination className="price clickable" {...ask.price} />
							<ValueDenomination className="shares clickable" {...ask.shares} />
						</article>
					);
				}
				return null;
			})}
			{!p.asks.length &&
				<article className="bid-ask ask">
					<ValueDenomination className="price" formatted="-" />
					<ValueDenomination className="shares" />
				</article>
			}
		</div>
	</div>
);

// TODO -- Prop Validations
// OrderBook.propTypes = {
// 	outcome: PropTypes.object,
// 	bids: PropTypes.array,
// 	asks: PropTypes.array
// };

export default OrderBook;
