import React from 'react';
import TradePanelItem from './trade-panel-item';
import Transaction from '../../transactions/components/transaction';
import Clickable from '../../common/components/clickable';

const TradePanel = (p) => {

	// console.log('p -- ', p);

	return (
		<section
			className="trade-panel"
			onClick={() => p.updateSelectedOutcome(null)}
		>
			<div className="trade-builder">
				<div className="trade-panel-item-header">
					<span className="outcome-name">&nbsp;</span>
					<span className="last-price">Last</span>
					<span className="top-bid">{!!p.selectedOutcomeID ? 'Bid' : 'Top Bid'}</span>
					<span className="top-ask">{!!p.selectedOutcomeID ? 'Ask' : 'Top Ask'}</span>
					<span className="num-shares">Side</span>
					<span className="num-shares">Shares</span>
					<span className="limit-price">Limit</span>
					<span className="fee-to-pay">Fee</span>
					<span className="total-cost">Profit/Loss</span>
				</div>
				{p.outcomes && p.outcomes.map(outcome => (
					<TradePanelItem
						key={outcome.id}
						sideOptions={p.sideOptions}
						updateSelectedOutcome={p.updateSelectedOutcome}
						selectedOutcomeID={p.selectedOutcomeID}
						{...outcome}
						{...outcome.trade}
					/>
				))}
			</div>

			{p.tradeOrders && !!p.tradeOrders.length &&
			<div className="trade-orders">
				<h5>Trade Summary</h5>
				{p.tradeOrders && p.tradeOrders.map((tradeOrder, i) => (
					<Transaction
						key={i}
						className="order"
						{...tradeOrder}
						status={undefined}
					/>
				))}

				<Transaction
					type="trade_summary"
					shares={p.totalShares}
					className="order total"
					ether={p.totalEther}
					gas={p.totalGas}
					status={undefined}
				/>
			</div>
			}
			<div className="place-trade-container">
				<button
					className="button place-trade" disabled={!p.tradeOrders || !p.tradeOrders.length}
					onClick={p.onSubmitPlaceTrade}
				>
					Place Trade
				</button>
			</div>
		</section>
	);
};

TradePanel.propTypes = {
	outcomes: React.PropTypes.array,
	tradeOrders: React.PropTypes.array,
	onSubmitPlaceTrade: React.PropTypes.func,
	selectedOutcomeID: React.PropTypes.string
};

export default TradePanel;
