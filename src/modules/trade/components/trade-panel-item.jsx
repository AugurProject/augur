import React from 'react';
import classnames from 'classnames';

import ValueDenomination from '../../common/components/value-denomination';
import Input from '../../common/components/input';
import Dropdown from '../../common/components/dropdown';
import {Clickable} from '../../common/components/clickable';
import {Collapse} from '../../common/components/collapse';
import OrderBook from '../../bids-asks/components/order-book';

const TradePanelItem = React.createClass({
	propTypes: {
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
	},

	render: function () {
		var p = this.props;
		const isOutcomeActive = p.selectedOutcomeID === p.id;
		return (
			<div className={ classnames('trade-panel-item', p.className, {active: isOutcomeActive}) }>
				<Clickable onClick={() => { p.updateSelectedOutcome(p.id) }}>
					<div className="trade-panel-item-content">

						<span className="outcome-name">{ p.name }</span>

						<ValueDenomination className="last-price" { ...p.lastPrice } />
						<Clickable onClick={() => { p.updateTradeOrder(p.id, undefined,  p.topBid.value) }}>
							<ValueDenomination className="top-bid" { ...p.topBid } />
						</Clickable>
						<Clickable onClick={() => { p.updateTradeOrder(p.id, undefined, p.topAsk.value) }}>
							<ValueDenomination className="top-ask" { ...p.topAsk } />
						</Clickable>

						<Dropdown
							selected={ p.sideOptions.find(opt => opt.value === p.side) }
							options={p.sideOptions}
							onChange={(selectedOption) => { p.updateTradeOrder(p.id, undefined, undefined, selectedOption) }}
						/>

						<Input
							className="num-shares"
							type="text"
							value={ p.numShares }
							isClearable={ false }
							onChange={ (value) => p.updateTradeOrder(p.id, parseFloat(value) || 0, undefined) }/>

						<Input
							className="limit-price"
							type="text"
							value={ p.limitPrice }
							isClearable={ false }
							onChange={ (value) => p.updateTradeOrder(p.id, undefined, parseFloat(value) || 0) }/>

						<ValueDenomination className="fee-to-pay" { ...p.feeToPay } />
						<ValueDenomination className="total-cost" { ...p.profitLoss } />
					</div>
				</Clickable>

				<div>
					<Collapse isOpen={isOutcomeActive}>
						<OrderBook
							key={`order-book-${p.id}`}
							outcome={ p }
							updateTradeOrder={ p.trade.updateTradeOrder }
							bids={ p.orderBook.bids }
							asks={ p.orderBook.asks }
						/>
					</Collapse>

				</div>
			</div>
		);
	}
});

module.exports = TradePanelItem;