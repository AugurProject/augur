import React from 'react';
import classnames from 'classnames';
import ValueDenomination from '../../../modules/common/components/value-denomination';
import Input from '../../../modules/common/components/input';
import Dropdown from '../../../modules/common/components/dropdown';
import Clickable from '../../../modules/common/components/clickable';

const TradePanelRowOutcome = (p) => (
	<tr
		className={classnames('trade-panel-row', 'clickable-row')}
		onClick={event => {
			event.stopPropagation();

			p.updateSelectedOutcome(p.outcome.id);
		}}
	>
		<th className="outcome-name">
			{p.outcome.name}
		</th>
		<td className="last-price">
			<ValueDenomination {...p.outcome.lastPrice} />
		</td>
		<td className="bid">
			{!!p.outcome.topBid &&
				<div>
					<Clickable onClick={() => { p.outcome.trade.updateTradeOrder(p.outcome.id, p.outcome.topBid.shares.value, p.outcome.topBid.price.value, p.constants.ASK); }} >
						<ValueDenomination className="top-bid" {...p.outcome.topBid.shares} />
					</Clickable>
					<span className="shares-at">@</span>
					<Clickable onClick={() => { p.outcome.trade.updateTradeOrder(p.outcome.id, undefined, p.outcome.topBid.price.value); }}>
						<ValueDenomination className="top-bid" {...p.outcome.topBid.price} />
					</Clickable>
				</div>
			}
		</td>
		<td className="ask">
			{!!p.outcome.topAsk &&
				<div>
					<Clickable onClick={() => { p.outcome.trade.updateTradeOrder(p.outcome.id, undefined, p.outcome.topAsk.price.value); }}>
						<ValueDenomination className="top-ask" {...p.outcome.topAsk.price} />
					</Clickable>
					<span className="shares-at">@</span>
					<Clickable onClick={() => { p.outcome.trade.updateTradeOrder(p.outcome.id, p.outcome.topAsk.shares.value, p.outcome.topAsk.price.value, p.constants.BID); }} >
						<ValueDenomination className="top-ask" {...p.outcome.topAsk.shares} />
					</Clickable>
				</div>
			}
		</td>

		<td>
			<Dropdown
				selected={p.sideOptions.find(opt => opt.value === p.outcome.trade.side)}
				options={p.sideOptions}
				onChange={(selectedOption) => { p.outcome.trade.updateTradeOrder(p.outcome.id, undefined, undefined, selectedOption); }}
			/>
		</td>
		<td>
			<Input
				className="num-shares"
				type="text"
				value={p.outcome.trade.numShares}
				isClearable={false}
				onChange={(value) => p.outcome.trade.updateTradeOrder(p.outcome.id, parseFloat(value) || 0, undefined)}
			/>
		</td>
		<td>
			<Input
				className="limit-price"
				type="text"
				value={p.outcome.trade.limitPrice}
				isClearable={false}
				onChange={(value) => p.outcome.trade.updateTradeOrder(p.outcome.id, undefined, parseFloat(value) || 0)}
			/>
		</td>
		<td className="fee-to-pay" >
			<ValueDenomination {...p.outcome.trade.tradeSummary.feeToPay} />
		</td>
		<td className="total-cost" >
			<ValueDenomination {...p.outcome.trade.tradeSummary.totalEther} />
		</td>
	</tr>
);

TradePanelRowOutcome.propTypes = {
	outcome: React.PropTypes.object,
	sideOptions: React.PropTypes.array,
	updateSelectedOutcome: React.PropTypes.func
};

export default TradePanelRowOutcome;
