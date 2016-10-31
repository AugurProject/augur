import React from 'react';
import classnames from 'classnames';

import Link from 'modules/link/components/link';
import ValueDenomination from 'modules/common/components/value-denomination';

import getValue from 'utils/get-value';

const OutcomeRow = (p) => {
	const topBidShares = getValue(p, 'outcome.topBid.shares.formatted');
	const topBidPrice = getValue(p, 'outcome.topBid.price.formatted');
	const topAskPrice = getValue(p, 'outcome.topAsk.price.formatted');
	const topAskShares = getValue(p, 'outcome.topAsk.shares.formatted');
	const lastPrice = getValue(p, 'outcome.lastPrice.formatted');

	return (
		<Link
			className={classnames('outcome-row', (p.selectedOutcome.id === p.outcome.id && 'selected'))}
			onClick={() => { p.updateSelectedOutcome(p.outcome); }}
		>
			<span className="outcome">{p.outcome.name || ''}</span>
			<ValueDenomination formatted={topBidShares} />
			<ValueDenomination className="emphasized" formatted={topBidPrice} />
			<ValueDenomination className="emphasized" formatted={topAskPrice} />
			<ValueDenomination formatted={topAskShares} />
			<ValueDenomination formatted={lastPrice} />
		</Link>
	);
};

export default OutcomeRow;
