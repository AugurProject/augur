import React from 'react';

import Dropdown from 'modules/common/components/dropdown';

import { SCALAR } from 'modules/markets/constants/market-types';

const MarketDataHeader = p => (
	<article className="market-data-header">
		<h3>{p.marketDescription}</h3>
		<div className="market-data-header-actions">
			{p.marketType === SCALAR &&
				<Dropdown
					default={p.selectedShareDenomination}
					options={p.shareDenominations}
					onChange={(denomination) => { p.updateSelectedShareDenomination(p.marketID, denomination); }}
				/>
			}
		</div>
	</article>
);

export default MarketDataHeader;
