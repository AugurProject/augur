import React from 'react';
import classnames from 'classnames';

import { BUY, SELL } from '../../trade/constants/types';

import ValueDenomination from '../../../modules/common/components/value-denomination';
import Input from '../../../modules/common/components/input';

const TradePanelRowOutcome = (p) => (
	<tr className={classnames('trade-panel-row')}>
		<td className={classnames('outcome-name', { fade: p.selectedOutcomeID && p.selectedOutcomeID !== p.outcome.id })}>
			{p.outcome.name}
		</td>
		<td className={classnames('last-price', { fade: p.selectedOutcomeID && p.selectedOutcomeID !== p.outcome.id })}>
			<ValueDenomination {...p.outcome.lastPrice} />
		</td>
		<td className={classnames('bid', { fade: p.selectedOutcomeID && p.selectedOutcomeID !== p.outcome.id })}>
			{!!p.outcome.topBid &&
				<div className="order-book-data bid">
					<ValueDenomination className="shares" {...p.outcome.topBid.shares} denomination={undefined} />
					<span className="shares-at">@</span>
					<ValueDenomination className="price" {...p.outcome.topBid.price} />
				</div>
			}
		</td>
		<td className={classnames('ask', { fade: p.selectedOutcomeID && p.selectedOutcomeID !== p.outcome.id })}>
			{!!p.outcome.topAsk &&
				<div className="order-book-data ask">
					<ValueDenomination className="shares" {...p.outcome.topAsk.shares} denomination={undefined} />
					<span className="shares-at">@</span>
					<ValueDenomination className="price" {...p.outcome.topAsk.price} />
				</div>
			}
		</td>

		<td className={classnames('buy-sell-button', { fade: p.selectedOutcomeID && p.selectedOutcomeID !== p.outcome.id && !p.outcome.trade.numShares })}>
			{p.outcome.trade.side === BUY &&
				<span
					className="clickable buy-toggle"
					onClick={(selectedOption) => { p.outcome.trade.updateTradeOrder(p.outcome.id, undefined, undefined, SELL); p.updateSelectedOutcome(p.outcome.id) }}
				>
					Buy
				</span>
			}
			{p.outcome.trade.side === SELL &&
				<span
					className="clickable sell-toggle"
					onClick={(selectedOption) => { p.outcome.trade.updateTradeOrder(p.outcome.id, undefined, undefined, BUY); p.updateSelectedOutcome(p.outcome.id) }}
				>
					Sell
				</span>
			}
		</td>
		<td className={classnames('num-shares', { fade: p.selectedOutcomeID && p.selectedOutcomeID !== p.outcome.id && !p.outcome.trade.numShares })}>
			<Input
				type="text"
				value={p.outcome.trade.numShares}
				isClearable={false}
				onChange={(value) => p.outcome.trade.updateTradeOrder(p.outcome.id, parseFloat(value) || 0, undefined)}
				onFocus={() => p.updateSelectedOutcome(p.outcome.id)}
				onBlur={() => p.updateSelectedOutcome(null)}
			/>
		</td>
		<td className={classnames('limit-price', { fade: p.selectedOutcomeID && p.selectedOutcomeID !== p.outcome.id && !p.outcome.trade.numShares })}>
			<Input
				type="text"
				value={p.outcome.trade.limitPrice}
				isClearable={false}
				onChange={(value) => p.outcome.trade.updateTradeOrder(p.outcome.id, undefined, parseFloat(value) || 0)}
				onFocus={() => p.updateSelectedOutcome(p.outcome.id)}
				onBlur={() => p.updateSelectedOutcome(null)}
			/>
		</td>
		<td className={classnames('fee-to-pay', { fade: p.selectedOutcomeID && p.selectedOutcomeID !== p.outcome.id && !p.outcome.trade.numShares })}>
			<ValueDenomination {...p.outcome.trade.tradeSummary.feeToPay} />
		</td>
		<td className={classnames('total-cost', { fade: p.selectedOutcomeID && p.selectedOutcomeID !== p.outcome.id && !p.outcome.trade.numShares })}>
			<ValueDenomination {...p.outcome.trade.tradeSummary.totalEther} />
		</td>
	</tr>
);

TradePanelRowOutcome.propTypes = {
	outcome: React.PropTypes.object,
	selectedOutcomeID: React.PropTypes.string,
	updateSelectedOutcome: React.PropTypes.func
};

export default TradePanelRowOutcome;
