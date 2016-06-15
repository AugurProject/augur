import React from 'react';
import classnames from 'classnames';
import ValueDenomination from '../../common/components/value-denomination';
import Input from '../../common/components/input';
import Dropdown from '../../common/components/dropdown';
import { Clickable } from '../../common/components/clickable';

const TradePanelItem = (props) => {
	const p = this.props;
	return (
		<div className={classnames('trade-panel-item', p.className)}>

			<span className="outcome-name">{p.name}</span>

			<ValueDenomination className="last-price" {...p.lastPrice} />
			<Clickable onClick={() => { p.updateTradeOrder(p.id, undefined, p.topBid.value); }}>
				<ValueDenomination className="top-bid" {...p.topBid} />
			</Clickable>
			<Clickable onClick={() => { p.updateTradeOrder(p.id, undefined, p.topAsk.value); }}>
				<ValueDenomination className="top-ask" {...p.topAsk} />
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
	);
};

TradePanelItem.propTypes = {
	className: React.PropTypes.string,
	name: React.PropTypes.string,
	numShares: React.PropTypes.number,
	limitPrice: React.PropTypes.number,
	sideOptions: React.PropTypes.array,
	lastPrice: React.PropTypes.object,
	topBid: React.PropTypes.object,
	topAsk: React.PropTypes.object,
	feeToPay: React.PropTypes.object,
	tradeSummary: React.PropTypes.object,
	sharesOwned: React.PropTypes.number,
	etherAvailable: React.PropTypes.number,
	updateTradeOrder: React.PropTypes.func
};

export default TradePanelItem;
