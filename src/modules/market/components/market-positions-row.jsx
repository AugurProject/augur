import React from 'react';

import EmDash from 'modules/common/components/em-dash';
import ValueDenomination from 'modules/common/components/value-denomination';

import { SCALAR } from 'modules/markets/constants/market-types';

import getValue from 'utils/get-value';

const MarketPositionsRow = (p) => {
	console.log('p -- ', p);

	const outcomeName = getValue(p, 'outcome.name');
	const lastPricePercent = getValue(p, 'lastPricePercent.rounded') || <EmDash />;
	const quantityOfShares = getValue(p, 'outcome.position.qtyShares.formatted') || <EmDash />;
	const purchasePrice = getValue(p, 'outcome.position.purchasePrice.formatted') || <EmDash />;
	const lastPrice = getValue(p, 'outcome.position.lastPrice.formatted') || <EmDash />;
	const realizedNet = getValue(p, 'outcome.position.realizedNet.formatted') || <EmDash />;
	const unrealizedNet = getValue(p, 'outcome.position.unrealizedNet.formatted') || <EmDash />;
	const totalNet = getValue(p, 'outcome.position.totalNet.formatted') || <EmDash />;

	return (
		<article className="market-positions-row not-selectable" >
			{p.type === SCALAR ?
				<span>{lastPricePercent}</span> :
				<span>{outcomeName}</span>
			}
			<ValueDenomination formatted={quantityOfShares} />
			<ValueDenomination formatted={purchasePrice} />
			<ValueDenomination formatted={lastPrice} />
			<ValueDenomination formatted={realizedNet} />
			<ValueDenomination formatted={unrealizedNet} />
			<ValueDenomination formatted={totalNet} />
		</article>
	);
};

export default MarketPositionsRow;
