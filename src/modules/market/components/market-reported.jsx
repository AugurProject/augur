import React from 'react';

import MarketBasics from 'modules/market/components/market-basics';
import MarketDetails from 'modules/market/components/market-details';

const MarketReported = p => (
	<article className="market-reported">
		<div className="market-group">
			<article className="market-reported-details">
				<MarketBasics {...p.market} />
				<MarketDetails key="market-info" {...p.market} />
			</article>
		</div>
	</article>
);

export default MarketReported;
