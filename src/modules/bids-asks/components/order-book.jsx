import { React, PropTypes } from 'react';
import { Clickable } from '../../common/components/clickable';
import ValueDenomination from '../../common/components/value-denomination';

const OrderBook = (props) => {
	const p = this.props;
	return (
		<div className="order-book">
			<div className="bids">
				<h5>Bids</h5>
				{p.bids.map((bid, i) => (
					<article key={bid.price.full} className="bid-ask bid">
						<Clickable
							onClick={() => { p.updateTradeOrder(p.outcome.id, bid.shares.value, bid.price.value, 'ask'); }}
						>
							<ValueDenomination className="shares" {...bid.shares} />
						</Clickable>
						<Clickable onClick={() => { p.updateTradeOrder(p.outcome.id, 0, bid.price.value); }}>
							<ValueDenomination className="price" {...bid.price} />
						</Clickable>
					</article>
				))}
				{!p.bids.length &&
					<article className="bid-ask ask">
						<ValueDenomination className="price" />
						<ValueDenomination className="shares" formatted="-" />
					</article>
				}
			</div>
			<div className="asks">
				<h5>Asks</h5>
				{p.asks.map((ask, i) => (
					<article key={ask.price.full} className="bid-ask ask">
						<Clickable onClick={() => { p.updateTradeOrder(p.outcome.id, 0, ask.price.value); }}>
							<ValueDenomination className="price" {...ask.price} />
						</Clickable>
						<Clickable
							onClick={() => { p.updateTradeOrder(p.outcome.id, ask.shares.value, ask.price.value, 'bid'); }}
						>
							<ValueDenomination className="shares" {...ask.shares} />
						</Clickable>
					</article>
				))}
				{!p.asks.length &&
					<article className="bid-ask ask">
						<ValueDenomination className="price" formatted="-" />
						<ValueDenomination className="shares" />
					</article>
				}
			</div>
		</div>
	);
};

OrderBook.propTypes = {
	outcome: PropTypes.object,
	updateTradeOrder: PropTypes.func,
	bids: PropTypes.array,
	asks: PropTypes.array
};

export default OrderBook;
