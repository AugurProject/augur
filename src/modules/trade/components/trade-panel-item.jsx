import React from 'react';
import classnames from 'classnames';

import ValueDenomination from '../../common/components/value-denomination';
import Input from '../../common/components/input';

module.exports = React.createClass({
	propTypes: {
		className: React.PropTypes.string,
		outcomeName: React.PropTypes.string,

		numShares: React.PropTypes.number,
		limitPrice: React.PropTypes.number,

		lastPrice: React.PropTypes.object,
		topBid: React.PropTypes.object,
		topAsk: React.PropTypes.object,
		feeToPay: React.PropTypes.object,
		totalCost: React.PropTypes.object,

		sharesOwned: React.PropTypes.number,
		etherAvailable: React.PropTypes.number,

		onChangeTradesInProgress: React.PropTypes.func
	},

	render: function() {
		var p = this.props;
		return (
			<div className={ classnames('trade-panel-item', p.className) }>

				<span className="outcome-name">{ p.outcomeName }</span>
				<ValueDenomination className="last-price" { ...p.lastPrice } />
				<ValueDenomination className="top-bid" { ...p.topBid } />
				<ValueDenomination className="top-ask" { ...p.topAsk } />

				<Input
					className="num-shares"
					type="text"
					value={ p.numShares }
					isClearable={ false }
					onChange={ (value) => p.onChangeTradesInProgress(parseFloat(value) || 0, parseFloat(p.limitPrice) || 0) } />

				<Input
					className="limit-price"
					type="text"
					value={ p.limitPrice }
					isClearable={ false }
					onChange={ (value) => p.onChangeTradesInProgress(parseFloat(p.numShares) || 0, parseFloat(value) || 0) } />

				<ValueDenomination className="fee-to-pay" { ...p.feeToPay } isColorized={ true } />
				<ValueDenomination className="total-cost" { ...p.totalCost } isColorized={ true } />
			</div>
		);
	}
});