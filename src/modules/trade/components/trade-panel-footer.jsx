import React from 'react';
import classnames from 'classnames';

const TradePanelFooter = (p) => {
	console.log('TradePanelSummary p -- ', p);

	return (
		<tfoot className="transaction-summary">
			<tr className={classnames('header-row', 'summary-title')}>
				<td colSpan="9" >Trade Summary</td>
			</tr>
			<tr className={classnames('header-row', 'summary-headers')}>
				<td>Outcomes</td>
				<td colSpan="6">Transactions</td>
				<td>Fee</td>
				<td>Profit/Loss</td>
			</tr>
		</tfoot>
	)
};

TradePanelFooter.propTypes = {
	tradeOrders: React.PropTypes.array
};

export default TradePanelFooter;