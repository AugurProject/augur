import React from 'react';
import classnames from 'classnames';
import ValueDenomination from '../../../modules/common/components/value-denomination';
import Clickable from '../../../modules/common/components/clickable';

const TradePanelRowOrder = (p) => (
	<tr className={classnames('trade-panel-row', { displayNone: !(p.selectedOutcomeID === p.outcome.id) })} >
		<td colSpan="2"></td>
		<td>
			{!!p.outcome.orderBook.bids[p.item] &&
			<div className="order-book-data bid">
				<Clickable
					onClick={event => {
						event.stopPropagation();

						p.outcome.trade.updateTradeOrder(p.outcome.id, p.outcome.orderBook.bids[p.item].shares.value, p.outcome.orderBook.bids[p.item].price.value, p.constants.ASK);
					}}
				>
					<ValueDenomination className="shares" {...p.outcome.orderBook.bids[p.item].shares} />
				</Clickable>
				<span className="shares-at">@</span>
				<Clickable
					onClick={event => {
						event.stopPropagation();

						p.outcome.trade.updateTradeOrder(p.outcome.id, undefined, p.outcome.orderBook.bids[p.item].price.value);
					}}
				>
					<ValueDenomination className="price" {...p.outcome.orderBook.bids[p.item].price} />
				</Clickable>
			</div>
			}
		</td>
		<td>
			{!!p.outcome.orderBook.asks[p.item] &&
			<div className="order-book-data ask" >
				<Clickable
					onClick={event => {
						event.stopPropagation();

						p.outcome.trade.updateTradeOrder(p.outcome.id, undefined, p.outcome.orderBook.asks[p.item].price.value);
					}}
				>
					<ValueDenomination className="price" {...p.outcome.orderBook.asks[p.item].price} />
				</Clickable>
				<span className="shares-at">@</span>
				<Clickable
					onClick={event => {
						event.stopPropagation();

						p.outcome.trade.updateTradeOrder(p.outcome.id, p.outcome.orderBook.asks[p.item].shares.value, p.outcome.orderBook.asks[p.item].price.value, p.constants.BID);
					}}
				>
					<ValueDenomination className="shares" {...p.outcome.orderBook.asks[p.item].shares} />
					<ValueDenomination className="shares" {...p.outcome.orderBook.asks[p.item].shares} />
				</Clickable>
			</div>
			}
		</td>
		<td colSpan="5"></td>
	</tr>
);

TradePanelRowOrder.propTypes = {
	outcomes: React.PropTypes.array,
	selectedOutcomeID: React.PropTypes.string,
	item: React.PropTypes.number
};

export default TradePanelRowOrder;