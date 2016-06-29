import React from 'react';

const TradePanelHeader = (p) => {
	console.log('TradePanelHeader p -- ', p);

	return (
		<thead className="trade-panel-header">
			<tr className="header-row">
				<th className="outcome-name">Outcomes</th>
				<th className="last-price">Last</th>
				<th className="top-bid">{!!p.selectedOutcomeID ? 'Bid' : 'Top Bid'}</th>
				<th className="top-ask">{!!p.selectedOutcomeID ? 'Ask' : 'Top Ask'}</th>
				<th className="num-shares">Side</th>
				<th className="num-shares">Shares</th>
				<th className="limit-price">Limit</th>
				<th className="fee-to-pay">Fee</th>
				<th className="total-cost">Profit/Loss</th>
			</tr>
		</thead>
	)
};

TradePanelHeader.propTypes = {
	selectedOutcomeID: React.PropTypes.string
};

export default TradePanelHeader;