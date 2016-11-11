import React from 'react';

import MarketActive from 'modules/market/components/market-active';
import MarketReporting from 'modules/market/components/market-reporting';
import MarketReported from 'modules/market/components/market-reported';
import NullStateMessage from 'modules/common/components/null-state-message';

import getValue from 'utils/get-value';

const MarketView = (p) => {
	const nullMessage = 'No Market Data';

	const isAvailable = getValue(p, 'market.id');
	const isOpen = getValue(p, 'market.isOpen');
	const isPendingReport = getValue(p, 'market.isPendingReport');

	return (
		<section id="market_view">
			{!isAvailable && <NullStateMessage message={nullMessage} />}
			{isAvailable && isOpen && !isPendingReport && <MarketActive {...p} />}
			{isAvailable && isPendingReport && <MarketReporting {...p} />}
			{isAvailable && !isOpen && !isPendingReport && <MarketReported {...p} />}
		</section>
	);
};

export default MarketView;
