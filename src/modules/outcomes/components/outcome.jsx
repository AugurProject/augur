import React from 'react';
import classNames from 'classnames';

import Link from 'modules/link/components/link';
import ValueDenomination from 'modules/common/components/value-denomination';
import OutcomeTrade from 'modules/outcomes/components/outcome-trade';

import { SCALAR } from 'modules/markets/constants/market-types';

import getValue from 'utils/get-value';
import setShareDenomination from 'utils/set-share-denomination';

const Outcome = (p) => {
	const topBidShares = setShareDenomination(getValue(p, 'outcome.topBid.shares.formatted'), p.selectedShareDenomination);
	const topAskShares = setShareDenomination(getValue(p, 'outcome.topAsk.shares.formatted'), p.selectedShareDenomination);

	const topBidPrice = getValue(p, 'outcome.topBid.price.formatted');
	const topAskPrice = getValue(p, 'outcome.topAsk.price.formatted');

	const lastPrice = getValue(p, 'outcome.lastPrice.formatted');
	const lastPricePercent = getValue(p, 'outcome.lastPricePercent.rounded');

	return (
		<article className={classNames('outcome', { selected: p.selectedOutcome.id === p.outcome.id })}>
			<Link
				className={classNames('outcome-row', { selected: p.selectedOutcome.id === p.outcome.id })}
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
			<OutcomeTrade
				marketType={p.marketType}
				selectedOutcome={p.selectedOutcome}
				tradeSummary={p.tradeSummary}
				submitTrade={p.submitTrade}
				selectedShareDenomination={p.selectedShareDenomination}
				updateSelectedTradeSide={p.updateSelectedTradeSide}
			/>
		</article>
	);
};

export default Outcome;
