import React from 'react';
import classnames from 'classnames';
import ValueDenomination from '../../../modules/common/components/value-denomination';
import TradePanelRow from '../../../modules/trade/components/trade-panel-row';
import { SUMMARY } from '../../../modules/trade/constants/row-types';

const TradePanelFooter = (p) => (
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
		{p.summary.tradeOrders.map((trade, i) => {
			return	<TradePanelRow
						key={`${trade.data.outcomeName}-${i}`}
						trade={trade}
						constants={p.constants}
						type={SUMMARY}
					/>
		})}
		<tr className="summary-totals">
			<td />
			<td colSpan="2">
				<div className="total-transaction-summary" >
					<pre className="transaction-type"></pre>
					<div className="transaction-shares">
						<ValueDenomination className="shares" {...p.summary.totalShares} />
					</div>
					<pre className="shares-at"></pre>
					<pre className="transaction-price"></pre>
				</div>
			</td>
			<td colSpan="4" />
			<td className="fee-to-pay" >
				<ValueDenomination {...p.summary.feeToPay} />
			</td>
			<td className="total-cost" >
				<ValueDenomination {...p.summary.totalEther} />
			</td>
		</tr>
	</tfoot>
);

TradePanelFooter.propTypes = {
	summary: React.PropTypes.object,
	constants: React.PropTypes.object
};

export default TradePanelFooter;
