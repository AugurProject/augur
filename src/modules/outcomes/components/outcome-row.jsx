import React from 'react';
import classnames from 'classnames';

import Link from 'modules/link/components/link';
import ValueDenomination from 'modules/common/components/value-denomination';

const OutcomeRow = p => (
	<Link
		className={classnames('outcome-row', (p.selectedOutcome.id === p.outcome.id && 'selected'))}
		onClick={() => { p.updateSelectedOutcome(p.outcome); }}
	>
		<span className="outcome">{p.outcome.name || ''}</span>
		<ValueDenomination formatted={p.outcome.topBid.shares.formatted} />
		<ValueDenomination formatted={p.outcome.topBid.price.formatted} />
		<ValueDenomination formatted={p.outcome.topAsk.price.formatted} />
		<ValueDenomination formatted={p.outcome.topAsk.shares.formatted} />
		<ValueDenomination formatted={p.outcome.lastPrice.formatted} />
	</Link>
);

export default OutcomeRow;
