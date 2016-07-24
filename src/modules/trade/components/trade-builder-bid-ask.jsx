import React from 'react';
import classnames from 'classnames';

import ValueDenomination from '../../../modules/common/components/value-denomination';

const TradeBuilderBidAsk = (p) => (
	<div className={classnames('trade-builder-bid-ask', p.className)}>
		<ValueDenomination
			className={classnames('shares')}
			{...p.bidAsk.shares}
			denomination={undefined}
		/>

		<span className="shares-at">@</span>

		<ValueDenomination
			className={classnames('price')}
			{...p.bidAsk.price}
		/>
	</div>
);

TradeBuilderBidAsk.propTypes = {
	className: React.PropTypes.string,
	bidAsk: React.PropTypes.object
};

export default TradeBuilderBidAsk;
