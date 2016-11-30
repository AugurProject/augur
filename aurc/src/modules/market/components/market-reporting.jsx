import React from 'react';

import ReportPanel from 'modules/reports/components/report-panel';

const MarketReporting = p => (
	<article className="market-reporting">
		<div className="market-group">
			<ReportPanel {...p} />
		</div>
	</article>
);

export default MarketReporting;
