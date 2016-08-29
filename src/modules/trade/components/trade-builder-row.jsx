import React from 'react';
import classnames from 'classnames';

import TradeBuilderBidAsk from '../../../modules/trade/components/trade-builder-bid-ask';
import ValueDenomination from '../../../modules/common/components/value-denomination';
import Input from '../../../modules/common/components/input';
import Toggler from '../../../modules/common/components/toggler';

import { SCALAR } from '../../markets/constants/market-types';

const TradeBuilderRow = (p) => {
	const bids = !p.showFullOrderBook ? p.orderBook.bids.slice(0, 1) : p.orderBook.bids;
	const asks = !p.showFullOrderBook ? p.orderBook.asks.slice(0, 1) : p.orderBook.asks;

	return (
		<tr className={classnames('trade-builder-row')}>
			<td className={classnames('outcome-name', { fade: p.isFaded })}>
				{p.marketType !== SCALAR && <span>
					{p.name}
					<span>&nbsp;-&nbsp;</span>
				</span>}
				<ValueDenomination {...p.lastPricePercent} formatted={p.lastPricePercent.rounded} />
			</td>
			{p.trade.side === 'sell' &&
				<td className={classnames('bid', { fade: p.isFaded || (p.showFullOrderBook && p.trade.side === 'buy') })}>
					{!p.showFullOrderBook && !!p.topBid && !!p.topBid.price &&
						<ValueDenomination {...p.topBid.price} />
					}
					{!!p.showFullOrderBook && !!bids && bids.map((bid, i) => (
						<TradeBuilderBidAsk key={i} bidAsk={bid} />
					))}
				</td>
			}
			{p.trade.side === 'buy' &&
				<td className={classnames('ask', { fade: p.isFaded || (p.showFullOrderBook && p.trade.side === 'sell') })}>
					{!p.showFullOrderBook && !!p.topAsk && !!p.topAsk.price &&
						<ValueDenomination {...p.topAsk.price} />
					}
					{!!p.showFullOrderBook && !!asks && asks.map((ask, i) => (
						<TradeBuilderBidAsk key={i} bidAsk={ask} />
					))}
				</td>
			}
			<td className={classnames('buy-sell-toggler', { fade: p.isFaded && !p.trade.numShares })}>
				{!!p.trade && p.trade.side &&
					<Toggler
						className={p.trade.side}
						selected={p.trade.tradeTypeOptions.find(tradeTypeOption => tradeTypeOption.value === p.trade.side)}
						options={p.trade.tradeTypeOptions}
						onClick={(selectedOption, e) => { e.stopPropagation(); p.trade.updateTradeOrder(undefined, undefined, selectedOption.value); p.updateSelectedOutcome(p.id); }}
					/>
				}
			</td>
			<td className={classnames('num-shares', { fade: p.isFaded && !p.trade.numShares })}>
				<Input
					type="text"
					value={p.trade.numShares}
					onChange={(value) => p.trade.updateTradeOrder(value, undefined, p.trade.side)}
					onClick={(e) => { e.stopPropagation(); p.updateSelectedOutcome(p.id); }}
					onFocus={() => p.updateSelectedOutcome(p.id)}
				/>
			</td>
			<td className={classnames('limit-price', { fade: p.isFaded && !p.trade.numShares })}>
				<Input
					type="text"
					value={p.trade.limitPrice}
					onChange={(value) => p.trade.updateTradeOrder(undefined, value, p.trade.side)}
					onClick={(e) => { e.stopPropagation(); p.updateSelectedOutcome(p.id); }}
					onFocus={() => p.updateSelectedOutcome(p.id)}
				/>
			</td>
			<td className={classnames('fee-to-pay', { fade: p.isFaded && !p.trade.numShares })}>
				<ValueDenomination {...p.trade.totalFee} />
			</td>
			<td className={classnames('total-cost', { fade: p.isFaded && !p.trade.numShares })}>
				<ValueDenomination {...p.trade.totalCost} />
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
	updateSelectedOutcome: React.PropTypes.func,
	marketType: React.PropTypes.string
};

export default TradeBuilderRow;
