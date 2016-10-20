import React from 'react';

import MarketBasics from 'modules/market/components/market-basics';
import MarketInfo from 'modules/market/components/market-info';

const MarketReported = p => (
	<article className="market-reported">
		<MarketBasics
			{...p.market}
			isUpdaterVisible
			marketDataAge={p.marketDataAge}
			updateData={p.marketDataUpdater.update}
			updateIntervalSecs={p.marketDataUpdater.updateIntervalSecs}
		/>
		<MarketInfo key="market-info" {...p.market} />
	</article>
);

export default MarketReported;
