import React from 'react';
import classnames from 'classnames';

import { BUY, SELL } from '../../trade/constants/types';

import TradeBuilderBidAsk from '../../../modules/trade/components/trade-builder-bid-ask';
import ValueDenomination from '../../../modules/common/components/value-denomination';
import Input from '../../../modules/common/components/input';

const TradeBuilderRow = (p) => {
	const bids = !p.showFullOrderBook ? p.orderBook.bids.slice(0, 1) : p.orderBook.bids;
	const asks = !p.showFullOrderBook ? p.orderBook.asks.slice(0, 1) : p.orderBook.asks;

	return (
		<tr className={classnames('trade-builder-row')}>
			<td className={classnames('outcome-name', { fade: p.isFaded })}>
				{p.name}
			</td>
			<td className={classnames('last-price', { fade: p.isFaded })}>
				<ValueDenomination {...p.lastPrice} />
			</td>
			<td className={classnames('bid', { fade: p.isFaded })}>
				{!!bids && bids.map((bid, i) => (
					<TradeBuilderBidAsk key={i} bidAsk={bid} />
				))}
			</td>
			<td className={classnames('ask', { fade: p.isFaded })}>
				{!!asks && asks.map((ask, i) => (
					<TradeBuilderBidAsk key={i} bidAsk={ask} />
				))}
			</td>

			<td className={classnames('buy-sell-toggle', { fade: p.isFaded && !p.trade.numShares })}>
				{!!p.trade && p.trade.side &&
					<div
						className={classnames('clickable', 'toggle', p.trade.side)}
						onClick={(e) => { e.stopPropagation(); p.trade.updateTradeOrder(undefined, undefined, p.trade.side === BUY ? SELL : BUY); p.updateSelectedOutcome(p.id); }}
					>
						{p.trade.side === BUY ? 'buy' : 'sell'}
					</div>
				}
			</td>
			<td className={classnames('num-shares', { fade: p.isFaded && !p.trade.numShares })}>
				<Input
					type="text"
					value={p.trade.numShares}
					isClearable={false}
					onChange={(value) => p.trade.updateTradeOrder(value, undefined, p.trade.side)}
					onClick={(e) => { e.stopPropagation(); p.updateSelectedOutcome(p.id); }}
				/>
			</td>
			<td className={classnames('limit-price', { fade: p.isFaded && !p.trade.numShares })}>
				<Input
					type="text"
					value={p.trade.limitPrice}
					isClearable={false}
					onChange={(value) => p.trade.updateTradeOrder(undefined, value, p.trade.side)}
					onClick={(e) => { e.stopPropagation(); p.updateSelectedOutcome(p.id); }}
				/>
			</td>
			<td className={classnames('fee-to-pay', { fade: p.isFaded && !p.trade.numShares })}>
				<ValueDenomination {...p.trade.tradeSummary.feeToPay} />
			</td>
			<td className={classnames('total-cost', { fade: p.isFaded && !p.trade.numShares })}>
				<ValueDenomination {...p.trade.tradeSummary.totalEther} />
			</td>
		</tr>
	);
};

TradeBuilderRow.propTypes = {
	name: React.PropTypes.string,
	lastPrice: React.PropTypes.object,
	id: React.PropTypes.string,
	trade: React.PropTypes.object,
	orderBook: React.PropTypes.object,
	isFaded: React.PropTypes.bool,
	showFullOrderBook: React.PropTypes.bool,
	updateSelectedOutcome: React.PropTypes.func
};

export default TradeBuilderRow;
