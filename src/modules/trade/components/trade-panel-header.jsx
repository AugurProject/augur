import React from 'react';

const TradePanelHeader = (p) => (
	<thead className="trade-panel-header">
		<tr className="header-row">
			<th className="outcome-name">Outcomes</th>
			<th className="last-price">Last</th>
			<th className="bid">{!!p.selectedOutcomeID ? 'Bids' : 'Top Bid'}</th>
			<th className="ask">{!!p.selectedOutcomeID ? 'Asks' : 'Top Ask'}</th>
			<th className="buy-sell-button"></th>
			<th className="num-shares">Shares</th>
			<th className="limit-price">Limit</th>
			<th className="fee-to-pay">Fee</th>
			<th className="total-cost">Cost</th>
		</tr>
	</thead>
);

TradePanelHeader.propTypes = {
	selectedOutcomeID: React.PropTypes.string
};

export default TradePanelHeader;
