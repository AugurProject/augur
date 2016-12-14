import React from 'react';

import ValueDenomination from 'modules/common/components/value-denomination';

import { SCALAR } from 'modules/markets/constants/market-types';

import getValue from 'utils/get-value';
import setShareDenomination from 'utils/set-share-denomination';

const MarketPositionsRow = (p) => {

	const quantityOfShares = setShareDenomination(getValue(p, 'outcome.position.qtyShares.formatted'), p.selectedShareDenomination);

	const outcomeName = getValue(p, 'outcome.name');
	const lastPricePercent = getValue(p, 'outcome.lastPricePercent.rounded');
	const purchasePrice = getValue(p, 'outcome.position.purchasePrice.formatted');
	const lastPrice = getValue(p, 'outcome.lastPrice.formatted');
	const realizedNet = getValue(p, 'outcome.position.realizedNet.formatted');
	const unrealizedNet = getValue(p, 'outcome.position.unrealizedNet.formatted');
	const totalNet = getValue(p, 'outcome.position.totalNet.formatted');

	return (
		<article className="market-positions-row not-selectable" >
			{p.marketType === SCALAR ?
				<ValueDenomination formatted={lastPricePercent} /> :
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
