import React from 'react';
import classnames from 'classnames';

import Link from 'modules/link/components/link';
import ValueDenomination from 'modules/common/components/value-denomination';

import { SCALAR } from 'modules/markets/constants/market-types';

import getValue from 'utils/get-value';
import setShareDenomination from 'utils/set-share-denomination';

const OutcomeRow = (p) => {
	const topBidShares = setShareDenomination(getValue(p, 'outcome.topBid.shares.formatted'), p.selectedShareDenomination);
	const topAskShares = setShareDenomination(getValue(p, 'outcome.topAsk.shares.formatted'), p.selectedShareDenomination);

	const topBidPrice = getValue(p, 'outcome.topBid.price.formatted');
	const topAskPrice = getValue(p, 'outcome.topAsk.price.formatted');

	const lastPrice = getValue(p, 'outcome.lastPrice.formatted');
	const lastPricePercent = getValue(p, 'outcome.lastPricePercent.rounded');

	return (
		<Link
			className={classnames('outcome-row', (p.selectedOutcome.id === p.outcome.id && 'selected'))}
			onClick={() => { p.updateSelectedOutcome(p.outcome); }}
		>
			{p.marketType === SCALAR ?
				<ValueDenomination formatted={lastPricePercent} /> :
				<span className="outcome">{p.outcome.name || ''}</span>
			}
			<ValueDenomination formatted={topBidShares} />
			<ValueDenomination className="emphasized" formatted={topBidPrice} />
			<ValueDenomination className="emphasized" formatted={topAskPrice} />
			<ValueDenomination formatted={topAskShares} />
			<ValueDenomination formatted={lastPrice} />
		</Link>
	);
};

export default OutcomeRow;
