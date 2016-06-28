import React, { PropTypes } from 'react';
import classnames from 'classnames';
import ValueDenomination from '../../common/components/value-denomination';
import Input from '../../common/components/input';
import Dropdown from '../../common/components/dropdown';
import Clickable from '../../common/components/clickable';
import Collapse from '../../common/components/collapse';
import OrderBook from '../../bids-asks/components/order-book';

const TradePanelItem = (p) => {
	const isOutcomeActive = p.selectedOutcomeID === p.id;

	console.log('p -- ', p);

	return (
		<div className={classnames('trade-panel-item', p.className, { active: isOutcomeActive })}>
			<Clickable onClick={() => { p.updateSelectedOutcome(p.id); }}>
				<div className="trade-panel-item-content">
					<span className="outcome-name">{p.name}</span>

					<ValueDenomination className="last-price" {...p.lastPrice} />
					<Clickable onClick={() => { p.updateTradeOrder(p.id, undefined, p.topBid.value); }}>
						<ValueDenomination className="top-bid" {...p.topBid.shares} /> @ <ValueDenomination className="top-bid" {...p.topBid.price} />
					</Clickable>
					<Clickable onClick={() => { p.updateTradeOrder(p.id, undefined, p.topAsk.value); }}>
						<ValueDenomination className="top-ask" {...p.topAsk.shares} /> @ <ValueDenomination className="top-ask" {...p.topAsk.price} />
					</Clickable>

					<Dropdown
						selected={p.sideOptions.find(opt => opt.value === p.side)}
						options={p.sideOptions}
						onChange={(selectedOption) => { p.updateTradeOrder(p.id, undefined, undefined, selectedOption); }}
					/>

					<Input
						className="num-shares"
						type="text"
						value={p.numShares}
						isClearable={false}
						onChange={(value) => p.updateTradeOrder(p.id, parseFloat(value) || 0, undefined)}
					/>

					<Input
						className="limit-price"
						type="text"
						value={p.limitPrice}
						isClearable={false}
						onChange={(value) => p.updateTradeOrder(p.id, undefined, parseFloat(value) || 0)}
					/>

					<ValueDenomination className="fee-to-pay" {...p.feeToPay} />
					<ValueDenomination className="total-cost" {...p.profitLoss} />
				</div>
			</Clickable>
			<div>
				<Collapse isOpen={isOutcomeActive}>
					<OrderBook
						key={`order-book-${p.id}`}
						outcome={p}
						updateTradeOrder={p.trade.updateTradeOrder}
						bids={p.orderBook.bids}
						asks={p.orderBook.asks}
					/>
				</Collapse>
			</div>
		</div>
	);
};

TradePanelItem.propTypes = {
	className: PropTypes.string,
	name: PropTypes.string,
	numShares: PropTypes.number,
	limitPrice: PropTypes.number,
	sideOptions: PropTypes.array,
	lastPrice: PropTypes.object,
	topBid: PropTypes.object,
	topAsk: PropTypes.object,
	feeToPay: PropTypes.object,
	tradeSummary: PropTypes.object,
	sharesOwned: PropTypes.number,
	etherAvailable: PropTypes.number,
	updateTradeOrder: PropTypes.func
};

export default TradePanelItem;
