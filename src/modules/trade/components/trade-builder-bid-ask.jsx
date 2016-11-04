import React from 'react';
import classnames from 'classnames';
import ValueDenomination from '../../../modules/common/components/value-denomination';

const TradeBuilderBidAsk = p => (
	<span>
		<div
			className={classnames('trade-builder-bid-ask', { 'is-of-current-user': p.bidAsk.isOfCurrentUser }, p.className)}
			data-tip={classnames({ 'You have an open order at this price': p.bidAsk.isOfCurrentUser })}
		>
			<ValueDenomination
				{...p.bidAsk.shares}
				className={classnames('shares')}
				formatted={p.bidAsk.shares.rounded}
				fullPrecision={p.bidAsk.shares.fullPrecision}
				denomination={undefined}
			/>

			<span className="shares-at">@</span>

			<ValueDenomination
				className={classnames('price')}
				{...p.bidAsk.price}
			/>
		</div>
	</span>
);

TradeBuilderBidAsk.propTypes = {
	className: React.PropTypes.string,
	bidAsk: React.PropTypes.object
};

export default TradeBuilderBidAsk;
