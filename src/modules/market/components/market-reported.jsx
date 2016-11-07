import React from 'react';

import MarketBasics from 'modules/market/components/market-basics';
import MarketDetails from 'modules/market/components/market-details';

const MarketReported = p => (
	<article className="market-reported">
		<MarketBasics
			{...p.market}
			isUpdaterVisible
			marketDataAge={p.marketDataAge}
			updateData={p.marketDataUpdater.update}
			updateIntervalSecs={p.marketDataUpdater.updateIntervalSecs}
		/>
		<MarketDetails key="market-info" {...p.market} />
	</article>
);

export default MarketReported;
